<template>
  <div id="wrapper">
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';

window.THREE = THREE;

let container, renderer, scene, camera;

export default {
  name: 'Three',
  data() {
    return {
    }
  },
  methods: {
    onCodeUpdate() {
      try {

        eval.apply(window, [this.$store.state.code]);
        let o = window.__init__();
        scene.add(o);

      } catch(ex) {
        console.log(ex);
      }
    },
    init: function() {
      container = document.getElementById('container');

      camera = new THREE.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
      camera.position.z = 10;

      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
      
      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }, false);

    },
    animate: function() {
      requestAnimationFrame(this.animate);
      renderer.render(scene, camera);
    }
  },
  mounted() {
    this.init();
    this.animate();
  }
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}

#wrapper {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
}
</style>