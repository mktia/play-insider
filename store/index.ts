import firebase from '@/plugins/firebaseInit'
import { Player } from '@/types'

export const state = () => ({
  userUid: '',
  userName: '',
  roomId: '',
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
  setRoomId(state: any, roomId: string) {
    state.roomId = roomId
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

export const getters = {
  getUserUid(state: any): string {
    return state.userUid
  },
  getUserName(state: any): string {
    return state.userName
  },
  getRoomId(state: any): string {
    return state.roomId
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

const db = firebase.firestore()
const roomRef = db.collection('room')

export const actions = {
  async join(
    { commit }: any,
    args: { userName: string; roomId: string; isGameMaster: boolean }
  ) {
    console.log('connecting...')

    const result = await firebase.auth().signInAnonymously()
    const user = result.user
    if (user !== null) {
      console.log(`join by uid: ${user.uid}`)
      commit('setUserUid', user.uid)
      commit('setUserName', args.userName)
      commit('setRoomId', args.roomId)
      commit('setGameMaster', args.isGameMaster)

      await roomRef
        .doc(args.roomId)
        .collection('uids')
        .doc(user.uid)
        .set({
          uid: user.uid,
          userName: args.userName,
          isGameMaster: args.isGameMaster,
          isInsider: false
        })
    }
  },
  async fetchRoom({ commit }: any, roomId: string) {
    roomRef
      .doc(roomId)
      .collection('uids')
      .onSnapshot((docSnapshot) => {
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
