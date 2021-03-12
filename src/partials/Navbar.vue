<template>
  <div>
    
    <router-link to="/">
      <b>Lotus Audio</b>
    </router-link>

    <br/>

    <router-link to="/new">
      Create New
    </router-link>
    
    <span v-if="!$auth.loading">
      <a v-if="!$auth.isAuthenticated" @click="login" href="#!">Log in</a>

      <br/>

      <a v-if="$auth.isAuthenticated" href="#!">
        <router-link to="/profile">{{ $auth.dbUser.username }}</router-link>
        <br/>
        <a @click="logout" href="#!">Log out</a>
      </a>
    </span>

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

<style scoped>
</style>