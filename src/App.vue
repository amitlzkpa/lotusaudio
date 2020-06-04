<template>
  <div id="app">

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
                <button class="button is-text" slot="trigger" slot-scope="{ active }">
                  <b-icon
                    icon="prescription-bottle"
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

        <b-field>
          <p class="control" size="is-small">
            <span class="button is-static is-small">Name:</span>
          </p>
          <b-input
            expanded
            v-model="name"
            size="is-small"
          ></b-input>
          <p class="control" size="is-small" @click="visibility = (visibility === 'public') ? 'private' : 'public'">
            <span class="button is-static is-small">
              <b-icon
                :icon="(visibility === 'public') ? 'eye' : 'eye-slash'"
                size="is-small"
                class="clickable-icon"
              ></b-icon>
            </span>
          </p>
        </b-field>

          <div style="height: 88vh;">
            <vue-codemirror-editor
              @keydown.enter="handleEnter"
              v-model="code"
              :option="{
                theme:'base16-dark',
                mode:'text/javascript',
              }"
            />
          </div>

          <div>

            <div class="level is-marginless">

              <div class="level-left">
                <div class="level-item clickable-icon" @click="clear">
                  <b-icon
                    pack="fas"
                    icon="trash"
                    size="is-small"
                  ></b-icon>
                </div>
              </div>

              <div class="level-right">
                <div class="level-item clickable-icon" @click="run">
                  <b-icon
                    pack="fas"
                    icon="play"
                    size="is-small"
                  ></b-icon>
                </div>
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
import templateViz from "!raw-loader!@/assets/template_viz.js";

export default {
  name: 'App',
  components: {
    Three
  },
  data() {
    return {
      id: "abc",
      name: "<unnamed>",
      visibility: "public",
      short_description: "",
      description: "",
      code: templateViz
    }
  },
  methods: {
    login() {
      this.$auth.loginWithPopup();
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
          code: this.code
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
    }
  },
  async mounted() {
    this.run();
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
