<template>
  <v-layout>
    <v-flex class="text-center">
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
      <div>
        <v-btn @click="resetRoom">reset room</v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import firebase from '@/plugins/firebaseInit'

const db = firebase.firestore()
const uidsRef = db
  .collection('room')
  .doc('roomAutoID')
  .collection('uids')

export default {
  methods: {
    resetRoom: async function() {
      const uids: Array<string> = []
      await uidsRef.get().then((snapShot) => {
        snapShot.forEach((doc) => {
          uids.push(doc.data().uid)
        })
      })
      uids.forEach(async (uid) => {
        await uidsRef.doc(uid).delete()
      })
    }
  }
}
</script>
