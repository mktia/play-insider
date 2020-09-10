<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6 style="min-width: 240px">
      <v-card v-for="player in $store.getters.getPlayers" :key="player.userName" class="card">
        <MasterSVG v-if="player.isGameMaster" color="#ccc" :width="24" class="svg" />
        <v-card-text class="text-center my-2 text-h6">{{ player.userName }}</v-card-text>
      </v-card>
      <div class="d-flex justify-center mt-5 pt-5">
        <v-btn v-if="$store.getters.getGameMaster" @click="selectInsider">auto select insider</v-btn>
        <v-btn v-else :disabled="playableCount===0" @click="play">play</v-btn>
        <v-btn text @click="sync">
          <SyncSVG :width="24" color="#666" />
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from '@/plugins/firebaseInit'
import MasterSVG from '@/components/Master'
import SyncSVG from '@/components/Sync'
import { Player } from '@/types'
import words from '@/words'
import SyncVue from '~/components/Sync.vue'

const db = firebase.firestore()
const roomRef = db.collection('room')

export default {
  components: {
    MasterSVG,
    SyncSVG
  },
  data() {
    return {
      playableCount: 0
    }
  },
  created() {
    const roomId = this.$store.getters.getRoomId
    const aRoomRef = roomRef.doc(roomId)
    const uidsRef = aRoomRef.collection('uids')

    this.$store.dispatch('fetchRoom', roomId)
    aRoomRef.onSnapshot((doc) => {
      if (doc.exists) {
        this.playableCount = doc.data().playableCount
      }
    })
  },
  methods: {
    play: async function() {
      const aRoomRef = roomRef.doc(this.$store.getters.getRoomId)
      this.$router.push({ path: '/play' })
    },
    selectInsider: async function() {
      const aRoomRef = roomRef.doc(this.$store.getters.getRoomId)
      const uidsRef = aRoomRef.collection('uids')

      const players = this.$store.getters.getPlayers
      const playersUid = []
      players.forEach((player) => {
        if (!player.isGameMaster) {
          playersUid.push(player.uid)
        }
      })

      let randomNum = Math.floor(Math.random() * playersUid.length)
      await uidsRef.doc(playersUid[randomNum]).update({ isInsider: true })

      randomNum = Math.floor(Math.random() * words.length)
      await aRoomRef.set({ playableCount: playersUid.length, word: words[randomNum] })

      this.$router.push({ path: '/play' })
    },
    sync: function() {
      this.$store.dispatch('fetchRoom', this.$store.getters.getRoomId)
    }
  }
}
</script>

<style>
.card {
  position: relative;
}

.svg {
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>