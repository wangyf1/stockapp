const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const yaml = require("js-yaml")
const pinyin = require("pinyin")
const db = require("./apis/database")

const client = db.getClient()
const collections = [
  ["f10", "balance"],
  ["f10", "cashflow"],
  ["f10", "income"],
]
const companies = yaml.load(fs.readFileSync(`${__dirname}/config/companies.yaml`, "utf8"))
const schema = JSON.parse(fs.readFileSync('./config/schema.json'))["f10"]


function ejs2html({ path, outPath, data, options }) {
  fs.readFile(path, "utf8", function (err, _) {
    if (err) {
      console.log(err);
      return false;
    }
    ejs.renderFile(path, data, options, (err, html) => {
      if (err) {
        console.log(err);
        return false;
      }
      fs.writeFile(outPath, html, function (err) {
        if (err) {
          console.log(err);
          return false;
        }
        return true;
      });
    });
  });
}


function getIndex() {
  async function run() {
    try {
      const cursor = db.query(client, "niubi", "companies", [{
        $group: {
          _id: "$SECURITY_CODE",
          REPORT_DATE: { $max: { $substr: ["$REPORT_DATE", 0, 10] } },
          SECURITY_NAME_ABBR: { $first: "$SECURITY_NAME_ABBR" },
          SECURITY_CODE: { $max: "$SECURITY_CODE" },
        }
      }])
      const companies = new Array()
      while (await cursor.hasNext()) {
        const nxt = await cursor.next()
        nxt["PINYIN"] = pinyin(
          nxt["SECURITY_NAME_ABBR"],
          { style: pinyin.STYLE_NORMAL, heteronym: false }
        ).flat().join("") + nxt["SECURITY_CODE"].replace(".", "") + ".html"
        const ccursor = db.query(client, "f10", "cashflow", [
          { $match: { SECURITY_CODE: nxt["SECURITY_CODE"] } },
          { $sort: { REPORT_DATE: -1 } },
          { $limit: 1 },
        ])
        const ccres = await ccursor.next()
        nxt["REPORT_DATE_NAME"] = ccres["REPORT_DATE_NAME"]
        companies.push(nxt)
      }
      return { "data": companies }
    } catch (e) {
      console.error(e)
    }
  }
  return new Promise((resolve) => (resolve(run())))
}


function getData(code) {
  code = String(code).padStart(6, "0")
  async function run() {
    let data = {}
    let parsedData = new Map()
    let dates = new Set()
    let companyName = ""
    try {
      for (const [_, e] of collections.entries()) {
        const dbname = e[0]
        const cname = e[1]
        const cursor = db.query(client, dbname, cname, [
          { $match: { SECURITY_CODE: code } },
          { $sort: { REPORT_DATE: 1 } },
        ])
        while (await cursor.hasNext()) {
          const nxt = await cursor.next()
          companyName = nxt["SECURITY_NAME_ABBR"]
          const reportDate = nxt["REPORT_DATE"].substr(0, 10)
          dates.add(reportDate)
          for (const k in schema) {
            if (!(k in nxt)) {
              continue
            }
            if (!(schema[k] in data)) {
              data[schema[k]] = new Map()
            }
            data[schema[k]][reportDate] = nxt[k]
          }
        }
      }

      dates = Array.from(dates).sort().slice(-20)  // 5 most recent quarters
      for (const k in data) {
        for (const d of dates) {
          if (!(k in parsedData)) {
            parsedData[k] = new Array()
          }
          val = data[k][d] || 0
          parsedData[k].push((val / 100000000).toFixed(2))
        }
      }

      try {
        let totalIncome = parsedData["营业总收入"] || parsedData["营业收入"]
        let totalCost = parsedData["营业成本"] || parsedData["营业支出"]
        parsedData["毛利"] = totalIncome.map((e, i) => ((e - totalCost[i]).toFixed(2)))
        parsedData["自由现金流"] = parsedData["经营活动产生的现金流量净额"].map((e, i) => ((e - parsedData["资本性支出"][i]).toFixed(2)))
      } catch (e) {
        console.log(`Incomplete data for ${companyName} (${code})`)
      }
    } catch (e) {
      console.error(e)
    }

    if (Object.getOwnPropertyNames(data).length === 0) {  // stupid ass js bullshit ¯\_(ツ)_/¯
      console.log(`No data available for ${code}`)
    } else {
      return {
        "data": parsedData,
        "cname": companyName,
        "dates": JSON.stringify(dates),
      }
    }
  }
  return new Promise((resolve) => (resolve(run())))
}

(async () => {
  try {
    await client.connect()
    const indexData = await getIndex()
    console.log("Rendering index file")
    ejs2html({
      path: `${__dirname}/views/index.ejs`,
      outPath: `${__dirname}/public/index.html`,
      data: indexData,
    })

    for (const [_, c] of Object.entries(companies)) {
      const py = pinyin(c["name"], {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
      }).flat().join("") + String(c["code"].replace(".", "")).padStart(6, "0")
      const graphData = await getData(c["code"])
      graphData["cinfo"] = c["info"]
      let customJS
      try {
        customJS = fs.readFileSync(`${__dirname}/js/${py}.js`, "utf8")
      } catch (error) {
        console.log("No custom JS code found for", c["name"])
      }
      graphData["customJS"] = customJS
      console.log("Rendering for", c["name"], Object.keys(graphData))
      ejs2html({
        path: `${__dirname}/views/graph.ejs`,
        outPath: `${__dirname}/public/${py}.html`,
        data: graphData,
      })
    }
  } catch (e) {
    console.log(e)
  } finally {
    await client.close()
  }
})()

ejs2html({
  path: `${__dirname}/views/about.ejs`,
  outPath: `${__dirname}/public/about.html`
});

ejs2html({
  path: `${__dirname}/views/knowledge.ejs`,
  outPath: `${__dirname}/public/knowledge.html`
});

ejs2html({
  path: `${__dirname}/views/terms.ejs`,
  outPath: `${__dirname}/public/terms.html`
});

ejs2html({
  path: `${__dirname}/views/video.ejs`,
  outPath: `${__dirname}/public/video.html`
});

ejs2html({
  path: `${__dirname}/views/sidebar.ejs`,
  outPath: `${__dirname}/public/sidebar.html`
});

ejs2html({
  path: `${__dirname}/views/contact.ejs`,
  outPath: `${__dirname}/public/contact.html`
});