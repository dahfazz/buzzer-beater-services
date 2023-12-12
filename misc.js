const cleanChars = (str) => {
  if (!str) return;

  return str.replace('č', 'c').replace('ć', 'c').toLowerCase()
}

module.exports = { cleanChars };
