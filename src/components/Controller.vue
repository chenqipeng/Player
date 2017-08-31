<template lang="html">
  <div id="controller">
    <audio ref="audio" @canplay="canPlay" @playing="playing" @pause="pause" src="http://www.w3school.com.cn/i/song.mp3"></audio>

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
        <span class="iconfont icon-liebiaoxunhuan"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-shangyishou"></span>
      </div>
      <div class="column">
        <span class="iconfont" :class="toggleClass" @touchend="togglePop"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-xiayishou"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-bofangliebiao" @touchend="list"></span>
      </div>
    </div>

    <div class="list-container" :style="{display: listShow ? 'block' : 'none'}" @touchend.self="closeList">
      <div class="list-box">
        <div class="list-head">
          <a href="#" class="list-loop">列表循环</a>
          <a href="#" class="list-collect">收藏</a>
          <a href="#" class="list-clean">清空</a>
        </div>
        <div class="list-body">
          <ul class="list-content">
            <li v-for="n in 20" class="list-item">song{{n}}<span>-singer{{n}}</span></li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data: function() {
    return {
      currentTime: 0,
      totalTime: 0,
      isPlaying: false,
      si: 0,
      listShow: false
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
    }
  },
  methods: {
    followTouch (event) {
      if(this.si !== 0) { //先停止自动更新视图
        clearInterval(this.si)
        this.si = 0
      }
      const BeginX = 60 //触点起始横坐标，值为进度条偏移值
      const TotalWidth = this.$refs.progresBar.offsetWidth
      const TotalTime = this.$refs.audio.duration
      let clientX = event.changedTouches[0].clientX
      let offsetX = (clientX>BeginX) ? clientX-BeginX : 0
      let currentX = (offsetX<TotalWidth) ? offsetX : TotalWidth
      let currentS = Math.round(currentX/TotalWidth*TotalTime)
      this.currentTime = currentS
    },
    updateTouch () {
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
    canPlay () {
      this.totalTime = this.$refs.audio.duration
    },
    playing () {
      let vm = this
      this.isPlaying = true
      this.si = setInterval(function() {
        vm.currentTime = vm.$refs.audio.currentTime
      }, 500)
    },
    pause () {
      this.currentTime = this.$refs.audio.currentTime
      clearInterval(this.si)
      this.si = 0
      this.isPlaying = false
    },
    list () {
      this.listShow = true
      // this.$http.get('/api').then(response => {
      //   console.log(response)
      // }, response => {
      //   console.error(response)
      // })
    },
    closeList (event) {
      this.listShow = false
    }
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
  background: #ccc content-box;
}

.progress-line {
  position: relative;
  width: 0;
  height: 100%;
  background-color: #f00;
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

.list-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}

.list-box {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 325px;
  padding-top: 50px;
  background-color: #FAFAFA;
}

.list-head {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px #ddd solid;
}

.list-head a {
  display: inline-block;
  padding: 0 15px;
  height: 100%;
  color: #000;
  text-decoration: none;
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
  box-sizing: border-box;
  padding: 10px 0;
  height: 45px;
  border-bottom: 1px #eee solid;
}
.list-item span {
  font-size: 12px;
  color: #999;
}
</style>
