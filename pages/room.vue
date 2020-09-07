<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6 style="min-width: 240px">
      <v-card v-for="player in $store.getters.getPlayers" :key="player.userName" class="card">
        <MasterSVG v-if="player.isGameMaster" color="#ccc" :width="24" class="svg" />
        <v-card-text class="text-center my-2 text-h5">{{ player.userName }}</v-card-text>
      </v-card>
      <div class="d-flex justify-center mt-5 pt-5">
        <v-btn v-if="$store.getters.getGameMaster" @click="selectInsider">auto select insider</v-btn>
        <v-btn v-else :disabled="playableCount===0" @click="play">play</v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from '@/plugins/firebaseInit'
import MasterSVG from '@/components/Master'
import { Player } from '@/types'
import words from '@/words'

const db = firebase.firestore()
const aRoomRef = db.collection('room').doc('roomAutoID')
const uidsRef = db
  .collection('room')
  .doc('roomAutoID')
  .collection('uids')

export default {
  components: {
    MasterSVG
  },
  data() {
    return {
      playableCount: 0
    }
  },
  created() {
    this.$store.dispatch('fetchRoom')
    aRoomRef.onSnapshot((doc) => {
      this.playableCount = doc.data().playableCount
    })
  },
  methods: {
    play: async function() {
      aRoomRef.update({})
      this.$router.push({ path: '/play' })
    },
    selectInsider: async function() {
      const players = this.$store.getters.getPlayers
      const playersUid = []
      players.forEach((player) => {
        if (!player.isGameMaster) {
          playersUid.push(player.uid)
        }
      })

      let randomNum = Math.floor(Math.random() * playersUid.length)
      await uidsRef.doc(playersUid[randomNum]).update({ isInsider: true })
      await aRoomRef.update({ playableCount: playersUid.length })

      randomNum = Math.floor(Math.random() * words.length)
      await aRoomRef.update({ word: words[randomNum] })

      this.$router.push({ path: '/play' })
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