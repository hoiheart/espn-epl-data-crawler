const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('standings loading...');

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings');
    await page.content(); 
    const json = await page.evaluate(() => JSON.parse(document.querySelector("body").innerText));

    await fs.mkdirSync('./data/standings/', { recursive: true });
    await fs.writeFileSync('./data/standings/standings.json', JSON.stringify(json));

    await browser.close();
    
    console.log('standings loaded success');
  } catch(e) {
    console.log(e);
  }  
})();