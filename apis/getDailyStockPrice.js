const http = require("http")
const re = /jQuery[0-9]+_[0-9]+\((.*)\)\;/

async function getDailyStock(secid) {
  let prefixNum = 0
  let tmp = []
  let req = "http://push2.eastmoney.com/api/qt/stock/get?"
  async function run(req) {
    return new Promise((resolve) => {
      console.log("GET: ", req)
      http.get(req, {
        headers: {
          "sec-ch-ua": '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
          "DNT": "1",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
        },
        timeout: 2000,
      }, (resp) => {
        let data = ""
        resp.on("data", (chunk) => {
          data += chunk
        })
        resp.on("end", () => {
          try {
            const stockMove = JSON.parse(data.replace(re, "$1"))["data"]
            resolve(tmp.push({
              "price": stockMove["f43"] / 100,
              "percentChanged": stockMove["f170"] / 100,
            }))
          } catch(e) {
            console.log("No data returned for", prefixNum, secid)
            resolve(tmp.push(null))
          }
        })
      })
    })
  }
  while (prefixNum <= 4) {
    let prefix = prefixNum.toString()
    // very sad and ugly code
    // JavaScript Jesus should come and rescue this
    tmp = []
    await run(req + `secid=${prefix}.${secid}&fields=f43,f170`)
    if (tmp[0] != null) {
      return tmp[0]
    }
    await new Promise(resolve => setTimeout(resolve, 3000)) // try to avoid connection error
    prefixNum ++
  }
  return {"price": "N/A", "percentChanged": "N/A"}
}


module.exports = {
  getDailyStock: getDailyStock,
}
