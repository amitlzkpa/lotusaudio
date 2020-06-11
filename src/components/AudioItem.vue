<template>
  <div>
    
    <b-collapse class="card" animation="slide" :open="false">
      <div
        slot="trigger" 
        slot-scope="props"
        class="card-header"
        role="button">
        <p class="card-header-title">
          {{ name }}
        </p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
        </a>
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
  props: ['name', 'format', 'source'],
  data() {
    return {
    }
  },
  async created() {
    
  }
}
</script>
