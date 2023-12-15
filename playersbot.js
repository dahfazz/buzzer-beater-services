const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const getLetterPlayers = async (letter) => {
  const result = await axios.get(`https://www.basketball-reference.com/players/${letter}/`);
  const $ = cheerio.load(result.data);

  const PLAYERS = JSON.parse(fs.readFileSync('PLAYERS.json', 'utf8'))

  $('#div_players tbody tr:not(.thead)').each(async (_, line) => {
    const p = {};
    p.name = $(line).find('th a').eq(0).text();
    p.ref = $(line).find('th a').eq(0).attr('href');

    $(line).find('td').each((_, cell) => {
      const key = $(cell).attr('data-stat');

      switch (key) {
        case 'year_min':
          p.from = parseInt($(cell).text(), 10);
          break;
        case 'year_max':
          p.to = parseInt($(cell).text(), 10);
          break;
        case 'birth_date':
          p.birth = $(cell).find('a').eq(0).text();
          break;
      }
    })
    PLAYERS.push(p)
  });

  fs.writeFileSync('PLAYERS.json', JSON.stringify(PLAYERS, null, 2))
  console.log(`letter ${letter}: ${PLAYERS.length} players`)
  return PLAYERS;
}

['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].forEach(letter => getLetterPlayers(letter))