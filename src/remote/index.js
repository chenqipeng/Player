import Vue from 'vue'
import VueResource from 'vue-resource'

export {
  getPlayList,
  getMusicUrl,
  getMusicDetail,
  getLyrics
}

Vue.use(VueResource)

function getPlayList(id) {
  return Vue.http.get('/api/playlist/detail?id='+id)
}

function getMusicUrl(id) {
  return Vue.http.get('/api/music/url?id='+id)
}

function getMusicDetail(id) {
  return Vue.http.get('/api/song/detail?ids='+id)
}

function getLyrics(id) {
  return Vue.http.get('/api/lyric?id='+id)
}
