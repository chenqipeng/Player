<template lang="html">
  <div id="controller">
    <div class="progress-control">
      <div class="current-time">{{time}}</div>
      <div class="progress-bar" @touchstart="touchstart" @touchmove="touchmove">
        <div class="progress-line" id="progress-line"></div>
        <div class="progress-point"></div>
      </div>
      <div class="total-time">05:00</div>
    </div>
    <div class="play-control">
      <div class="column">
        <span class="iconfont icon-liebiaoxunhuan"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-shangyishou"></span>
      </div>
      <div class="column">
        <span class="iconfont icon-zanting"></span>
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
      time: '00:00'
    }
  },
  methods: {
    touchstart (event) {
      this.time = calTime(event.changedTouches[0].clientX);
    },
    touchmove (event) {
      this.time = calTime(event.changedTouches[0].clientX);
    }
  }
}

/**
 * 触点起始横坐标，值为进度条偏移值
 * @type {Number}
 */
const BeginX = 60;

/**
 * 计算用户调节的时间
 * @param  {Number} x 触点的clientX
 * @return {String} “分:秒”
 */
function calTime(x) {
  const TotalWidth = document.getElementById('progress-line').offsetWidth;
  const TotalTime = 300;
  let offsetX = (x>BeginX) ? Math.round(x-BeginX) : 0;
  let currentX = (offsetX<TotalWidth) ? offsetX : TotalWidth;
  let currentS = Math.round(currentX/TotalWidth*TotalTime);
  return trsfTime(currentS);
}

/**
 * 将秒数转换成“分:秒”的形式
 * @param  {Number} second 秒数
 * @return {String} “分:秒”
 */
function trsfTime(second) {
  let m = Math.trunc(second/60);
  let s = Math.trunc(second%60);
  let format = (b) => (b>=10) ? b : ('0'+b);
  return format(m) + ':' + format(s);
}
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
  position: relative;
  box-sizing: border-box;
  height: 100%;
  padding: 10px 0px;
}

.progress-line {
  height: 100%;
  background-color: #ccc;
}

.progress-point {
  position: absolute;
  top: 4px;
  left: -7px;
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
