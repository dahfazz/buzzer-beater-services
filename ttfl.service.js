const { getUserPicks } = require('./user.service');
const { cleanChars } = require('./misc');
const { addDays, getUTCDate, parseStringDate } = require('./date.utils')
const SCHEDULE = require('./files/SCHEDULE.json');
const STATS = require('./files/STATS.json');
const TEAMS = require('./files/TEAMS.json');


const getBestAvailablePlayers = async (req) => {
  const date = parseStringDate(req.params.date)

  const games = []

  SCHEDULE
    .filter(game => {
      return getUTCDate(game.date).getDate() === date.getDate() && getUTCDate(game.date).getMonth() === date.getMonth() && getUTCDate(game.date).getFullYear() === date.getFullYear()
    }).map(game => {
      games.push({ home: game.home, away: game.away })
    })

  const scheduleTeams = SCHEDULE
    .filter(game => {
      return getUTCDate(game.date).getDate() === date.getDate() && getUTCDate(game.date).getMonth() === date.getMonth() && getUTCDate(game.date).getFullYear() === date.getFullYear()
    })
    .reduce((games, game) => {
      games.push(game.away)
      games.push(game.home)
      return games;
    }, []);

  const oppo = SCHEDULE.filter(game => getUTCDate(game.date).getDate() === date.getDate() && getUTCDate(game.date).getMonth() === date.getMonth() && getUTCDate(game.date).getFullYear() === date.getFullYear())
    .reduce((oppo, game) => {
      oppo[game.away] = game.home;
      oppo[game.home] = game.away;
      return oppo;
    }, {});


  const schedulePlayers = STATS
    .filter(player => scheduleTeams.indexOf(player.team_id) > -1)

  const sortedSchedulePlayers = schedulePlayers.sort((b, a) => a.TTFL > b.TTFL ? 1 : -1)

  const userBlockedPlayers = await getUserBlockedPlayers(req, date);

  const availabledSchedulePlayers = sortedSchedulePlayers.filter(item => userBlockedPlayers.indexOf(cleanChars(item.player)) < 0);

  return {
    suggests: availabledSchedulePlayers.map(item => ({
      player: item.player,
      team: item.team_id,
      average: parseInt(item.TTFL, 10),
      oppo: TEAMS[oppo[item.team_id]].key,
    })).slice(0, 40),
    games,
  }
}

const getUserBlockedPlayers = async (req, date) => {
  const userPicks = await getUserPicks(req);

  return userPicks.map(item => ({ ...item, pick: cleanChars(item.pick) })).filter(item => {
    return addDays(item.date, 31) > new Date(date)
  }).map(item => item.pick)

}

module.exports = { getBestAvailablePlayers }
