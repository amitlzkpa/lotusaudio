<template>
  <div>
      <b-button
        @click="toggleEditor"
      >Toggle Editor</b-button>
      <div class="threejsContainer">
        <Three ref="three" />
      </div>
      <div class="nodeeditorContainer" v-if="nodeEditorIsOn">
      </div>
  </div>
</template>

<script>
import Three from "@/components/Three.vue";

export default {
  name: 'profile',
  components: {
    Three
  },
  data() {
    return {
      nodeEditorIsOn: true
    }
  },
  methods: {
    toggleEditor() {
      this.nodeEditorIsOn = !this.nodeEditorIsOn;
    }
  },
  async mounted() {
  }
}
</script>

<style scoped>

.threejsContainer {
  position: fixed;
  top: 36px;
  right: 0;
  bottom: 0;
  left: 0;
}

.nodeeditorContainer {
  position: fixed;
  top: 56px;
  right: 20px;
  bottom: 20px;
  left: 20px;
  background-color: red;
  z-index: 10;
}

</style>