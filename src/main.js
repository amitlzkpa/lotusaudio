import Vue from 'vue';

import VueCodemirrorEditor from 'vue-codemirror-editor'
import CodeMirror from 'codemirror'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/addon/selection/active-line.js'

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import axios from 'axios';
Vue.prototype.$api = axios.create();
 
import 'codemirror/lib/codemirror.css';
import 'vue-codemirror-editor/dist/vue-codemirror-editor.css';
import 'codemirror/theme/base16-dark.css';

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

window.CodeMirror = CodeMirror;
Vue.component(VueCodemirrorEditor.name, VueCodemirrorEditor);

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