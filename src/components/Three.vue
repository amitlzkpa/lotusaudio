<template>
  <div id="wrapper">
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

window.THREE = THREE;

let container, renderer, scene, camera, controls;


let audioContext;
let analyser;
let audioIsLoaded = false;



let ARR_SIZE = 16;
let array = new Uint8Array(ARR_SIZE * ARR_SIZE);
let lowFreqArray = new Uint8Array(ARR_SIZE * ARR_SIZE);
let midFreqArray = new Uint8Array(ARR_SIZE * ARR_SIZE);
let higFreqArray = new Uint8Array(ARR_SIZE * ARR_SIZE);
let FREQOBJ = {};
FREQOBJ['allFreqArray'] = array;
FREQOBJ['lowFreqArray'] = lowFreqArray;
FREQOBJ['midFreqArray'] = midFreqArray;
FREQOBJ['higFreqArray'] = higFreqArray;
let firstBrk = 86;
let secondBrk = 170;
let lowIdx, midIdx, higIdx;


let vizObjInstance;
let sceneContent;


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
      analyser = audioContext.createAnalyser();
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
    onContainerResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    },
    async initViz() {
      if (this.$store.state.isPlaying) return;

      if(sceneContent) {
        scene.remove(sceneContent);
      }

      eval.apply(window, [this.$store.state.code]);

      let vizObjRefs = window.getRefs();
      for(let j = 0; j < vizObjRefs.length; j++) {
        let vizObjRefResource = await this.$api.get(vizObjRefs[j]);
        let vizObjRefText = vizObjRefResource.data;
        eval.apply(window, [vizObjRefText]);
      }

      let vizObjClass = window.getObj();
      vizObjInstance = new vizObjClass();
      sceneContent = await vizObjInstance.init();

      scene.add(sceneContent);
    },
    updateViz() {
      if (!this.$store.state.isPlaying) return;
      
      lowIdx = 0;
      midIdx = 0;
      higIdx = 0;
      analyser.getByteFrequencyData(array);
      for(let p=0; p<array.length; p++) {
        if (array[p] < firstBrk) { lowFreqArray[lowIdx] = array[p]; lowIdx++; }
        else if (array[p] > secondBrk) { higFreqArray[higIdx] = array[p]; higIdx++; }
        else { midFreqArray[midIdx] = array[p]; midIdx++; }
      }
      vizObjInstance.renderFrame(FREQOBJ);
    },
    init: function() {
      container = document.getElementById('container');

      camera = new THREE.PerspectiveCamera(60, container.clientWidth/container.clientHeight, 10, 100000);
      camera.position.set(30, 80, 60);
      camera.lookAt(new THREE.Vector3());

      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.xr.enabled = true;
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.update();
      
      window.addEventListener('resize', () => {
        this.onContainerResize();
      }, false);
      this.onContainerResize();

    },
    animate: function() {
      renderer.setAnimationLoop(() => {
        this.updateViz();
        controls.update();
        renderer.render(scene, camera);
      });
    }
  },
  mounted() {
    this.init();
    this.animate();
    document.body.appendChild( VRButton.createButton( renderer ) );
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