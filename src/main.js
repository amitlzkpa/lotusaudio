import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import axios from 'axios';

import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

Vue.use(Buefy, { defaultIconPack: 'fas' });

Vue.prototype.$api = axios.create();

import { Auth0Plugin } from "./auth";

async function main() {

  let resp = await fetch('/api/auth0-secrets');
  let secrets = await resp.json();
  let domain = secrets.AUTH0_DOMAIN;
  let clientId = secrets.AUTH0_CLIENT_ID;

  Vue.use(Auth0Plugin, {
    domain,
    clientId
  });
  
  Vue.config.productionTip = false;
  
  new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
  });

}


main();