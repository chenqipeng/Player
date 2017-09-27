<template lang="html">
  <div id="music-list">
    <transition name="bg">
      <div class="list-bg" v-show="listShow" @click="closeList"></div>
    </transition>

    <transition name="box">
      <div class="list-box" v-show="listShow">
        <div class="list-head">
          <a class="list-loop" @click.stop="toggleLoop"><span class="iconfont" :class="loopClass"></span>列表循环({{list.length}})</a>
          <a class="list-clean"><span class="iconfont icon-qingkong"></span>清空</a>
          <a class="list-collect"><span class="iconfont icon-shoucang"></span>收藏</a>
        </div>
        <div class="list-body">
          <ul class="list-content">
            <li v-for="(song, index) in list" class="list-item" :class="{active: index==currentIndex}" @click="play(index)">
              {{song.name}}
              <span class="list-singer">-{{song.ar | arToString}}</span>
              <span class="iconfont icon-cha" @click.stop="remove(index)"></span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: [
    'list',
    'listShow',
    'loopMode',
    'currentIndex'
  ],
  computed: {
    loopClass () {
      return {
        'icon-liebiaoxunhuan': 0 == this.loopMode,
        'icon-danquxunhuan'  : 1 == this.loopMode,
        'icon-suijibofang'   : 2 == this.loopMode
      }
    }
  },
  methods: {
    closeList () {
      this.$emit('close-list')
    },
    toggleLoop () {
      this.$emit('toggle-loop')
    },
    play (index) {
      this.$emit('play', index)
    },
    remove (index) {
      this.$emit('remove', index)
    }
  }
}
</script>

<style lang="css" scoped>
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
