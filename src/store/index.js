import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    code: null
  },
  getters: {},
  mutations: {
    updateCode (state, newCode) {
      state.code = newCode;
    }
  },
  actions: {}
});

export default store;