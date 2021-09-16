const fs = require("fs")
const yaml = require("js-yaml")
const { argv } = require("process")
const moment = require("moment")
const datacenter = require("./apis/datacenter")
const f10 = require("./apis/f10")
const db = require("./apis/database")
const tickers = require("./apis/getDailyStockPrice")

const configPath = "./config/companies.yaml"


async function run(f, params = []) {
  return new Promise((r) => (r(f(...params))))
}


async function loadF10Reports(client, dbName, secucode, bulkWrite) {
  for (const [cname, rname] of Object.entries(f10.reportNames)) {
    let ctype = 4
    await db.index(
      client, dbName, cname, { REPORT_DATE: -1, SECURITY_CODE: 1 }, true
    )
    // try all company types until hitting the correct one
    let data
    while (ctype > 0) {
      try {
        let dates = await f10.getDates(client, secucode, cname, rname, ctype)
        if (dates.length == 0) {
          console.log(`No new ${cname} data found for ${secucode}`)
          break
        } else {
          console.log("Getting data for dates", dates)
        }

        if (cname === "balance") {  // 负债表只有报告期数据
          data = await f10.getData(secucode, dates, rname, ctype, 1)
        } else {
          data = await f10.getData(secucode, dates, rname, ctype)
        }
        console.debug(`${data.length} reports downloaded`)
        break
      } catch (e) {
        ctype --
        console.error("Incorrect company type for", secucode, "trying", ctype)
        continue
      }
    }

    if (ctype < 0 || !data || data.length == 0) {
      console.log("Empty data returned for", {code: secucode})
    } else {
      if (bulkWrite) {
        await db.insert(client, dbName, cname, data, bulkWrite)
      } else {
        try {
          for (d of data) {
            await db.insert(client, dbName, cname, d)
          }
        } catch (e) {
          console.error("Error inserting data: ", e, data)
        }
      }
    }

    // add timeout between requests to avoid trouble
    await new Promise(r => setTimeout(r, 5000))
  }
}


async function updateCompanies(client, companies, dbName = "niubi") {
  await db.index(client, dbName, "companies", { SECURITY_CODE: 1 }, true)
  const cursor = db.query(client, dbName, "companies", [{
    $group: { _id: "$SECURITY_CODE" }
  }])
  const loadedCompanies = new Array()
  while (await cursor.hasNext()) {
    const nxt = await cursor.next()
    loadedCompanies.push(nxt["_id"])
  }

  for (const [_, v] of Object.entries(companies)) {
    const secu = await datacenter.getSECU(v["name"])
    const code = String(v["code"]).padStart(6, "0")
    const data = {
      "SECURITY_NAME_ABBR": v["name"],
      "SECURITY_CODE": code,
      "SECUCODE": secu,
      "BASIC_INFO": v["info"],
      "LAST_UPDATED": new Date(new Date().toUTCString()),
    }
    if (loadedCompanies.indexOf(code) > -1) {
      await db.update(client, dbName, "companies", { SECURITY_CODE: code }, data)
      await run(loadF10Reports, [client, "f10", secu, false])
      console.log(`Data updated for ${v["name"]} (${code})`)
    } else {
      await db.insert(client, dbName, "companies", data)
      await run(loadF10Reports, [client, "f10", secu, true])
      console.log(`New entry created for ${v["name"]} (${code})`)
    }
  }
}


async function updateStockPrice(client, companies, dbName = "niubi") {
  // if the update failed, the data will be saved as 'N/A'
  // this is to ensure we don't display any stale data
  const utcNow = moment.utc().format('YYYY-MM-DD hh:mm:00')
  await db.index(client, dbName, "stock_prices", { SECURITY_CODE: 1, DATETIME: -1 }, true)
  for (const [_, company] of Object.entries(companies)) {
    const securityCode = company.code.toString().padStart(6, "0")
    const stockPrice = await tickers.getDailyStock(securityCode.toString())
    const entry = {
      "SECURITY_NAME_ABBR": company.name,
      "SECURITY_CODE": securityCode,
      "STOCK_PRICE": stockPrice.price,
      "PERCENT_CHANGED": stockPrice.percentChanged,
      "DATETIME": utcNow,
    }
    await db.insert(client, dbName, "stock_prices", entry)
    console.log(`Updated stock price for ${company.name}`)
  }
}


async function main() {
  const helpMsg = `
  Make sure you've added the company details to the config/companies.yaml file first

  Options:
  company name(s)   - Add a new company to the db
                    - For multiple companies, separate companies by comma (,)

  all               - To refresh earning report for all existing companies

  stock_price       - Update today's stock proce for all companies
  `

  if (argv.slice(2).length != 1) {
    console.log("Error paring args\n")
    console.log(helpMsg)
    process.exit(1)
  }
  const arg = argv[2]
  let companies = yaml.load(fs.readFileSync(configPath, "utf8"))  

  function lookUpCompany(names) {
    let newEntries = new Array()
    for (const [_, v] of Object.entries(companies)) {
      if (names.indexOf(v["name"]) > -1) {
        newEntries.push(v)
      }
    }
    return newEntries
  }

  let fn = updateCompanies
  if (arg == "-h" || arg == "help") {
    console.log(helpMsg)
    process.exit(0)
  } else if (arg == "all") {
    console.log("Refreshing data for all companies")
  } else if (arg == "stock_price") {
    console.log("Updating stock price for all companies")
    fn = updateStockPrice
  }
  else if (arg.split(",").length > 1 || arg.split("，").length > 1) {
    let names = arg.split(",")
    if (names.length == 1) {
      names = arg.split("，")
    }
    companies = lookUpCompany(names)
    console.log("Updating data for companies", arg)
  } else {
    companies = lookUpCompany(arg)
    console.log("Updating data for company", arg)
  }
  const client = db.getClient()
  try {
    await client.connect()
    await run(fn, [client, companies])
  } finally {
    await client.close()
  }
}


main().catch(console.error)

