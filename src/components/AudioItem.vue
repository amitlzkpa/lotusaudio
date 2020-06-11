<template>
  <div>
    
    <b-collapse class="card" animation="slide" :open.sync="isOpen">
      <div slot="trigger" class="card-header" role="button">

        <div class="has-text-weight-bold" style="padding: 6px;">
          
          <span @click="removeAudio" v-if="!deleteDisabled">
            <b-icon
              pack="fas"
              icon="times"
              size="is-small"
            ></b-icon>
          </span>
          
          <span @click="setActiveAudio">
            <b-icon
              pack="fas"
              icon="plus"
              size="is-small"
            ></b-icon>
          </span>
          
          <span @click="isOpen = !isOpen">
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
    </b-collapse>

  </div>
</template>

<script>
export default {
  props: ['name', 'format', 'source', 'deleteDisabled'],
  data() {
    return {
      isOpen: false,
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
