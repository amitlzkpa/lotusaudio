<template>
  <div>
    <b-button
      @click="onClick"
    >Click</b-button>
  </div>
</template>

<script>

export default {
  name: 'profile',
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
    async onClick() {
      console.log('foo');
    }
  },
  async mounted() {

  }
}
</script>

<style scoped>

</style>