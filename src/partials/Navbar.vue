<template>
  <div>

    <div style="display: flex;">
    
      <div style="flex-grow: 1">
        <router-link to="/">
          <b>Lotus Audio</b>
        </router-link>

        <br/>

        <router-link to="/new">
          Create New
        </router-link>
      </div>
      
      <div v-if="!$auth.loading" style="text-align: right;">
        <a v-if="!$auth.isAuthenticated" @click="login" href="#!">Log in</a>

        <a v-if="$auth.isAuthenticated" href="#!">
          <a @click="logout" href="#!">Log out</a>
          <br/>
          <router-link to="/profile">{{ $auth.dbUser.username }}</router-link>
        </a>
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

<style scoped>
</style>