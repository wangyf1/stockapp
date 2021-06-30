const https = require("https")

const re = /jQuery[0-9]+_[0-9]+\((.*)\)\;/
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


function buildReq (params) {
  const queries = new Array()
  for (const [k, v] of Object.entries({...defaultParams, ...params})) {
    queries.push(k + "=" + v)
  }
  return baseUrl + "?" + queries.join("&")
}


async function getSECU(name) {
  // f10 API only understand the specific secucode (with sz, sh, ...)
  const req = buildReq({
    "filter": `(SECURITY_NAME_ABBR="${name}")`,
    "reportName": "RPT_LICO_FN_CPD",
  })
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
          console.error({
            "Error getting SECU code": e,
            "Bad Request": req
          })
        }
      })
    })
  })
}


module.exports = {
  getSECU: getSECU,
}