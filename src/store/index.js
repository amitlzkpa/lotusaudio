import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    code: null,
    audioSource: {},
  },
  getters: {},
  mutations: {
    updateCode(state, newCode) {
      state.code = newCode;
    },
    updateAudioSource(state, newAudioSource) {
      state.audioSource = newAudioSource;
    }
  },
  actions: {}
});

export default store;