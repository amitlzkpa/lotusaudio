<template>
  <div>
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
export default {

}
</script>

<style scoped>

</style>