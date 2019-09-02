const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('statistics loading...');

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/statistics');

    const bodyHandle = await page.$('body pre');
    const data = await page.evaluate(body => body.innerHTML, bodyHandle);
    await bodyHandle.dispose();

    await fs.mkdirSync('../data/statistics/', { recursive: true });
    await fs.writeFileSync('../data/statistics/statistics.json', data);

    await browser.close();

    console.log('statistics loaded success');
  } catch(e) {
    console.log(e);
  }
})();