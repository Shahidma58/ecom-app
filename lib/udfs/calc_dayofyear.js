export function calc_dayofyear() {
  const today = new Date();
  const wTrn_date = today;
  const year = today.getFullYear() % 100;
  const doy = Math.floor(Math.floor(today - new Date(
    today.getFullYear(), 0, 0))/ 1000 / 60 / 60 / 24);
  const trn_id = year * 1000 + doy;
  return trn_id;
}
