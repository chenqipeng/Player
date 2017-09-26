<template lang="html">
  <div id="headbar">
    <div class="back iconfont icon-fanhui"></div>
    <div class="title">
      <h1>{{currentSong.name}}</h1>
      <span>{{currentSong.ar | arToString}}</span>
    </div>
    <div class=" share iconfont icon-fenxiang"></div>
  </div>
</template>

<script>
export default {
  props: [
    'currentSong'
  ]
}
</script>

<style lang="css" scoped>
#headbar {
  box-sizing: border-box;
  width: 100%;
  height: 45px;
  padding: 0 45px;
}

.title {
  height: 100%;
}

.back, .share {
  position: absolute;
  top: 0;
  width: 45px;
  height: 45px;
  line-height: 45px;
  font-size: 24px;
  text-align: center;
}

.back {
  left: 0;
}

.share {
  right: 0;
}

.title h1 {
  width: 100%;
  margin: 0;
  padding-top: 5px;
  font-size: 14px;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.title span {
  font-size: 12px;
  color: #999;
}

</style>
