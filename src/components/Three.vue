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


let audioContext;
let audioIsLoaded = false;


export default {
  name: 'Three',
  data() {
    return {
    }
  },
  methods: {
    async onAudioSourceUpdate() {
      if (audioIsLoaded) {
        audioContext.close();
      }
      audioContext = new AudioContext();
      let src = this.$store.state.audioSource.source;
      let resp = await this.$api.get(src, { responseType: 'arraybuffer' });
      let audio = resp.data;
      let buffer = await audioContext.decodeAudioData(audio);
      let audioBufferSouceNode = audioContext.createBufferSource();
      let analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.connect(audioContext.destination);
      audioBufferSouceNode.connect(analyser);
      audioBufferSouceNode.buffer = buffer;
      audioBufferSouceNode.start(0);
      if(this.$store.state.isPlaying) {
        audioContext.resume();
      } else {
        audioContext.suspend();
      }
      audioIsLoaded = true;
    },
    async onPlayClicked() {
      if (!audioIsLoaded) return;
      if(this.$store.state.isPlaying) {
        audioContext.suspend();
        this.$store.commit('updatePlayStatus', false);
      } else {
        audioContext.resume();
        this.$store.commit('updatePlayStatus', true);
      }
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