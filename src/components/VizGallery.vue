<template>
  <div>

    <div class="tile is-ancestor">
      <div class="tile is-4 is-child" style="padding: 6px;" v-for="viz in vizs" :key="viz._id">
        
        <router-link :to="{ name: 'view', params: { id: viz._id } }">
          <VizCard :visualization="viz" />
        </router-link>
        
      </div>
    </div>

  </div>
</template>

<script>
import VizCard from '@/components/VizCard.vue';

export default {
  name: 'VizGallery',
  props: ['visualizations'],
  components: {
    VizCard
  },
  data() {
    return {
      vizs: []
    }
  },
  async mounted() {

    if (this.visualizations) {
      this.vizs = this.visualizations;
      return;
    }

    while(this.$auth.loading) {
      await this.wait(100);
    }

    let v = await this.$api.get("/api/vizs/all");
    this.vizs = v.data;
  },
  watch: { 
    visualizations: function(newVal) {
      this.vizs = newVal
    }
  }
}
</script>