import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/api'

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    userInfo: {}
  },
  getters: {
    getUserInfo (state) {
      return state.userInfo
    }
  },
  actions: {
    /* eslint-disable */
    refreshUserInfo ({commit, state}) {
      api.get('/api/personal/profile').then(function (res) {
        let data = res.data
        if (data.res === 'S') {
          commit('setUserInfo', data.item)
        } else {
          throw data.msg
        }
      }).catch(function (err) {
        Vue.$message({
          message: '用户信息加载失败.',
          type: 'error'
        })
      })
    }
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  }
})

export default store
