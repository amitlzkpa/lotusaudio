<template>
  <div>
    
    <div class="card" v-if="viz" style="min-height: 360px;">

      <div class="card-image">
        <figure class="image is-3by2">
          <img :src="img" style="object-fit: cover" />
        </figure>
      </div>

      <div class="card-content">
        
        <div class="media">
          <div class="media-content">
            
            <span>{{ viz.visibility }}</span>
              
            <span style="margin: 0px 6px 0px 6px;"></span>
            
            <span>{{ viz.paymentEnabled ? 'paid' : 'free' }}</span>

            <p class="title is-4">{{ viz.name }}</p>

            <p class="subtitle is-6 is-italic has-text-grey">{{ viz.author.username }}</p>

          </div>
        </div>

        <div class="content">
          <p class="has-text-weight-light">
            {{ viz.short_description }}
          </p>
        </div>
        
      </div>
      
    </div>

  </div>
</template>

<script>
import GeoPattern from 'geopattern';

export default {
  name: 'VizCard',
  props: ['visualization'],
  data() {
    return {
      viz: null,
      img: null
    }
  },
  methods: {
    updateImg() {
      let pattern = GeoPattern.generate(this.viz._id);
      this.img = pattern.toDataUri();
    }
  },
  async mounted() {

    if (this.visualization) {
      this.viz = this.visualization;
      this.updateImg();
      return;
    }

    while(this.$auth.loading) {
      await this.wait(100);
    }

  },
  watch: { 
    visualization: function(newVal) {
      this.viz = newVal
      this.updateImg();
    }
  }
  
}
</script>

<style scoped>

</style>