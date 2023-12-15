const axios = require('axios');
const cheerio = require('cheerio');

const getCross = async (key1, key2) => {
  const PLAYERS1 = []
  const PLAYERS2 = []

  const result1 = await axios.get(`https://www.basketball-reference.com/teams/${key1.toUpperCase()}/players.html`);
  const result2 = await axios.get(`https://www.basketball-reference.com/teams/${key2.toUpperCase()}/players.html`);

  let $ = cheerio.load(result1.data);
  $('#div_franchise_register a').each((_, tag) => {
    PLAYERS1.push($(tag).text())
  });

  $ = cheerio.load(result2.data);
  $('#div_franchise_register a').each((_, tag) => {
    PLAYERS2.push($(tag).text())
  });

  return PLAYERS1.filter(player => PLAYERS2.includes(player))
}

module.exports = { getCross };