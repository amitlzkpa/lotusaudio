<template>
  <div>
      <b-button
        @click="toggleEditor"
      >Toggle Editor</b-button>
      <b-button
        @click="canvasZoomExtents"
      >Zoom</b-button>
      <div class="threejsContainer">
        <Three ref="three" />
      </div>
      <div class="nodeeditorContainer" v-show="nodeEditorIsOn">
        <div style="width: 420px; height: 360px;" id="rete"></div>
      </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import Three from "@/components/Three.vue";

import Rete from "rete";
import ConnectionPlugin from 'rete-connection-plugin';
import VueRenderPlugin from 'rete-vue-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import AreaPlugin from 'rete-area-plugin';
import CommentPlugin from 'rete-comment-plugin';
import HistoryPlugin from 'rete-history-plugin';
import ConnectionMasteryPlugin from 'rete-connection-mastery-plugin';

import NodeNumControl from '@/components/NodeNumControl.vue'


var numSocket = new Rete.Socket('Number');
var anyTypeSocket = new Rete.Socket('Any type');
numSocket.combineWith(anyTypeSocket);


let editor, engine;
let three;


let wait = async function(ms) {
	return new Promise((resolve) => setTimeout(() => resolve(), ms));
}


class NumControl extends Rete.Control {

  constructor(emitter, key, readonly) {
    super(key);
    this.component = NodeNumControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}

class XComponent extends Rete.Component {

    generateWait = () => {
      let g = new THREE.Mesh(
        new THREE.SphereGeometry(2),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
      );
      g.position.set(0, 0, 40);
      return g;
    }

    generateGeom = async(inps) => {
      let g = new THREE.Mesh(
        new THREE.CubeGeometry(10, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
      );
      g.scale.set(inps.num, 1, 1);
      g.position.set(0, 0, 40);
      return g;
    }

    lastInps = '';

    constructor(){
      super("XComponent");
    }

    builder = async(node) => {
      var out1 = new Rete.Output('num', "Number", numSocket);
      three.updateObjectInScene(this.generateWait(), node.id);
      await wait(Math.round(Math.random() * 2000) + 200);
      let geom = await this.generateGeom(node.data);
      three.updateObjectInScene(geom, node.id);
      return node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
    }

    worker = async(node, inputs, outputs) => {
      if(this.lastInps === JSON.stringify(node.data)) return;
      outputs['num'] = node.data.num;
      three.updateObjectInScene(this.generateWait(), node.id);
      await wait(Math.round(Math.random() * 2000) + 200);
      let geom = await this.generateGeom(node.data);
      three.updateObjectInScene(geom, node.id);
      this.lastInps = JSON.stringify(node.data);
    }
}

class YComponent extends Rete.Component {

    generateWait = () => {
      let g = new THREE.Mesh(
        new THREE.SphereGeometry(2),
        new THREE.MeshStandardMaterial({ color: 0x0085fe })
      );
      g.position.set(40, 0, 0);
      return g;
    }


    generateGeom = async(inps) => {
      let g = new THREE.Mesh(
        new THREE.CubeGeometry(10, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0x0085fe })
      );
      g.scale.set(1, 1, inps.num);
      g.position.set(40, 0, 0);
      return g;
    }

    lastInps = '';

    constructor(){
      super("YComponent");
    }

    builder = async(node) => {
      var out1 = new Rete.Output('num', "Number", numSocket);
      three.updateObjectInScene(this.generateWait(), node.id);
      await wait(Math.round(Math.random() * 2000) + 200);
      let geom = await this.generateGeom(node.data);
      three.updateObjectInScene(geom, node.id);
      return node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
    }

    worker = async(node, inputs, outputs) => {
      if(this.lastInps === JSON.stringify(node.data)) return;
      outputs['num'] = node.data.num;
      three.updateObjectInScene(this.generateWait(), node.id);
      await wait(Math.round(Math.random() * 2000) + 200);
      let geom = await this.generateGeom(node.data);
      three.updateObjectInScene(geom, node.id);
      this.lastInps = JSON.stringify(node.data);
    }
}

class SquareComponent extends Rete.Component {

