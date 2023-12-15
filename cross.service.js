const axios = require('axios');
const cheerio = require('cheerio');

const getCross = async (key1, key2) => {
  const PLAYERS1 = []
  const PLAYERS2 = []

  const result1 = await axios.get(`https://www.basketball-reference.com/teams/${key1.toUpperCase()}/players.html`);
  const result2 = await axios.get(`https://www.basketball-reference.com/teams/${key2.toUpperCase()}/players.html`);

  let $ = cheerio.load(result1.data);
  $('#div_franchise_register tr').each((_, line) => {
    PLAYERS1.push({
      name: $(line).find('a').eq(0).text(),
      ppg: parseInt($(line).find('td[data-stat="pts_per_g"]').eq(0).text(), 10),
    })
  });

  $ = cheerio.load(result2.data);
  $('#div_franchise_register tr').each((_, line) => {
    PLAYERS2.push({
      name: $(line).find('a').eq(0).text(),
      ppg: parseInt($(line).find('td[data-stat="pts_per_g"]').eq(0).text(), 10),
    })
  });

  return PLAYERS1.filter(player => {
    const find = PLAYERS2.find(_p => _p.name === player.name);

    return player.name && !!find;
  }).sort((a, b) => a.ppg > b.ppg ? 1 : -1)
}

module.exports = { getCross };