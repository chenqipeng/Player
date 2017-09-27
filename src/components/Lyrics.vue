<template lang="html">
  <div id="lyrics">
    <transition name="album">
      <div v-show="albumActive" @click="showLyric" class="content album">
        <img :src="currentSong.al && currentSong.al.picUrl" class="pic">
      </div>
    </transition>
    <transition name="lyric">
      <div v-show="!albumActive" @click="showAlbum" class="content">
        <ul class="lyrics-list" ref="lyrics">
          <li class="lyrics-item" v-for="item in Object.keys(lyricsMap)" :class="{active: item==activeTime}">
            {{lyricsMap[item]}}
          </li>
        </ul>
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
      activeTime: 0,
      maxTop: NaN
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
    'currentTime',
    'totalTime',
    'seekedTime'
  ],
  methods: {
    showAlbum () {
      this.albumActive = true
    },
    showLyric () {
      this.albumActive = false
      this.scrollLyric()
    },
    scrollLyric (i) {
      const Offset = -40
      let index = i || Object.keys(this.lyricsMap).indexOf(this.activeTime.toString())
      let offsetY = index>=0 ? index*Offset : 0
      if(isNaN(this.maxTop)) {
        this.maxTop = +window.getComputedStyle(this.$refs.lyrics).top.replace('px', '')
      }
      this.$refs.lyrics.style.top = this.maxTop + offsetY + 'px'
    }
  },
  watch: {
    currentSong () {
      this.lyrics = ''
      this.activeTime = 0
      Remote.getLyrics(this.currentSong.id).then(res => {
        this.lyrics = res.body.lrc.lyric
      })
      this.$refs.lyrics.style.top = '50%'
    },
    currentTime () {
      let time = Math.floor(this.currentTime)
      if(this.lyricsMap[time] && time != this.activeTime) {
        this.activeTime = time
        this.scrollLyric()
      }
    },
    seekedTime () {
      let index = 0
      let lyricsKeys = Object.keys(this.lyricsMap)
      while (lyricsKeys[index] < this.seekedTime) {
        index++
      }
      this.activeTime = lyricsKeys[index]
      this.scrollLyric(index)
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

.active {
  color: #F00;
}

.lyrics-list {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  transition: top .3s;
}

.lyrics-item {
  box-sizing: border-box;
  padding: 0px 10px;
  width: 100%;
  height: 40px;
  text-align: center;
  overflow: hidden;
}
</style>
