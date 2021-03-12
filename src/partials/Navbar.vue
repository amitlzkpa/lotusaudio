<template>
  <div class="level is-marginless" style="margin-botom: 6px">
    
    <div class="level-left">
      <div class="level-item">
        <router-link to="/" class="clickable-icon">
          <b>Lotus Audio</b>
        </router-link>
      </div>
      <div class="level-item" v-if="$auth.isAuthenticated">
        <router-link to="/new">Create New</router-link>
      </div>
    </div>
    
    <div class="level-right">
      <div class="level-item">
        <span v-if="!$auth.loading">
          <a v-if="!$auth.isAuthenticated" @click="login" href="#!">Log in</a>
          <a v-if="$auth.isAuthenticated" href="#!">
            <router-link to="/profile">{{ $auth.dbUser.username }}</router-link>
            <br/>
            <a @click="logout" href="#!">Log out</a>
          </a>
        </span>
      </div>
    </div>

    <hr />
    
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
}
</script>

<style>
.flex-container {
  display:flex;
  flex-direction:column;
}

.cont-ht {
  height: 80vh;
}

.side-pad {
  padding: 0px 6px 0px 6px;
}

.clickable-icon {
  cursor: pointer;
  margin: 4px;
}
</style>