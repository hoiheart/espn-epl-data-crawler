const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('standings loading...');

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings');

    const bodyHandle = await page.$('body pre');
    const data = await page.evaluate(body => body.innerHTML, bodyHandle);
    await bodyHandle.dispose();

    await fs.mkdirSync('../data/standings/', { recursive: true });
    await fs.writeFileSync('../data/standings/standings.json', data);

    await browser.close();
    
    console.log('standings loaded success');
  } catch(e) {
    console.log(e);
  }  
})();