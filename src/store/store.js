import Vue from 'vue';
import Vuex from 'vuex';
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    subtitles:[],
    fileName:"选择字幕文件",
  },
  mutations:{
    saveSubts(state,subts){
      state.subtitles = subts
    },
    saveFileName(state,fileName){
      state.fileName = fileName
    }
  },
  plugins: [
    persistedState({ storage: window.sessionStorage })
  ]
})

export default store;
