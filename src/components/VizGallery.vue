<template>
  <div>
    <div class="columns">

      <div class="tile is-ancestor">
        <div class="tile is-4 is-child" v-for="viz in vizs" :key="viz._id">
            
          <div class="card" exapnded>
            <div class="card-content">
              <p class="has-text-weight-light is-size-7 is-italic">
                {{ viz.author.username }}
              </p>
              <p class="has-text-weight-semibold is-size-4">
                {{ viz.name }}
              </p>
            </div>
          </div>
            
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: ['visualizations'],
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
  }
}
</script>