/**
 * Init NOSQL db
 * 1. companies: {SECURITY_NAME_ABBR, unique_index(SECURITY_CODE)}
 * 2. balance: {SECURITY_NAME_ABBR, unique_index(SECURITY_CODE, REPORTDATE), ...etc}
 * 3. income: {SECURITY_NAME_ABBR, unique_index(SECURITY_CODE, REPORTDATE), ...etc}
 * 4. cashflow: {SECURITY_NAME_ABBR, unique_index(SECURITY_CODE, REPORTDATE), ...etc}
 * 5. cpd: {SECURITY_NAME_ABBR, unique_index(SECURITY_CODE, REPORTDATE), ...etc}
 * 
 * (currently relies 100% on the unique contrains on the indexes for dedup, could be better but meh)
 */

const fs = require("fs")
const yaml = require("js-yaml")
const https = require("https")
const http = require("http")
const { MongoClient } = require("mongodb")

const re = /jQuery[0-9]+_[0-9]+\((.*)\)\;/
const configPath = "./config/companies.yaml"


async function insert(client, cname, data, dbName) {
  try {
    const res = await client.db(dbName).collection(cname).insertMany(data, { ordered: true })
    console.log(`${res.insertedCount} documents were inserted to ${cname}`)
  } catch (e) {
    console.log("Insert failed due to unexpected error: " + e)
  }
}


async function index(client, cname, indexes, isUnique = false, dbName) {
  try {
    const res = await client.db(dbName).collection(cname).createIndex(indexes, { unique: isUnique })
    console.log(`Index ${JSON.stringify(indexes)} created for ${cname}`)
  } catch (e) {
    console.log("Failed to create index due to unexpected error: " + e)
  }
}


async function update(client, cname, filters, data, upsert = true, dbName) {
  try {
    const res = await client.db(dbName).collection(cname).updateOne(filters, data, {upsert: upsert})
    console.log(`Data has been updated for ${filters} in ${cname}`)
  } catch (e) {
    console.log("Failed to update due to unexpected error: ", e)
  }
}


async function initDB(client) {
  const baseUrl = "https://datacenter.eastmoney.com/securities/api/data/v1/get"
  const reportNames = {
    // "balance": "RPT_DMSK_FN_BALANCE",
    // "cashflow": "RPT_DMSK_FN_CASHFLOW",
    // "income": "RPT_DMSK_FN_INCOME",
    "cpd": "RPT_LICO_FN_CPD",
  }
  const defaultParams = {
    "callback": "jQuery11230026427241885568442_1621532231897",
    "token": "894050c76af8597a853f5b408b759f5d",
    "columns": "ALL",
  }
  const dbName = "niubi"
  // init companies collection from the config file
  const companies = yaml.load(fs.readFileSync(configPath, "utf8"))
  const cdoc = []
  for (const [_, v] of Object.entries(companies)) {
    cdoc.push({
      "SECURITY_NAME_ABBR": v["name"],
      "SECURITY_CODE": v["code"]
    })
  }
  await index(client, "companies", { SECURITY_CODE: 1 }, true, dbName)
  await insert(client, "companies", cdoc, dbName)

  // add data to corresponding collections
  for (const [cname, rname] of Object.entries(reportNames)) {
    // add unique constrain for for each report
    await index(client, cname, { REPORT_DATE: -1, SECURITY_CODE: 1 }, true, dbName)
    for (const [_, v] of Object.entries(companies)) {
      let queries = []
      for (const [k, v] of Object.entries(defaultParams)) {
        queries.push(k + "=" + v)
      }
      queries.push(`reportName=${rname}`)
      queries.push(`filter=(SECURITY_NAME_ABBR="${v['name']}")`)
      const req = baseUrl + "?" + queries.join("&")
      // get report data
      https.get(req, async (resp) => {
        let data = ""
        resp.on("data", (chunk) => {
          data += chunk
        })
        resp.on("end", async () => {
          data = data.replace(re, "$1")  // make sure data is JSON decodable
          const parsedData = JSON.parse(data)
          if (parsedData["result"] == null) {
            console.log(`No data returned for ${v['name']} ${rname}`)
            console.log(`${data} (${req})`)
          } else {
            // make sure schema matches for all docs
            parsedData["result"]["data"].map(x => x["REPORT_DATE"] = (x["REPORTDATE"] || x["REPORT_DATE"]))
            await insert(client, cname, parsedData["result"]["data"], dbName)
          }
        })
      }).on("error", (e) => {
        console.log(e.message)
      })
    }
  }
}


