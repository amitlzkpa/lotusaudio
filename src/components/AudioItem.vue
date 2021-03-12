<template>
  <div>
    
    <div slot="trigger" class="card-header" role="button">

      <div class="has-text-weight-bold" style="padding: 6px;">
        
        <span @click="removeAudio" v-if="!deleteDisabled">
          <i class="fas fa-times"></i>
        </span>
        
        <span @click="setActiveAudio">
          <i class="fas fa-plus"></i>
        </span>
        
        <span>
          {{ name }}
        </span>

      </div>

    </div>


    <div class="card-content">
      <div class="content">

        <audio controls style="width:100%">
          <source :src="source" :type="format">
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: ['name', 'format', 'source', 'deleteDisabled'],
  data() {
    return {
    }
  },
  methods: {
    removeAudio() {
      if (this.deleteDisabled) return;
      this.$emit('removeAudioSourceClick', {name: this.name, source: this.source});
    },
    setActiveAudio() {
      this.$emit('activeAudioClick', {name: this.name, source: this.source});
    }
  },
  async created() {
    
  }
}
</script>

<style scoped>

</style>