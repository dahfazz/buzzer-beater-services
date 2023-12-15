const { cleanChars } = require('./misc');
const axios = require('axios');
const cheerio = require('cheerio');

const getPlayerDetails = async (req) => {
  const ref = req.params.ref

  const result = await axios.get(`https://www.basketball-reference.com/players/${ref}.html`);
  const $ = cheerio.load(result.data);

  const DETAILS = {
    careerPath: [],
    allstar: [],
    draft: {}
  };

  $('.uni_holder a').each((_, uni) => {
    const str = $(uni).attr('data-tip')
    const team = str.split(', ')[0].trim();
    const years = str.split(', ')[1].trim();
    const from = parseInt(years.split('-')[0], 10)
    const to = parseInt(years.split('-')[1], 10)
    const number = parseInt($(uni).attr('href').split('?number=')[1], 10)
    DETAILS.careerPath.push({ team, from, to, number })
  });

  $('#div_per_game tbody tr').each((_, line) => {
    const year = $(line).find('th').eq(0).text()
    const star = $(line).find('th .sr_star')

    if (star.length) {
      DETAILS.allstar.push(year)
    }

    DETAILS.name = $('h1 span').eq(0).text()
    DETAILS.birthdate = $('#necro-birth').eq(0).attr('data-birth')

    // DRAFT
    $('#info p').each((_, item) => {
      const str = $(item).find('strong').eq(0).text()
      if (str && str.trim().toLowerCase() === 'draft:') {
        DETAILS.draft.team = $(item).find('a').eq(0).text()
        DETAILS.draft.year = $(item).find('a').eq(1).text()
        DETAILS.draft.pick = $(item).first().contents().filter(function () {
          return this.type === 'text';
        }).text().split('round')[1]
          .replaceAll('\n', '')
          .replaceAll(',', '')
          .replaceAll('(', '')
          .replaceAll(')', '')
          .trim();
      }
    })
  })

  return DETAILS;
}

module.exports = { getPlayerDetails }
