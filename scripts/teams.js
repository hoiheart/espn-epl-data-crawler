const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('teams & players loading...');

  try {
    const standings = fs.readFileSync('../data/standings/standings.json');
    const teams = JSON.parse(standings).children[0].standings.entries.map(entry => entry.team.id);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (let teamID of teams) {
      await page.goto('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/' + teamID);

      const bodyHandle = await page.$('body pre');
      const data = await page.evaluate(body => body.innerHTML, bodyHandle);
      await bodyHandle.dispose();

      await fs.mkdirSync('../data/teams/', { recursive: true });
      await fs.writeFileSync(`../data/teams/${teamID}.json`, data);
    }

    for (let teamID of teams) {
      await page.goto(`http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/${teamID}/roster`);

      const bodyHandle = await page.$('body pre');
      const data = await page.evaluate(body => body.innerHTML, bodyHandle);
      await bodyHandle.dispose();

      await fs.mkdirSync('../data/rosters/', { recursive: true });
      await fs.writeFileSync(`../data/rosters/${teamID}.json`, data);

      const json = JSON.parse(data);
      const players = [...json.athletes];

      for (let player of players) {
        const playerID = player.id;
        await page.goto(`http://www.espnfc.com/player/${playerID}?xhr=1`);

        const subBodyHandle = await page.$('body pre');
        const subData = await page.evaluate(body => body.innerHTML, subBodyHandle);
        await subBodyHandle.dispose();
        
        await fs.mkdirSync('../data/players/', { recursive: true });
        await fs.writeFileSync(`../data/players/${playerID}.json`, subData);
      }
    }
    
    await browser.close();

    console.log('teams & players loaded success');
  } catch(e) {
    console.log(e);
  }
})();