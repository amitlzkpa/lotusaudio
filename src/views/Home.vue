<template>
  <div>
    <Navbar />
    <div class="container">
      <br/>
      <br/>
      <Banner />
      <br/>
      <hr/>
      <br/>
      <br/>
      <VizGallery />
    </div>
  </div>
</template>

<script>
import Navbar from '@/partials/Navbar.vue';
import Banner from '@/components/Banner.vue';
import VizGallery from '@/components/VizGallery.vue';

export default {
  name: 'home',
  components: {
    Navbar,
    Banner,
    VizGallery
  }
}
</script>

<style scoped>

</style>