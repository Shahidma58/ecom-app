export function get_str_date() {
  const today = new Date();
  return String(today.getDate()).padStart(2, '0') + '-' + 
    today.toLocaleString('en-US', { month: 'short' }) + '-' + today.getFullYear();
//console.log(strDate)
}