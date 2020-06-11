<template>
  <div>
    <Navbar />
    <div class="container">

      <br/>
      <br/>

      <div class="columns">

        <div class="column is-one-fifth">
          <img :src="$auth.user.picture" />
        </div>

        <div class="column">
          <p class="is-size-4 has-text-weight-semibold">
            {{ $auth.user.name }}
          </p>
          <p class="is-size-6 has-text-weight-light is-italic">
            {{ $auth.user.nickname }}
          </p>
          <p class="is-size-5">
            {{ $auth.dbUser.bio }}
          </p>
        </div>

      </div>
      
      <hr/>

      <VizGallery :visualizations="vizs" />
      
    </div>
  </div>
</template>

<script>
import Navbar from '@/partials/Navbar.vue';
import VizGallery from '@/components/VizGallery.vue';


export default {
  name: 'profile',
  components: {
    Navbar,
    VizGallery
  },
  data() {
    return {
      vizs: []
    }
  },
  async mounted() {

    console.log(this.vizs);
    
    while(this.$auth.loading) {
      await this.wait(100);
    }

    let v = await this.$api.get(`/api/vizs/userid/${this.$auth.dbUser._id}`);
    this.vizs = v.data;

    console.log(this.vizs);
  }
}
</script>

<style scoped>

</style>