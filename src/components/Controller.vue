<template lang="html">
  <div id="controller">
    <audio id="audioPlayer" controls @canplay="canPlay" @play="play" @pause="pause" src="http://www.w3school.com.cn/i/song.mp3"></audio>

    <div class="progress-control">
      <div class="current-time">{{currentTime}}</div>
      <div class="progress-bar" id="progress-bar" @touchstart="followTouch" @touchmove="followTouch" @touchend="updateTouch">
        <div class="progress-line" id="progress-line">
          <span class="progress-point"></span>
        </div>
      </div>
      <div class="total-time">{{totalTime}}</div>
    </div>

    <div class="play-control">
      <div class="column">
        <span class="iconfont icon-liebiaoxunhuan"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-shangyishou"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-bofang" id="toggle" @touchend="togglePop"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-xiayishou"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-bofangliebiao"></span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data: function() {
    return {
      currentTime: '00:00',
      totalTime: '00:00'
    }
  },
  methods: {
    followTouch (event) {
      if(UpdateView.si !== 0) { //先停止自动更新视图
        clearInterval(UpdateView.si);
        UpdateView.si = 0;
      }

      const BeginX = 60; //触点起始横坐标，值为进度条偏移值
      const TotalWidth = document.getElementById('progress-bar').offsetWidth;
      const TotalTime = document.getElementById('audioPlayer').duration;
      let progressLine = document.getElementById('progress-line');
      let clientX = event.changedTouches[0].clientX;
      let offsetX = (clientX>BeginX) ? clientX-BeginX : 0;
      let currentX = (offsetX<TotalWidth) ? offsetX : TotalWidth;
      let currentS = Math.round(currentX/TotalWidth*TotalTime);
      progressLine.style.width = currentX + 'px';
      this.currentTime = sToms(currentS);
    },
    updateTouch () {
      let vm = this;
      let audio = document.getElementById('audioPlayer');
      audio.currentTime = msTos(this.currentTime);
      if(!audio.paused) { //恢复视图自动更新
        UpdateView.si = setInterval(function() {
          UpdateView.progressLine(audio.currentTime);
          vm.currentTime = sToms(audio.currentTime);
        }, UpdateView.TimeOut);
      }
    },
    togglePop () {
      let audio = document.getElementById('audioPlayer');
      if(audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    },
    canPlay () {
      this.totalTime = sToms(document.getElementById('audioPlayer').duration);
    },
    play () {
      let vm = this;
      let audio = document.getElementById('audioPlayer');
      UpdateView.toggle();
      UpdateView.si = setInterval(function() {
        UpdateView.progressLine(audio.currentTime);
        vm.currentTime = sToms(audio.currentTime);
      }, UpdateView.TimeOut);
    },
    pause () {
      let audio = document.getElementById('audioPlayer');
      UpdateView.toggle();
      UpdateView.progressLine(audio.currentTime);
      this.currentTime = sToms(audio.currentTime);
      clearInterval(UpdateView.si);
      UpdateView.si = 0;
    }
  }
}

/**
 * 将's'形式转换成'mm:ss'
 * @param  {Number} s 秒数
 * @return {String} 'mm:ss'形式
 */
function sToms(s) {
  let min = Math.trunc(s/60);
  let second = Math.trunc(s%60);
  let format = (b) => (b>=10) ? b : ('0'+b);
  return format(min) + ':' + format(second);
}

/**
 * 将'mm:ss'形式转换成's'
 * @param  {String} ms 'mm:ss'形式
 * @return {Number} 秒数
 */
function msTos(ms) {
  let msAry = ms.split(':');
  return msAry[0]*60 + msAry[1];
}

/**
 * 视图更新对象
 * @type {Object}
 */
const UpdateView = {
  si: 0, //setInterval intervalID
  TimeOut: 500, //setInterval timeout
  progressLine (currentTime) {
    const TotalWidth = document.getElementById('progress-bar').offsetWidth;
    const TotalTime = document.getElementById('audioPlayer').duration;
    let currentX = currentTime/TotalTime * TotalWidth;
    document.getElementById('progress-line').style.width = currentX + 'px';
  },
  toggle () {
    let toggleEl = document.getElementById('toggle');
    toggleEl.classList.toggle('icon-bofang');
    toggleEl.classList.toggle('icon-zanting');
  }
};

</script>

<style lang="css">
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
</style>
