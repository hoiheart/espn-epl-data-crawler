const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('fixtures loading...');

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?calendar=blacklist');

    const bodyHandle = await page.$('body pre');
    const data = await page.evaluate(body => body.innerHTML, bodyHandle);
    await bodyHandle.dispose();

    const json = JSON.parse(data);
    const calendar = Object.assign({}, json.leagues[0].calendar);

    for (let key in calendar) {
      const date = calendar[key].substring(0, 10).replace(/-/gi, '');

      await page.goto('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?calendar=blacklist&dates=' + date);

      const subBodyHandle = await page.$('body pre');
      const subData = await page.evaluate(body => body.innerHTML, subBodyHandle);
      await subBodyHandle.dispose();
      
      await fs.mkdirSync('../data/fixtures/', { recursive: true });
      await fs.writeFileSync(`../data/fixtures/${date}.json`, subData);
    }

    await browser.close();

    console.log('fixtures loaded success');
  } catch(e) {
    console.log(e);
  }
})();