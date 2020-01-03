const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('teams loading...');

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams');
    await page.content(); 
    const teamsJson = await page.evaluate(() => JSON.parse(document.querySelector("body").innerText));
    
    await fs.mkdirSync('./data/teams/', { recursive: true });
    await fs.writeFileSync(`./data/teams/teams.json`, JSON.stringify(teamsJson));

    const teams = teamsJson.sports[0].leagues[0].teams.map(data => data.team.id);

    for (let teamID of teams) {
      await page.goto('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/' + teamID);
      await page.content(); 
      const teamJson = await page.evaluate(() => JSON.parse(document.querySelector("body").innerText));

      await fs.mkdirSync('./data/teams/', { recursive: true });
      await fs.writeFileSync(`./data/teams/${teamID}.json`, JSON.stringify(teamJson));
    }

    for (let teamID of teams) {
      await page.goto(`http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/${teamID}/roster`);
      await page.content(); 
      const rostersJson = await page.evaluate(() => JSON.parse(document.querySelector("body").innerText));

      await fs.mkdirSync('./data/rosters/', { recursive: true });
      await fs.writeFileSync(`./data/rosters/${teamID}.json`, JSON.stringify(rostersJson));
    }
    
    await browser.close();

    console.log('teams loaded success');
  } catch(e) {
    console.log(e);
  }
})();
