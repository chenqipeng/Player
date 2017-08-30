import Vue from 'vue'

Vue.filter('sToms', s => {
  let min = Math.trunc(s/60)
  let second = Math.trunc(s%60)
  let format = (b) => (b>=10) ? b : ('0'+b)
  return format(min) + ':' + format(second)
})
