const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('players loading...');

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const playerID = 169532;
    await page.goto(`http://www.espnfc.com/player/${playerID}?xhr=1`);
    await page.content(); 
    const json = await page.evaluate(() => JSON.parse(document.querySelector("body").innerText));

    console.log(json)
    
    await browser.close();

    console.log('players loaded success');
  } catch(e) {
    console.log(e);
  }
})();