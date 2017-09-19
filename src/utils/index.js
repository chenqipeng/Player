export {
  listRandom,
  getPrevious,
  getNext
}

function listRandom(len, index) {
  let result = Math.floor(Math.random()*len)
  if(result == index) {
    return listRandom(len, index)
  } else {
    return result
  }
}

function getPrevious(len, index, mode) {
  let randomIndex = listRandom(len, index)
  switch (mode) {
    case 2:
      return randomIndex
    default:
      if(index == 0) {
        return len-1
      } else {
        return --index
      }
  }
}

function getNext(len, index, mode) {
  let randomIndex = listRandom(len, index)
  switch (mode) {
    case 2:
      return randomIndex
    default:
      if(index == len-1) {
        return 0
      } else {
        return ++index
      }
  }
}
