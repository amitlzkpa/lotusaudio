<template>
  <div>
    <b-progress v-if="isLoading"></b-progress>
    <b-field>
      <b-input
        placeholder="Number"
        type="number"
        :readonly="readonly"
        :value="value"
        @input="change($event)"
        @dblclick.stop=""
        @pointerdown.stop=""
        @pointermove.stop=""
        min="1"
        max="10">
      </b-input>
    </b-field>
  </div>
</template>


<script>

export default {
  
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  data() {
    return {
      value: 0,
      isLoading: false
    }
  },
  methods: {
    change(e){
      this.value = +e;
      this.update();
    },
    update() {
      if (this.ikey)
        this.putData(this.ikey, this.value)
      this.emitter.trigger('process');
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
  }
}

</script>
