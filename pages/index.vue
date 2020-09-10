<template>
  <v-layout column justify-center align-center align-content-center>
    <v-flex xs12 sm8 md6>
      <div>
        <v-form>
          <v-row>
            <v-text-field v-model="userName" label="Player's name" />
          </v-row>
          <v-row>
            <v-text-field v-model="roomId" label="Room ID" />
          </v-row>
          <v-row class="d-flex align-center">
            <span>I'm a game master.</span>
            <v-switch v-model="isGameMaster" class="ml-2" />
          </v-row>
        </v-form>
        <div class="d-flex justify-center mt-5 pt-5">
          <v-btn :disabled="userName===''" :loading="isLoading" @click="join">join</v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  transition: {
    name: 'page',
    mode: 'out-in'
  },
  data() {
    return {
      isGameMaster: false,
      isLoading: false,
      roomId: '',
      userName: ''
    }
  },
  methods: {
    join: function() {
      this.isLoading = true
      this.$store.dispatch('join', {
        isGameMaster: this.isGameMaster,
        roomId: this.roomId,
        userName: this.userName
      })
      this.$router.push({ name: 'room', params: { roomId: this.roomId } })
    },
    switchGameMaster: function() {
      this.isGameMaster = !this.isGameMaster
    }
  }
}
</script>