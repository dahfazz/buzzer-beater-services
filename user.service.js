const { getAirtabletData } = require('./airtable.service');
const { addDays } = require('./date.utils');
const { cleanChars } = require('./misc');
const STATS = require('./files/STATS.json');

getUserPicks = async (req) => {
  const user = req.params.user;
  const lookupKey = `Name (from ${user})`;

  const records = await getAirtabletData();
  return records
    .filter(record => record.get(lookupKey))
    .reduce((picks, record) => {
      const date = record.get('date')
      const pick = record.get(lookupKey)[0]
      const temp = pick ? STATS.find(stat => cleanChars(stat.player) === cleanChars(pick)) : ''
      const team = temp ? temp.team_id : ''
      if (pick) {
        picks.push({
          date: new Date(date), pick, team
        })
      }

      return picks;
    }, []);
}

getUserAvailabilities = async (req) => {
  const user = req.params.user;
  const lookupKey = `Name (from ${user})`;

  const records = await getAirtabletData()
  return records
    .filter(record => record.get(lookupKey))
    .reduce((picks, record) => {
      const date = record.get('date')
      const player = record.get(lookupKey)[0]
      if (player) {
        picks.push({
          availabilityDate: addDays(date), player
        })
      }

      return picks;
    }, [])
}

module.exports = { getUserPicks };
