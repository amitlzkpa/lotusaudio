<template>
  <div id="wrapper">
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

window.THREE = THREE;

let container, renderer, scene, camera, controls;
let vizObj;


let audioContext = new AudioContext();
let audioBufferSouceNode = audioContext.createBufferSource();
let analyser = audioContext.createAnalyser();
audioBufferSouceNode.connect(analyser);
// each bin represents sampleRate/fftSize = 48000 / 512 = 93.75 Hz
analyser.fftSize = 512;
analyser.connect(audioContext.destination);

export default {
  name: 'Three',
  data() {
    return {
    }
  },
  methods: {
    async onPlayClicked() {
      console.log(this.$store.state.audioSource);
      if (this.$store.state.isPlaying) {
        audioBufferSouceNode.stop(0);
      } else {
        let resp = await this.$api.get(this.$store.state.audioSource.source, {
          responseType: 'arraybuffer'
        });
        let audio = resp.data;
        let buffer = await audioContext.decodeAudioData(audio);
        audioBufferSouceNode.buffer = buffer;
        audioBufferSouceNode.start(0);
      }
      this.$store.commit('updatePlayStatus', !this.$store.state.isPlaying);
    },
    onCodeUpdate() {
      try {

        if(vizObj) {
          scene.remove(vizObj);
          vizObj = null;
        }

        eval.apply(window, [this.$store.state.code]);
        vizObj = window.__init__();
        scene.add(vizObj);

      } catch(ex) {
        console.log(ex);
      }
    },
    init: function() {
      container = document.getElementById('container');

      camera = new THREE.PerspectiveCamera(60, container.clientWidth/container.clientHeight, 1, 1000);
      camera.position.z = 100;
      camera.lookAt(new THREE.Vector3());

      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.update();
      
      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }, false);

    },
    animate: function() {
      requestAnimationFrame(this.animate);
      controls.update();
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