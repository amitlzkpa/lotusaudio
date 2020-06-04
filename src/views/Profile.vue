<template>
  <div>
    <Navbar />
    <h1>Profile</h1>
    <img :src="$auth.user.picture" />
    <p>
      Name: {{ $auth.user.name }}
    </p>
    <p>
      Email: {{ $auth.user.email }}
    </p>
  </div>
</template>

<script>
import Navbar from '@/partials/Navbar.vue';


export default {
  name: 'profile',
  components: {
    Navbar
  }
}
</script>

<style scoped>

</style>