    generateWait = () => {
      let g = new THREE.Mesh(
        new THREE.SphereGeometry(2),
        new THREE.MeshStandardMaterial({ color: 0xdedede })
      );
      return g;
    }


    generateGeom = async(inps) => {
      let g = new THREE.Mesh(
        new THREE.CubeGeometry(10, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xdedede })
      );
      g.scale.set(inps.num, 1, inps.num2);
      return g;
    }
    
    lastInps = '{}';

    constructor(){
      super("Square");
    }

    builder = async(node) => {
      var inp1 = new Rete.Input('num',"Number", numSocket);
      var inp2 = new Rete.Input('num2', "Number2", numSocket);
      var out = new Rete.Output('num3', "Number", numSocket);

      three.updateObjectInScene(this.generateWait(), node.id);
      await wait(Math.round(Math.random() * 2000) + 200);
      let geom = await this.generateGeom(node.data);
      three.updateObjectInScene(geom, node.id);

      inp1.addControl(new NumControl(this.editor, 'num'));
      inp2.addControl(new NumControl(this.editor, 'num2'));

      return node
              .addInput(inp1)
              .addInput(inp2)
              .addControl(new NumControl(this.editor, 'preview', true))
              .addOutput(out);
    }

    worker = async(node, inputs, outputs) => {
      if(this.lastInps === JSON.stringify(inputs)) return;

      let lInp = JSON.parse(this.lastInps);

      var n1 = inputs['num'].length?(inputs['num'][0] || lInp.num[0]):node.data.num1;
      var n2 = inputs['num2'].length?(inputs['num2'][0] || lInp.num2[0]):node.data.num2;
      var sum = n1 + n2;

      let updInps = {
        num: n1,
        num2: n2
      };

      three.updateObjectInScene(this.generateWait(), node.id);
      await wait(Math.round(Math.random() * 2000) + 200);
      let geom = await this.generateGeom(updInps);
      three.updateObjectInScene(geom, node.id);
      
      this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(sum);
      outputs['num3'] = sum;

      this.lastInps = JSON.stringify(inputs);
    }
}

class PanelComponent extends Rete.Component {

  constructor(){
    super("Panel");
  }

  builder(node) {
    var inp = new Rete.Input('result',"Result", anyTypeSocket, true);

    return node.addInput(inp);
  }

}


export default {
  name: 'node-editor',
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
    },
    canvasZoomExtents() {
      editor.view.resize();
      AreaPlugin.zoomAt(editor);
    }
  },
  async mounted() {
    three = this.$refs.three;

    let container = document.querySelector('#rete');
    editor = new Rete.NodeEditor('demo@0.1.0', container);
    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin);
    editor.use(ContextMenuPlugin);
    editor.use(AreaPlugin);
    editor.use(CommentPlugin);
    editor.use(HistoryPlugin);
    editor.use(ConnectionMasteryPlugin);

    engine = new Rete.Engine('demo@0.1.0');

    let components = [new XComponent(), new YComponent(), new SquareComponent(), new PanelComponent()];
    components.map(c => {
      editor.register(c);
      engine.register(c);
    });

    let n1 = await components[0].createNode({num: 4});
    let n2 = await components[1].createNode({num: 3});
    let add1 = await components[2].createNode();
    let res = await components[3].createNode();

    n1.position = [80, 200];
    n2.position = [80, 400];
    add1.position = [600, 300];
    res.position = [1200, 400];

    editor.addNode(n1);
    editor.addNode(n2);
    editor.addNode(add1);
    editor.addNode(res);

    editor.connect(n1.outputs.get('num'), add1.inputs.get('num'));
    editor.connect(n2.outputs.get('num'), add1.inputs.get('num2'));
    editor.connect(add1.outputs.get('num3'), res.inputs.get('result'));

    editor.on('process', async () => {
      await engine.abort();
      await engine.process(editor.toJSON());
    });
    
    this.canvasZoomExtents();
    editor.trigger('process');

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
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.3);
}

</style>