<template>
  <div id="app">
    <Navbar />
    <hr />
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/partials/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
</style>
