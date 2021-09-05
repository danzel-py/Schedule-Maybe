export function getFirstDayMonth() {
  var date = new Date()
  var firstDay = new Date()
  firstDay.setFullYear(date.getFullYear(), date.getMonth(), 1)
  return firstDay

}

export function getDaysLater(x: number) {
  var date = new Date()
  var future = new Date()
  future.setDate(date.getDate() + x);
  return future
}

/**
 * @param {string}  date - yyyy-mm-dd
 * @param {string}  time - HH:MM
 * @return {Date} date Object
 */
export function getDateFromString(date: string, time: string) {
  const dateArr = date.split("-")
  const timeArr = time.split(":")
  var dateObj = new Date()
  dateObj.setFullYear(parseInt(dateArr[0]))
  dateObj.setMonth(parseInt(dateArr[1]) - 1)
  dateObj.setDate(parseInt(dateArr[2]))
  dateObj.setHours(parseInt(timeArr[0]), parseInt(timeArr[1]), 0)
  return dateObj
}
/**
 * @param {Date}  date - Object
 * @return {String} yyyy-mm-dd
 */
export function getDateFromObject(date: Date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

/**
 * @param {Date}  date - Object
 * @return {String} HH:MM
 */
export function getTimeFromObject(date: Date) {
  var d = new Date(date)
  return ("0" + d.getHours()).slice(-2)   + ":" + ("0" + d.getMinutes()).slice(-2)
}