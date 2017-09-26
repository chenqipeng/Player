<template lang="html">
  <div id="controller">
    <audio src=""
    @playing="playing"
    @pause="pause"
    @timeupdate="timeUpdate"
    @loadedmetadata="loadedMetadata"
    @ended="ended"
    ref="audio"></audio>

    <div class="progress-control">
      <div class="current-time">{{currentTime | sToms}}</div>
      <div class="progress-bar" ref="progresBar" @touchstart="followTouch" @touchmove="followTouch" @touchend="updateTouch">
        <div class="progress-line" :style="{width: progressX}">
          <span class="progress-point"></span>
        </div>
      </div>
      <div class="total-time">{{totalTime | sToms}}</div>
    </div>

    <div class="play-control">
      <div class="column">
        <span class="iconfont" :class="loopClass" @click="toggleLoop"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-shangyishou" @click="previous"></span>
      </div>
      <div class="column">
        <span class="iconfont" :class="toggleClass" @click="togglePop"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-xiayishou" @click="next"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-bofangliebiao" @click="showList"></span>
      </div>
    </div>

    <transition name="bg">
      <div class="list-bg" v-if="listShow" @click="closeList"></div>
    </transition>

    <transition name="box">
      <div class="list-box" v-if="listShow">
        <div class="list-head">
          <a class="list-loop" @click.stop="toggleLoop"><span class="iconfont" :class="loopClass"></span>列表循环(20)</a>
          <a class="list-clean"><span class="iconfont icon-qingkong"></span>清空</a>
          <a class="list-collect"><span class="iconfont icon-shoucang"></span>收藏</a>
        </div>
        <div class="list-body">
          <ul class="list-content">
            <li v-for="(song, index) in list" class="list-item" :class="{active: index==currentIndex}" @click="play(index)">
              {{song.name}}
              <span class="list-singer">-{{song.ar[0].name}}</span>
              <span class="iconfont icon-cha" @click.stop="remove(index)"></span>
            </li>
          </ul>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import {
  listRandom,
  getPrevious,
  getNext
} from '@/utils'

import * as Remote from '@/remote'

export default {
  data: function() {
    return {
      currentTime: 0,
      totalTime: 0,
      isPlaying: false,
      listShow: false,
      list: [],
      currentSong: {},
      locked: false,
      isFirst: true,
      loopMode: 0,
      currentIndex: 0
    }
  },
  computed: {
    toggleClass () {
      return {
        'icon-bofang': !this.isPlaying,
        'icon-zanting': this.isPlaying
      }
    },
    progressX () {
      return (this.totalTime>0) ? (this.currentTime/this.totalTime*100 + '%') : 0
    },
    loopClass () {
      return {
        'icon-liebiaoxunhuan': 0 == this.loopMode,
        'icon-danquxunhuan'  : 1 == this.loopMode,
        'icon-suijibofang'   : 2 == this.loopMode
      }
    }
  },
  methods: {
    timeUpdate () {
      if(!this.locked) {
        this.currentTime = this.$refs.audio.currentTime
      }
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
    followTouch (event) {
      this.locked = true
      const BeginX = 60 //触点起始横坐标，值为进度条偏移值
      const TotalWidth = this.$refs.progresBar.offsetWidth
      let clientX = event.changedTouches[0].clientX
      let offsetX = (clientX>BeginX) ? clientX-BeginX : 0
      let currentX = (offsetX<TotalWidth) ? offsetX : TotalWidth
      let currentS = Math.round(currentX/TotalWidth * this.totalTime)
      this.currentTime = currentS
    },
    updateTouch () {
      this.locked = false
      this.$refs.audio.currentTime = this.currentTime
    },
    togglePop () {
      let audio = this.$refs.audio
      if(audio.paused) {
        audio.play()
      } else {
        audio.pause()
      }
    },
    showList () {
      this._loadList(() => {
        this.listShow = true
      })
    },
    closeList (event) {
      this.listShow = false
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
    remove (index) {
      this.list.splice(index, 1)
      this.$ls.set('list', this.list);
    },
    toggleLoop () {
      if(this.loopMode+1 > 2) {
        this.loopMode = 0
      } else {
        this.loopMode++
      }
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

<style lang="css" scoped>
.progress-control {
  position: relative;
  box-sizing: border-box;
  height: 22px;
  padding: 0px 60px;
}

.current-time, .total-time {
  position: absolute;
  top: 0;
  width: 60px;
  height: 100%;
  text-align: center;
  line-height: 25px;
  font-size: 12px;
}

.current-time {
  left: 0;
}

.total-time {
  right: 0;
}

.progress-bar {
  box-sizing: border-box;
  height: 100%;
  padding: 10px 0px;
  background: #CCC content-box;
}

.progress-line {
  position: relative;
  width: 0;
  height: 100%;
  background-color: #F00;
}

.progress-point {
  position: absolute;
  top: -6px;
  right: -7px;
  width: 14px;
  height: 14px;
  background-color: #000;
  border-radius: 7px;
}

.play-control {
  margin-top: 20px;
  font-size: 0;
}

.column {
  display: inline-block;
  width: 20%;
  text-align: center;
}
.column .iconfont {
  font-size: 32px;
}

.list-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.list-box {
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  height: 375px;
  padding-top: 50px;
  background-color: #FAFAFA;
  z-index: 2;
}

.list-head {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px #DDD solid;
}

.list-head a {
  display: inline-block;
  padding: 0 15px;
  height: 100%;
  color: #000;
  text-decoration: none;
  font-size: 14px;
}

.list-head .iconfont {
  display: block;
  float: left;
  margin-right: 2px;
  font-size: 20px;
  color: #999;
}

.list-head a:nth-of-type(n+2) {
  float: right;
}

.list-body {
  box-sizing: border-box;
  padding-bottom: 10px;
  height: 100%;
  overflow: scroll;
}

.list-body::-webkit-scrollbar {
  display: none;
}

.list-content {
  margin: 0;
  padding: 0 0 0 10px;
  list-style: none;
}

.list-item {
  position: relative;
  padding-right: 45px;
  box-sizing: border-box;
  height: 45px;
  line-height: 45px;
  overflow: hidden;
  border-bottom: 1px #EEE solid;
}
.list-singer {
  font-size: 12px;
  color: #999;
}
.list-item.active, .active .list-singer {
  color: #F00;
}
.list-item .iconfont {
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 45px;
  height: 100%;
  text-align: center;
  color: #999;
}

.bg-enter-active, .bg-leave-active {
  transition: background-color .3s;
}
.bg-enter, .bg-leave-to {
  background-color: rgba(0, 0, 0, 0);
}
.bg-enter-to {
  background-color: rgba(0, 0, 0, 0.3);
}

.box-enter-active, .box-leave-active {
  transition: bottom .3s;
}
.box-enter, .box-leave-to {
  bottom: -375px;
}
.box-enter-to {
  bottom: 0px;
}
</style>
