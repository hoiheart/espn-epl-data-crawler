const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('fixtures loading...');

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?calendar=blacklist');
    await page.content(); 
    const json = await page.evaluate(() => JSON.parse(document.querySelector("body").innerText));
    const calendar = Object.assign({}, json.leagues[0].calendar);

    for (let key in calendar) {
      const date = calendar[key].substring(0, 10).replace(/-/gi, '');

      await page.goto('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?calendar=blacklist&dates=' + date);
      await page.content(); 
      const subJson = await page.evaluate(() => JSON.parse(document.querySelector("body").innerText));
      
      await fs.mkdirSync('./data/fixtures/', { recursive: true });
      await fs.writeFileSync(`./data/fixtures/${date}.json`, JSON.stringify(subJson));
    }

    await browser.close();

    console.log('fixtures loaded success');
  } catch(e) {
    console.log(e);
  }
})();