/**
 * Descending sort, mutates array
 * @param arr {object[]}- Array of objects
 * @param key {string} - 'updatedAt'
 * @returns {object[]} Updated array
 */
export function sortDescending(arr:object[],key:string){
  arr.sort((a,b)=>{
    if(a[key] < b[key]){
      return 1
    }else if(a[key] > b[key]){
      return -1
    }
    return 0
  })
  return arr
}

/**
 * Ascending sort, mutates array
 * @param arr {object[]}- Array of objects
 * @param key {string} - 'updatedAt'
 * @returns {object[]} Updated array
 */
export function sortAscending(arr:object[],key:string){
  arr.sort((a,b)=>{
    if(a[key] > b[key]){
      return 1
    }else if(a[key] < b[key]){
      return -1
    }
    return 0
  })
  return arr
}