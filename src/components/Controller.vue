<template lang="html">
  <div id="controller">
    <div class="progress-control">
      <div class="current-time">00:52</div>
      <div class="progress-bar">
        <div class="current-point"></div>
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
}
</script>

<style lang="css">
.progress-control {
  position: relative;
  box-sizing: border-box;
  height: 22px;
  padding: 10px 60px;
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

.progress-bar {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: #ccc;
}

.current-time {
  left: 0;
}

.total-time {
  right: 0;
}

.current-point {
  position: absolute;
  top: -6px;
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
