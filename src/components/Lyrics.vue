<template lang="html">
  <div id="lyrics">
    <transition name="album">
      <div v-if="albumActive" @click="showLyric" class="content album">
        <img :src="currentSong.al && currentSong.al.picUrl" class="pic">
      </div>
    </transition>
    <transition name="lyric">
      <div v-if="!albumActive" @click="showAlbum" class="content">
        <p>{{activeLyric}}</p>
      </div>
    </transition>
  </div>
</template>

<script>
import * as Remote from '@/remote'
export default {
  data: function() {
    return {
      albumActive: true,
      lyrics: '',
      activeLyric: ''
    }
  },
  computed: {
    lyricsMap () {
      let lyr = {}
      this.lyrics.split('\n').forEach(a => {
        lyr[a.substr(1, 2)*60 + (+a.substr(4, 2))] = a.replace(/\[.*\]/, '')
      })
      return lyr
    }
  },
  props: [
    'currentSong',
    'currentTime'
  ],
  methods: {
    showAlbum () {
      this.albumActive = true
    },
    showLyric () {
      this.albumActive = false
    }
  },
  watch: {
    currentSong () {
      Remote.getLyrics(this.currentSong.id).then(res => {
        this.lyrics = res.body.lrc.lyric
      })
    },
    currentTime () {
      let active = this.lyricsMap[Math.floor(this.currentTime)]
      if(active) {
        this.activeLyric = active
      }
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
