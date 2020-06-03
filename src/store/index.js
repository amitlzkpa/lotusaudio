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
      console.log(state.code);
    }
  },
  actions: {}
});

export default store;