async function initf10DB(client) {
  const dbName = "f10"
  const reportNames = {
    "balance": "zcfzb",
    "income": "lrb",
    "cashflow": "xjllb",
  }

  async function getDates(code, rtype, ctype) {
    function parse(data) {
      // TODO: check against db to only download the latest data, avoid too many api calls
      try {
        const res = JSON.parse(data)["data"].map(x => x["REPORT_DATE"].substr(0, 10))
        return res
      } catch (e) {
        console.error(`Empty response: ${data}`)
      }
    }
    const req = `http://f10.eastmoney.com/NewFinanceAnalysis/${rtype}DateAjaxNew?companyType=${ctype}&reportDateType=0&code=${code}`
    return new Promise((resolve, reject) => {
      http.get(req, (resp) => {
        try {
          let data = ""
          resp.on("data", (chunk) => {
            data += chunk
          })
          resp.on("error", reject)
          resp.on("end", () => {
            resolve(parse(data))
          })
        } catch (e) {
          console.error(e)
          console.log(req)
        }
      })
    })
  }

  async function getData(code, dates, rtype, ctype, dtype=2) {
    // reportDateType:
    //   按报告期（同比） ReportDateType=0，ReportType=1
    //   按年（同比） ReportDateType=1，ReportType=1
    //   单季度（同比） ReportDateType=0，ReportType=2
    // companyType: ???
    const url = `http://f10.eastmoney.com/NewFinanceAnalysis/${rtype}AjaxNew?companyType=${ctype}&reportDateType=0&reportType=${dtype}`
    const allData = []
    async function run(dates) {
      const req = url + "&dates=" + dates.join("%2C") + "&code=" + code
      return new Promise((resolve) => {
        http.get(req, (resp) => {
          let data = ""
          resp.on("data", (chunk) => {
            data += chunk
          })
          resp.on("end", () => {
            try {
              const res = JSON.parse(data)
              resolve(allData.push(...res["data"]))
            } catch (e) {
              if (e instanceof TypeError) {
                console.log("No data returned for dates:", dates)
                resolve([])
              } else {
                console.error(e)
                console.log(req)
              }
            }
          })
        })
      })
    }
    while (dates.length > 0) {
      // f10 api has a page size limit, it will not return more than 9 entries
      // limit to 2 years of data per request
      await run(dates.slice(0, 8))
      dates = dates.slice(8)
    }
    return allData
  }

  async function getSECU(name) {
    // f10 API only understand the specific secucode (with sz, sh, ...)
    const req = `https://datacenter.eastmoney.com/securities/api/data/v1/get?callback=jQuery11230026427241885568442_1621532231897&token=894050c76af8597a853f5b408b759f5d&columns=ALL&reportName=RPT_LICO_FN_CPD&filter=(SECURITY_NAME_ABBR="${name}"))`
    return new Promise((resolve) => {
      https.get(req, (resp) => {
        let data = ""
        resp.on("data", (chunk) => {
          data += chunk
        })
        resp.on("end", () => {
          try {
            resolve(JSON.parse(data.replace(re, "$1"))["result"]["data"][0]["SECUCODE"])
          } catch (e) {
            console.error(e)
            console.log(req)
          }
        })
      })
    })
  }

  const companies = yaml.load(fs.readFileSync(configPath, "utf8"))
  for (const [_, c] of Object.entries(companies)) {
    let ctype = 4
    for (const [cname, rname] of Object.entries(reportNames)) {
      const code = await getSECU(c["name"])
      await index(client, cname, { REPORT_DATE: -1, SECURITY_CODE: 1 }, true, dbName)
      console.log(`Fetching ${cname} data for`, c["name"], `(${code})`)
      // try all company types until hitting the correct one
      let d
      while (ctype > 0) {
        try {
          let dates = await getDates(code, rname, ctype)
          console.log(`Getting data for ${dates.length} quarters`)
          if (cname === "balance") {  // 负债表只有报告期数据
            d = await getData(code, dates, rname, ctype, 1)
          } else {
            d = await getData(code, dates, rname, ctype)
          }
          console.log(`${d.length} reports downloaded`)
          break
        } catch (e) {
          ctype --
          console.log("Incorrect company type for", c["name"], "trying", ctype)
          continue
        }
      }
      if (ctype < 0) {
        console.log("Cannot get data for", c["name"])
      } else {
        await insert(client, cname, d, dbName)
      }
    }
  }
}


async function main() {
  const client = new MongoClient(
    "mongodb+srv://niubi:123@cluster0.lfrkz.mongodb.net/niubi?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  try {
    await client.connect()
    await initDB(client)
    await initf10DB(client)
  } finally {
    /**
     * FIXME: so ... somehow client.close() is always executed before
     * inserts are finished, causing MongoError: Topology is closed, please connect
     * couldn't figure out exactly what happened - maybe try out mongoose?
     * 
     * current janky workaround: timeout before closing
     */
    await new Promise(r => setTimeout(r, 300000)) // 5min
    await client.close()
  }
}


main().catch(console.error)
