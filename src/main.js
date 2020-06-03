import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import axios from 'axios';

import VueSplit from 'vue-split-panel';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(Buefy, { defaultIconPack: 'fas' });

Vue.use(VueSplit);

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