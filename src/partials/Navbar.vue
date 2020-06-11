<template>
  <div class="level is-marginless">
    
    <div class="level-left">
      <div class="level-item">
        <router-link to="/" class="clickable-icon">
          <b-icon
            size="is-small"
            icon="spa"
          ></b-icon>
        </router-link>
      </div>
      <div class="level-item">
        <router-link to="/new">New</router-link>
      </div>
    </div>
    
    <div class="level-right">
      <div class="level-item">
        <span v-if="!$auth.loading">
          <a v-if="!$auth.isAuthenticated" @click="login" href="#!">Log in</a>
          <a v-if="$auth.isAuthenticated" href="#!">
            <b-dropdown position="is-bottom-left" aria-role="list">
              <button class="button is-text" slot="trigger">
                {{ $auth.dbUser.username }}
              </button>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/profile">Profile</router-link>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem" >
                <a @click="logout" href="#!">Log out</a>  
              </b-dropdown-item>
            </b-dropdown>
          </a>
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


.clickable-icon {
  cursor: pointer;
  margin: 4px;
}
</style>