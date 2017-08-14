<template lang="html">
  <div id="headbar">
    <div class="back iconfont icon-fanhui"></div>
    <div class="title">
      <h1>Without You (feat. Usher)</h1>
      <span>David Guetta/Usher</span>
    </div>
    <div class=" share iconfont icon-fenxiang"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="css">
@import url("//at.alicdn.com/t/font_383468_gljc0u2t9ktn8kt9.css");

#headbar {
  height: 120px;
  padding: 0 120px;
}

.title {
  height: 100px;
  padding: 10px;
}

.back, .share {
  position: absolute;
  top: 0;
  width: 120px;
  height: 120px;
  line-height: 120px;
  font-size: 65px;
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
  padding-top: 10px;
  font-size: 32px;
  line-height: 50px;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.title span {
  font-size: 24px;
  color: #999;
}

</style>
