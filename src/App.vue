<template>
  <div id="app">

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

    <router-view />

  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
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
</style>
