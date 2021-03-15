import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    code: null,
    audioSource: {},
    isPlaying: false
  },
  getters: {},
  mutations: {
    updateCode(state, newCode) {
      state.code = newCode;
    },
    updateAudioSource(state, newAudioSource) {
      // let newAudioSource = {
      //   name: "Text name",
      //   source: "URL for audio file source",
      //   format: "Format for audio file source",
      //   stream: "MediaStream source" // use either stream/source 
      // }
      state.audioSource = newAudioSource;
    },
    updatePlayStatus(state, newStatus) {
      state.isPlaying = newStatus;
    }
  },
  actions: {}
});

export default store;