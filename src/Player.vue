<template>
  <div id="player">
    <headbar></headbar>
    <lyrics></lyrics>

    <controller
      v-bind:current-time="currentTime"
      v-bind:total-time="totalTime"
      v-bind:is-playing="isPlaying"
      v-bind:loop-mode="loopMode"
      v-on:toggle-loop="toggleLoop"
      v-on:toggle-pop="togglePop"
      v-on:previous="previous"
      v-on:next="next"
      v-on:update-time="updateTime"
      v-on:show-list="showList"></controller>

    <music-list
      v-bind:list="list"
      v-bind:list-show="listShow"
      v-bind:loop-mode="loopMode"
      v-bind:current-index="currentIndex"
      v-on:play="play"
      v-on:remove="remove"
      v-on:toggle-loop="toggleLoop"
      v-on:close-list="closeList"></music-list>

    <audio src=""
      @playing="playing"
      @pause="pause"
      @timeupdate="timeUpdate"
      @loadedmetadata="loadedMetadata"
      @ended="ended"
      ref="audio"></audio>

  </div>
</template>

<script>
import Headbar from '@/components/Headbar.vue'
import Lyrics from '@/components/Lyrics.vue'
import Controller from '@/components/Controller.vue'
import MusicList from '@/components/MusicList.vue'

import {
  listRandom,
  getPrevious,
  getNext
} from '@/utils'
import * as Remote from '@/remote'

export default {
  name: 'player',
  components: {
    Headbar,
    Lyrics,
    Controller,
    MusicList
  },
  data: function() {
    return {
      currentTime: 0,
      totalTime: 0,
      isPlaying: false,
      listShow: false,
      list: [],
      currentSong: {},
      isFirst: true,
      loopMode: 0,
      currentIndex: 0
    }
  },
  methods: {
    timeUpdate () {
      this.currentTime = this.$refs.audio.currentTime
    },
    loadedMetadata () {
      this.totalTime = this.$refs.audio.duration
    },
    playing () {
      this.isPlaying = true
    },
    pause () {
      this.currentTime = this.$refs.audio.currentTime
      this.isPlaying = false
    },
    ended () {
      switch (this.loopMode) {
        case 0:
          this.next()
          break;
        case 1:
          this.$refs.audio.play()
          break;
        case 2:
          let randomIndex = listRandom(this.list.length, this.currentIndex)
          this.play(randomIndex)
          break;
      }
    },
    play (index) {
      let audio = this.$refs.audio
      let id = this.list[index].id
      if(id != this.currentSong.id) {
        if(this.isPlaying) {
          audio.pause()
        }
        if(this.isFirst) {      //移动端浏览器对媒体的播放只能通过用户交互来加载，异步函数内的js加载不算用户交互
          audio.load()          //所以load()在需要在交互函数(此处是play)内先执行一次
          this.isFirst = false  //后面的就可以正常执行了
        }
        this.currentTime = 0
        this.totalTime = 0
        this._loadMusic(id).then(() => {
          audio.play()
          this.currentIndex = index
        }).catch(res => {
          console.error(res)//TODO
        })
      } else if(id == this.currentSong.id && !this.isPlaying) {
        audio.play()
      }
    },
    updateTime (currentTime) {
      this.$refs.audio.currentTime = currentTime
    },
    togglePop () {
      let audio = this.$refs.audio
      if(audio.paused) {
        audio.play()
      } else {
        audio.pause()
      }
    },
    toggleLoop () {
      if(this.loopMode+1 > 2) {
        this.loopMode = 0
      } else {
        this.loopMode++
      }
    },
    showList () {
      this.listShow = true
    },
    closeList () {
      this.listShow = false
    },
    remove (index) {
      this.list.splice(index, 1)
      this.$ls.set('list', this.list);
    },
    previous () {
      let previousIndex = getPrevious(this.list.length, this.currentIndex, this.loopMode)
      this.play(previousIndex)
    },
    next () {
      let nextIndex = getNext(this.list.length, this.currentIndex, this.loopMode)
      this.play(nextIndex)
    },
    _loadMusic (id) {
      let audio = this.$refs.audio
      Remote.getMusicDetail(id).then(res => {
        this.currentSong = res.body.songs[0]
      }).catch(res => {
        console.error(res)//TODO
      })
      return Remote.getMusicUrl(id).then(res => {
        audio.src = res.body.data[0].url
        audio.load()
      })
    },
    _loadList (callback) {
      let list = this.$ls.get('list')
      let id = '48531831'
      if(list) {
        this.list = list
        if(callback && typeof callback == 'function') {
          callback()
        }
      } else {
        Remote.getPlayList(id).then(res => {
          this.list = res.body.playlist.tracks
          this.$ls.set('list', this.list)
          if(callback && typeof callback == 'function') {
            callback()
          }
        }, res => {
          console.error(res)//TODO
        })
      }
    }
  },
  mounted: function() {
    this._loadList(() => {
      this._loadMusic(this.list[0].id).then(() => {
        this.currentIndex = 0
      }).catch(res => {
        console.error(res)//TODO
      })
    })
  }
}
</script>

<style>
@import url("//at.alicdn.com/t/font_383468_qpislzg22ulerk9.css");

html, body {
  height: 100%;
  margin: 0;
}

body {
  box-sizing: border-box;
  padding: 45px 0 100px 0;
}

#lyrics {
}

#headbar {
  position: absolute;
  top: 0;
  left: 0;
}

#controller {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
}
</style>
