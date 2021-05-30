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
const { MongoClient } = require("mongodb")

const baseUrl = "https://datacenter.eastmoney.com/securities/api/data/v1/get"
const reportNames = {
  "balance": "RPT_DMSK_FN_BALANCE",
  "cashflow": "RPT_DMSK_FN_CASHFLOW",
  "income": "RPT_DMSK_FN_INCOME",
  "cpd": "RPT_LICO_FN_CPD",
}
const defaultParams = {
  "callback": "jQuery11230026427241885568442_1621532231897",
  "token": "894050c76af8597a853f5b408b759f5d",
  "columns": "ALL",
}
const re = /jQuery[0-9]+_[0-9]+\((.*)\)\;/
const configPath = "./config/companies.yaml"
const dbName = "niubi"


async function insert(client, cname, data) {
  try {
    const res = await client.db(dbName).collection(cname).insertMany(data, { ordered: true })
    console.log(`${res.insertedCount} documents were inserted to ${cname}`)
  } catch (e) {
    console.log("Insert failed due to unexpected error: " + e)
  }
}


async function index(client, cname, indexes, isUnique = false) {
  try {
    const res = await client.db(dbName).collection(cname).createIndex(indexes, { unique: isUnique })
    console.log(`Index ${JSON.stringify(indexes)} created for ${cname}`)
  } catch (e) {
    console.log("Failed to create index due to unexpected error: " + e)
  }
}


async function initDB(client) {
  // init companies collection from the config file
  const companies = yaml.load(fs.readFileSync(configPath, "utf8"))
  const cdoc = []
  for (const [_, v] of Object.entries(companies)) {
    cdoc.push({
      "SECURITY_NAME_ABBR": v["name"],
      "SECURITY_CODE": v["code"]
    })
  }
  await index(client, "companies", { SECURITY_CODE: 1 }, true)
  await insert(client, "companies", cdoc)

  // add data to corresponding collections
  for (const [cname, rname] of Object.entries(reportNames)) {
    // add unique constrain for for each report
    await index(client, cname, { REPORT_DATE: -1, SECURITY_CODE: 1 }, true)
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
            await insert(client, cname, parsedData["result"]["data"])
          }
        })
      }).on("error", (e) => {
        console.log(e.message)
      })
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
  } finally {
    /**
     * FIXME: so ... somehow client.close() is always executed before
     * inserts are finished, causing MongoError: Topology is closed, please connect
     * couldn't figure out exactly what happened - maybe try out mongoose?
     * 
     * current janky workaround: timeout for 10s before closing
     */
    await new Promise(r => setTimeout(r, 10000))
    await client.close()
  }
}


main().catch(console.error)
