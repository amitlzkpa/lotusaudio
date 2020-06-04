<template>
  <div class="level is-marginless">
    
    <div class="level-left">
      <div class="level-item">
        <router-link to="/">Home</router-link>
      </div>
      <div class="level-item">
        <router-link to="/edit">Edit</router-link>
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

</style>