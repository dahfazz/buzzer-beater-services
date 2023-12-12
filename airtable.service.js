const Airtable = require('airtable');
const CONSTANTS = require('./CONSTANTS.json');

let base;

const init = () => {
  Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: CONSTANTS.AIR_API_KEY,
  });
  base = Airtable.base(CONSTANTS.BASEKEY);
}

const getAirtabletData = async () => {
  if (!base) init();

  return await base(CONSTANTS.TABLE).select({
    view: 'picks'
  }).all()
}

module.exports = { getAirtabletData };