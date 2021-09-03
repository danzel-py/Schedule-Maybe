export function getFirstDayMonth(){
  var date = new Date()
  var firstDay = new Date()
  firstDay.setFullYear(date.getFullYear(),date.getMonth(),1)
  return firstDay

}

export function getDaysLater(x:number){
  var date = new Date()
  var future = new Date()
  future.setDate(date.getDate() + x);
  return future
}