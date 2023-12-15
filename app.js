const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const { getUserPicks } = require('./user.service');
const { getBestAvailablePlayers } = require('./ttfl.service');
const { getPlayerDetails } = require('./player.service');
const { getCross } = require('./cross.service');

const CONSTANTS = require('./CONSTANTS.json');
const SCHEDULE = require('./files/SCHEDULE.json');
const { cleanChars } = require('./misc')

const PORT = process.env.PORT || CONSTANTS.PORT;

const PLAYERS = require('./PLAYERS.json')
const TEAMS = require('./TEAMS.json')


// ROUTES
const app = express();
app.use(cors())
app.use(bodyParser.json())

// ROUTER
app.get('/users/:user/picks', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  res.send(await getUserPicks(req));
});

app.get('/users/:user/availabilities', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  res.send(await getUserAvailabilities(req));
});

app.get('/players', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const search = cleanChars(req.query.search);

  const results = PLAYERS.filter(player => cleanChars(player.name).indexOf(search) > -1)

  res.send(results);
});

app.get('/teams', async (_, res) => {
  res.setHeader('Content-Type', 'application/json');


  res.send(TEAMS);
});

app.get('/cross', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const team1 = cleanChars(req.query.t1);
  const team2 = cleanChars(req.query.t2);


  res.send(await getCross(team1, team2));
});

app.get('/players/:ref', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');


  res.send(await getPlayerDetails(req));
});

app.get('/users/:user/players/:date', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  res.send(await getBestAvailablePlayers(req));
});

app.get('/schedule', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  let json = SCHEDULE.reduce((accumulator, current) => {
    if (!accumulator.find((item) => item.date === current.date)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);

  json = json.map(item => {
    const nb = SCHEDULE.filter(sch => sch.date === item.date);

    return { ...item, gameNB: nb.length }
  })
  res.send(json)
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
