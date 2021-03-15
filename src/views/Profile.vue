<template>
  <div>
    <Navbar />

    <img :src="$auth.user.picture" />
    <br/>

    <span>{{ $auth.user.name }}</span>
    <br/>

    <span>{{ $auth.user.nickname }}</span>
    <br/>

    <hr/>
    <br/><br/>

    <VizGallery :visualizations="vizs" />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
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

    while(this.$auth.loading) {
      await this.wait(100);
    }

    let v = await this.$api.get(`/api/vizs/userid/${this.$auth.dbUser._id}`);
    this.vizs = v.data;

  }
}
</script>

<style scoped>

</style>