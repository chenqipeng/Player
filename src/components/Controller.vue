<template lang="html">
  <div id="controller">
    <div class="progress-control">
      <div class="current-time">{{cTime | sToms}}</div>
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

  </div>
</template>

<script>
export default {
  props: [
    'currentTime',
    'totalTime',
    'isPlaying',
    'loopMode',
  ],
  data: function() {
    return {
      locked: false,
      cTime: this.currentTime
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
      return (this.totalTime>0) ? (this.cTime/this.totalTime*100 + '%') : 0
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
    followTouch (event) {
      this.locked = true
      const BeginX = 60 //触点起始横坐标，值为进度条偏移值
      const TotalWidth = this.$refs.progresBar.offsetWidth
      let clientX = event.changedTouches[0].clientX
      let offsetX = (clientX>BeginX) ? clientX-BeginX : 0
      let currentX = (offsetX<TotalWidth) ? offsetX : TotalWidth
      let currentS = Math.round(currentX/TotalWidth * this.totalTime)
      this.cTime = currentS
    },
    updateTouch () {
      this.locked = false
      this.$emit('update-time', this.cTime)
    },
    togglePop () { //toggle Play Or Pause
      this.$emit('toggle-pop')
    },
    showList () {
      this.$emit('show-list')
    },
    toggleLoop () {
      this.$emit('toggle-loop')
    },
    previous () {
      this.$emit('previous')
    },
    next () {
      this.$emit('next')
    }
  },
  watch: {
    currentTime: function() {
      if(!this.locked) {
        this.cTime = this.currentTime
      }
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


</style>
