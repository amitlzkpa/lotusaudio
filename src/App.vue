<template>
  <div id="app">

    <Split style="height: 100vh">
      
      <SplitArea :size="25">
        <nav class="level">
          
          <div class="level-left">
            <div class="level-item">
              <router-link to="/">Home</router-link>
            </div>
            <div class="level-item">
              <router-link to="/about">About</router-link>
            </div>
            <div class="level-item">
              <router-link v-if="$auth.isAuthenticated" to="/profile">Profile</router-link>
            </div>
          </div>

          <div class="level-right">
            <div class="level-item">
              <span v-if="!$auth.loading">
                <a v-if="!$auth.isAuthenticated" @click="login" href="#!">Log in</a>
                <a v-if="$auth.isAuthenticated" @click="logout" href="#!">Log out({{ $auth.user.name }})</a>
              </span>
            </div>
          </div>
          
        </nav>


        <div class="flex-container">

          <section style="height: 88vh;">
            <vue-codemirror-editor
              v-model="code"
              :option="{
                theme:'base16-dark',
                mode:'text/javascript',
              }"
            />
          </section>

          <section>

            <div class="level">

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

          </section>

        </div>

      </SplitArea>

      <SplitArea :size="75">
        <Three />
      </SplitArea>
      
    </Split>


  </div>
</template>

<script>
import Three from "@/components/Three.vue";

export default {
  name: 'App',
  components: {
    Three
  },
  data() {
    return {
      code: null
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
    async run() {
      console.log('runnnnnnnn');
      console.log(this.code);
    },
    async clear() {
      this.code = null;
    }
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
