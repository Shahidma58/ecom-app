export function calc_dayofyear() {
  const trn_id = new Intl.DateTimeFormat('en-GB')
    .format(new Date())
    .split('/')
    .reverse()
    .join('')
    .slice(2);
  return trn_id;
}
/*
export function calc_dayofyear() {
  const today = new Date();
  const wTrn_date = today;
  const wyy = today.getFullYear().toString().slice(-2);
  const doy = Math.floor(Math.floor(today - new Date(
    today.getFullYear(), 0, 0))/ 1000 / 60 / 60 / 24);
  const trn_id = year * 1000 + doy;
  return trn_id;
}
*/