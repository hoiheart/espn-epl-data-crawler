const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('statistics loading...');

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/statistics');
    await page.content(); 
    const json = await page.evaluate(() => JSON.parse(document.querySelector("body").innerText));

    await fs.mkdirSync('./data/statistics/', { recursive: true });
    await fs.writeFileSync('./data/statistics/statistics.json', JSON.stringify(json));

    await browser.close();

    console.log('statistics loaded success');
  } catch(e) {
    console.log(e);
  }
})();