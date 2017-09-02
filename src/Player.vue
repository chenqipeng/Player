<template>
  <div id="player">
    <headbar></headbar>
    <lyrics></lyrics>
    <controller></controller>
  </div>
</template>

<script>
import Headbar from '@/components/Headbar.vue'
import Lyrics from '@/components/Lyrics.vue'
import Controller from '@/components/Controller.vue'

export default {
  name: 'player',
  components: {
    Headbar,
    Lyrics,
    Controller
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
