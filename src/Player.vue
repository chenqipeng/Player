<template>
  <div id="player">
    <headbar></headbar>
    <p>Player</p>
    controlbar
  </div>
</template>

<script>
import headbar from '@/components/Headbar.vue'

export default {
  name: 'player',
  components: {headbar}
}
</script>

<style>
html, body {
  margin: 0;
}
</style>
