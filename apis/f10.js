const http = require("http")
const db = require("./database")

const dbName = "f10"
const reportNames = {
  "balance": "zcfzb",
  "income": "lrb",
  "cashflow": "xjllb",
}


async function getDates(client, code, collection, rtype, ctype) {
  async function parse(data) {
    const cursor = await db.query(client, "f10", collection, [
      {$match: { SECUCODE: code }},
      {
        $group: {
          _id: "$SECURITY_CODE",
          "REPORT_DATES": {
            $push: {$substr: ["$REPORT_DATE", 0, 10]}
          }
        }
      }
    ])
    const dbDates = await cursor.next()

    try {
      const dates = JSON.parse(data)["data"]
      const newDates = new Array()
      for (const date of dates) {
        const dateStr = date["REPORT_DATE"].substr(0, 10)
        if (dbDates["REPORT_DATES"].indexOf(dateStr) == -1) {
          newDates.push(dateStr)
        }
      }
      return newDates
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
        console.debug(req)
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
              console.debug(req)
            }
          }
        })
      })
    })
  }
  while (dates.length > 0) {
    // f10 api has a page size limit, limit to 5 reports per request
    await run(dates.slice(0, 5))
    dates = dates.slice(5)
  }
  return allData
}


module.exports = {
  reportNames: reportNames,
  getData: getData,
  getDates: getDates,
}