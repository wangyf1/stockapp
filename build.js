const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

function ejs2html({ path, outPath, data, options }) {
  fs.readFile(path, "utf8", function(err, data) {
    if (err) {
      console.log(err);
      return false;
    }
    ejs.renderFile(path, data, options, (err, html) => {
      if (err) {
        console.log(err);
        return false;
      }
      fs.writeFile(outPath, html, function(err) {
        if (err) {
          console.log(err);
          return false;
        }
        return true;
      });
    });
  });
}

ejs2html({
  path: `${__dirname}/views/index.ejs`,
  outPath: `${__dirname}/public/index.html`
});

ejs2html({
  path: `${__dirname}/views/about.ejs`,
  outPath: `${__dirname}/public/about.html`
});

ejs2html({
  path: `${__dirname}/views/byd.ejs`,
  outPath: `${__dirname}/public/byd.html`
});

ejs2html({
  path: `${__dirname}/views/jdf.ejs`,
  outPath: `${__dirname}/public/jdf.html`
});

ejs2html({
  path: `${__dirname}/views/knowledge.ejs`,
  outPath: `${__dirname}/public/knowledge.html`
});

ejs2html({
  path: `${__dirname}/views/longi.ejs`,
  outPath: `${__dirname}/public/longi.html`
});

ejs2html({
  path: `${__dirname}/views/maotai.ejs`,
  outPath: `${__dirname}/public/maotai.html`
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
  path: `${__dirname}/views/yonghui.ejs`,
  outPath: `${__dirname}/public/yonghui.html`
});

ejs2html({
  path: `${__dirname}/views/sidebar.ejs`,
  outPath: `${__dirname}/public/sidebar.html`
});