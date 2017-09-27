<template lang="html">
  <div id="lyrics">
    <transition name="album">
      <div v-if="albumActive" @click="showLyric" class="content album">
        <img :src="currentSong.al.picUrl" class="pic">
      </div>
    </transition>
    <transition name="lyric">
      <div v-if="!albumActive" @click="showAlbum" class="content">
        <ul>
          <li v-for="i in 20"><p>歌词</p></li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      albumActive: true
    }
  },
  props: [
    'currentSong'
  ],
  methods: {
    showAlbum () {
      this.albumActive = true
    },
    showLyric () {
      this.albumActive = false
    }
  }
}
</script>

<style lang="css" scoped>
.album-enter-active, .album-leave-active {
  transition: opacity .3s;
}
.album-enter, .album-leave-to {
  opacity: 0;
}
.album-enter-to {
  opacity: 1;
}

.lyric-enter-active, .lyric-leave-active {
  transition: opacity .3s;
}
.lyric-enter, .lyric-leave-to {
  opacity: 0;
}
.lyric-enter-to {
  opacity: 1;
}

#lyrics {
  position: relative;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.album {
  position: relative;
}

.album .pic {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -100px;
  margin-left: -100px;
  width: 200px;
  height: 200px;
}
</style>
