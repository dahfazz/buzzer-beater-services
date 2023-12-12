const addDays = (date, nb = 31) => {
  return new Date(new Date(date).setDate(new Date(date).getDate() + nb));
}

const getUTCDate = (date) => {
  const gd = new Date(date);
  return new Date(Date.UTC(gd.getFullYear(), gd.getMonth(), gd.getDate(), 0, 0, 0, 0))
}

const parseStringDate = (str) => {
  const d = new Date(str);
  const sd = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
  return new Date(new Date(sd).setHours(0, 0, 0, 0))
}

module.exports = { addDays, getUTCDate, parseStringDate };
