<template>
  <div>

    <Split style="height: 100vh">
      
      <SplitArea :size="35">

        <div class="level is-marginless">
          
          <div class="level-left">

            <div class="level-item">
              <div v-if="$auth.isAuthenticated">
                <b-button
                  type="is-primary"
                  size="is-small"
                  @click="save"
                >Save</b-button>
                <b-button
                  type="is-text"
                  size="is-small"
                  @click="saveNew"
                >Save New</b-button>
                <span
                  class="has-text-grey-light is-italic is-size-7"
                >{{ id }}
                </span>
              </div>

              <div v-else>
                <span>
                  <a v-if="!$auth.isAuthenticated" @click="login" href="#!">Login</a> &nbsp;&nbsp; to save
                </span>
              </div>
            </div>
            
          </div>

          <div class="level-right">
            <div class="level-item">

              <b-dropdown position="is-bottom-left" aria-role="list">
                <button class="button is-text" slot="trigger">
                  <b-icon
                    icon="ellipsis-h"
                    size="is-small"
                  ></b-icon>
                </button>

                <b-dropdown-item aria-role="listitem">
                  <router-link to="/home">Home</router-link>
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem" v-if="$auth.isAuthenticated">
                  <router-link to="/profile">Profile({{ $auth.user.name }})</router-link>
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem" v-if="$auth.isAuthenticated" >
                  <a @click="logout" href="#!">Log out</a>  
                </b-dropdown-item>
              </b-dropdown>

            </div>
          </div>
          
        </div>


        <div class="flex-container">

          <div style="padding: 0px 6px 0px 6px;">

            <b-field>

              <p class="control" size="is-small">
                <span class="button is-static is-small">Name:</span>
              </p>
              
              <b-input
                expanded
                placeholder="<unnamed>"
                v-model="name"
                size="is-small"
              ></b-input>

            </b-field>
            
          </div>


          <div class="is-marginless is-paddingless">
            <span
               @click="activeTab = 'Code'"
               class="is-size-7 clickable-icon">
              <span v-if="activeTab === 'Code'" class="has-text-weight-bold">Code</span>
              <span v-else>Code</span>
            </span>

            &nbsp;&nbsp;
            <span class="is-size-7">|</span>
            &nbsp;&nbsp;

            <span
               @click="activeTab = 'Details'"
               class="is-size-7 clickable-icon">
              <span v-if="activeTab === 'Details'" class="has-text-weight-bold">Details</span>
              <span v-else>Details</span>
            </span>
          </div>

          <div v-if="activeTab === 'Code'">
            <div style="height: 85vh;">
              <vue-codemirror-editor
                @keydown.enter="handleEnter"
                v-model="code"
                :option="{
                  theme:'base16-dark',
                  mode:'text/javascript',
                }"
              />
            </div>
          </div>

          <div v-if="activeTab === 'Details'" style="padding: 0px 6px 0px 6px;">
            <div style="height: 85vh;">

              <b-field label="Payment Pointer">
                <b-input
                  :disabled="!paymentEnabled"
                  type="text"
                  v-model="paymentPointer"
                ></b-input>
              </b-field>

              <b-field label="Short Description">
                <b-input
                  type="textarea"
                  v-model="short_description"
                  minlength="0"
                  maxlength="100"
                ></b-input>
              </b-field>
              
              <b-field label="Description">
                <b-input
                  type="textarea"
                  v-model="description"
                  minlength="0"
                  maxlength="800"
                ></b-input>
              </b-field>
            </div>
          </div>


          <div>

            <div class="level is-marginless">

              <div class="level-left">

                <b-tooltip :label="'Make ' + (paymentEnabled ? 'free' : 'paid')" position="is-right">
                  <div @click="paymentEnabled = !paymentEnabled" class="clickable-icon">
                    <b-icon
                      :icon="(paymentEnabled) ? 'coins' : 'star-of-life'"
                      size="is-small"
                    ></b-icon>
                  </div>
                </b-tooltip>

                <div style="margin: 0px 6px 0px 0px"></div>
                
                <b-tooltip :label="'Make ' + (visibility === 'public' ? 'private' : 'public')" position="is-right">
                  <div @click="visibility = (visibility === 'public') ? 'private' : 'public'" class="clickable-icon">
                    <b-icon
                      :icon="(visibility === 'public') ? 'eye' : 'eye-slash'"
                      size="is-small"
                    ></b-icon>
                  </div>
                </b-tooltip>

              </div>

              <div class="level-right">

                <b-tooltip label="Run visualization" position="is-left">
                  <div class="level-item clickable-icon" @click="run">
                    <b-icon
                      pack="fas"
                      icon="play"
                      size="is-small"
                    ></b-icon>
                  </div>
                </b-tooltip>
                
              </div>
              
            </div>

          </div>

        </div>

      </SplitArea>

      <SplitArea :size="65">
        <Three ref="three" />
      </SplitArea>
      
    </Split>


  </div>
</template>

<script>
import Three from "@/components/Three.vue";
import templateViz from "!raw-loader!@/assets/template_viz.js.txt";

export default {
  name: 'VizEdit',
  components: {
    Three
  },
  data() {
    return {
      id: "",
      name: "",
      visibility: "public",
      short_description: "",
      description: "",
      code: templateViz,
      paymentPointer: "",
      paymentEnabled: false,
      activeTab: 'Code'
    }
  },
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    },
    async save() {
      let postData = {
          id: this.id,
          name: this.name,
          visibility: this.visibility,
          short_description: this.short_description,
          description: this.description,
          code: JSON.stringify(this.code),
          paymentPointer: this.paymentPointer,
          paymentEnabled: this.paymentEnabled
      };
      let v = await this.$api.post("/api/vizs/save", postData);
      console.log(v);
    },
    async saveNew() {
      let postData = {
          id: this.id,
          name: this.name,
          visibility: this.visibility,
          short_description: this.short_description,
          description: this.description,
          code: this.code
      };
      let v = await this.$api.post("/api/vizs/new", postData);
      console.log(v);
    },
    async run() {
      this.$store.commit('updateCode', this.code);
      this.$refs.three.onCodeUpdate();
    },
    async clear() {
      this.code = null;
      await this.run();
    },
    async handleEnter(e) {
      if (!e.ctrlKey) return;
      await this.run();
    },
    async updateFromParam() {
      if(this.$route.params.id) {
        let resp = await this.$api.get(`/api/vizs/id/${this.$route.params.id}`);
        let viz = resp.data;
        this.id = viz._id;
        this.name = viz.name;
        this.visibility = viz.visibility;
        this.short_description = viz.short_description;
        this.description = viz.description;
        this.code = JSON.parse(viz.code);
        this.paymentPointer = viz.paymentPointer;
        this.paymentEnabled = viz.paymentEnabled;
        this.$store.commit('updateCode', this.code);
      }
      this.run();
    }
  },
  async mounted() {

    while(this.$auth.loading) {
      await this.wait(100);
    }

    await this.updateFromParam();

  }
}
</script>

<style scoped>
.flex-container {
  display:flex;
  flex-direction:column;
}

.clickable-icon {
  cursor: pointer;
  margin: 4px;
}
</style>
