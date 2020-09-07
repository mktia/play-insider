import firebase from '@/plugins/firebaseInit'
import { Player } from '@/types'

const db = firebase.firestore()
const uidsRef = db
  .collection('room')
  .doc('roomAutoID')
  .collection('uids')

export const state = () => ({
  userUid: '',
  userName: '',
  isGameMaster: false,
  isInsider: false,
  players: Array<Player>()
})

export const mutations = {
  setUserUid(state: any, userUid: string) {
    state.userUid = userUid
  },
  setUserName(state: any, userName: string) {
    state.userName = userName
  },
  setGameMaster(state: any, isGameMaster: string) {
    state.isGameMaster = isGameMaster
  },
  setInsider(state: any, isInsider: boolean) {
    state.isInsider = isInsider
  },
  setPlayer(state: any, players: Array<Player>) {
    state.players = players
  }
}

export const actions = {
  async join({ commit }: any, me: Player) {
    console.log('connecting...')

    const result = await firebase.auth().signInAnonymously()
    const user = result.user
    if (user !== null) {
      console.log(`join by uid: ${user.uid}`)
      commit('setUserUid', user.uid)
      commit('setUserName', me.userName)
      commit('setGameMaster', me.isGameMaster)

      await uidsRef.doc(user.uid).set({
        uid: user.uid,
        userName: me.userName,
        isGameMaster: me.isGameMaster,
        isInsider: false
      })
    }
  },
  async fetchRoom({ commit }: any) {
    uidsRef.onSnapshot((docSnapshot) => {
      const players = Array<Player>()
      docSnapshot.forEach((doc) => {
        const data = doc.data()
        players.push({
          uid: data.uid,
          userName: data.userName,
          isGameMaster: data.isGameMaster,
          isInsider: data.isInsider
        })
      })
      commit('setPlayer', players)
    })
  }
}

export const getters = {
  getUserUid(state: any): string {
    return state.userUid
  },
  getUserName(state: any): string {
    return state.userName
  },
  getGameMaster(state: any): boolean {
    return state.isGameMaster
  },
  getInsider(state: any): boolean {
    return state.isInsider
  },
  getPlayers(state: any): Array<Player> {
    return state.players
  }
}
