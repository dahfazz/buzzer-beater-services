const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const { getUserPicks } = require('./user.service');
const { getBestAvailablePlayers } = require('./ttfl.service');
const CONSTANTS = require('./CONSTANTS.json');
const SCHEDULE = require('./files/SCHEDULE.json');

const PORT = process.env.PORT || CONSTANTS.PORT;
const jsonParser = bodyParser.json()


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

app.post('/users/:user/picks', jsonParser, (req, res) => {
  console.log(req, res)
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
