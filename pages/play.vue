<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <p class="text-h4 my-5">You're role is ...</p>
      <v-card
        v-if="$store.getters.getGameMaster"
        elevation="4"
        :shaped="true"
        class="svg-center pa-3"
      >
        <MasterSVG color="#ddd" :width="128" class="ma-5" />
        <v-card-title class="justify-center">Game Master</v-card-title>
      </v-card>
      <v-card v-else-if="isInsider" elevation="4" :shaped="true" class="svg-center pa-3">
        <InsiderSVG color="#ddd" :width="128" class="ma-5" />
        <v-card-title class="justify-center">Insider</v-card-title>
      </v-card>
      <v-card v-else elevation="4" :shaped="true" class="svg-center pa-3">
        <CommonsSVG color="#ddd" :width="128" class="ma-5" />
        <v-card-title class="justify-center">Commons</v-card-title>
      </v-card>
      <div class="d-flex justify-center">
        <v-btn @click="isOpen=true" :disabled="!$store.getters.getGameMaster" class="my-3">timer</v-btn>
      </div>
      <v-dialog v-model="isOpen" max-width="240">
        <v-card class="blue-grey lighten-5 pa-3">
          <v-card-text
            class="text-center blue-grey--text text--darken--4 text-h3"
          >{{('00'+Math.floor(seconds/60)).slice(-2)}}:{{('00'+seconds%60).slice(-2)}}</v-card-text>
          <v-card-actions>
            <v-btn @click="reverse"><</v-btn>
            <v-btn @click="stop">||</v-btn>
            <v-btn @click="start">></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div v-if="isInsider || $store.getters.getGameMaster" class="d-flex justify-center mt-5">
        <v-card color="blue-grey darken-3" width="240px">
          <v-card-title class="text-subtitle-2 px-3 pt-2 pb-0">Answer</v-card-title>
          <v-card-text class="text-center blue--text text--lighten-5 text-h6 pa-2">{{ this.word }}</v-card-text>
        </v-card>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from '@/plugins/firebaseInit'
import CommonsSVG from '@/components/Commons'
import InsiderSVG from '@/components/Insider'
import MasterSVG from '@/components/Master'

const db = firebase.firestore()
const roomRef = db.collection('room')
const aRoomRef = db.collection('room').doc('roomAutoID')

export default {
  components: {
    CommonsSVG,
    InsiderSVG,
    MasterSVG
  },
  data() {
    return {
      isOpen: false,
      isInsider: false,
      timerId: null,
      seconds: 60 * 5,
      word: ''
    }
  },
  created() {
    this.$store.getters.getPlayers.forEach((player) => {
      if (player.uid === this.$store.getters.getUserUid) {
        this.isInsider = player.isInsider
      }
    })

    roomRef.get().then((snapShot) => {
      snapShot.forEach((doc) => {
        this.word = doc.data().word
      })
    })
  },
  methods: {
    start: function() {
      aRoomRef.update({ playableCount: 0 })
      this.timerId = setInterval(() => {
        this.seconds--
      }, 1000)
    },
    stop: function() {
      clearInterval(this.timerId)
    },
    reverse: function() {
      this.timerId = setInterval(() => {
        this.seconds++
      }, 1000)
    }
  }
}
</script>

<style>
.svg-center {
  text-align: center !important;
}
</style>