<template>
  <div>
    <h1>Vue Starter</h1>
    <img src="/imgs/img.png" id="img" />
    <br />
    <button @click="onDecr">Decrement</button>
    &nbsp;&nbsp;
    <span>{{ num }}</span>
    &nbsp;&nbsp;
    <button @click="onIncr">Incrment</button>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  name: 'vuestarter',
  data() {
    return {
      num: 0,
    }
  },
  methods: {
    async onIncr() {
      this.num++;
    },
    async onDecr() {
      this.num--;
    }
  }
}
</script>

<style scoped>

#img {
  width: 400px;
}

</style>
