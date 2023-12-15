const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const writeTeams = async () => {
  const result = await axios.get(`https://www.basketball-reference.com/teams/`);
  const $ = cheerio.load(result.data);

  const TEAMS = []

  $('#div_teams_active a').each(async (_, tag) => {
    const name = $(tag).text();
    const key = $(tag).attr('href').replace('/teams/', '').replace('/', '');

    TEAMS.push({ name, key })
    fs.writeFileSync('TEAMS.json', JSON.stringify(TEAMS, null, 2))
  });

  console.log(`${TEAMS.length}teams`)
  return TEAMS;
}

writeTeams()

module.exports = { writeTeams }
