import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    code: null
  },
  mutations: {
    updateCode (state, newCode) {
      state.code = newCode;
      console.log(state.code);
    }
  }
});

export default store;