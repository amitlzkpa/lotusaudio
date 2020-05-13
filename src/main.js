import Vue from 'vue';
import Vuex from 'vuex';
import App from '@/App.vue';
import router from '@/router';

import { Auth0Plugin } from "./auth";


Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++;
    },
    decrement (state) {
      state.count--;
    }
  }
})


async function main() {

  let resp = await fetch('/api/auth0-secrets');
  let secrets = await resp.json();
  let domain = secrets.AUTH0_DOMAIN;
  let clientId = secrets.AUTH0_CLIENT_ID;

  Vue.use(Auth0Plugin, {
    domain,
    clientId,
    onRedirectCallback: appState => {
      router.push(
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      );
    }
  });
  
  Vue.config.productionTip = false;
  
  new Vue({
    el: '#app',
    store: store,
    router,
    render: h => h(App),
  });


}

main();