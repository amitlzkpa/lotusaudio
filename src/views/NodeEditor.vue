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
      <div class="nodeeditorContainer" v-if="nodeEditorIsOn">
        <div style="width: 420px; height: 360px;" id="rete"></div>
      </div>
  </div>
</template>

<script>
import Three from "@/components/Three.vue";

import Rete from "rete";
import ConnectionPlugin from 'rete-connection-plugin';
import VueRenderPlugin from 'rete-vue-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import AreaPlugin from 'rete-area-plugin';
import CommentPlugin from 'rete-comment-plugin';
import HistoryPlugin from 'rete-history-plugin';
// import ConnectionMasteryPlugin from 'rete-connection-mastery-plugin';

import VueNumControl from '@/components/NodeComponent.vue'


var numSocket = new Rete.Socket('Number value');

class NumControl extends Rete.Control {

  constructor(emitter, key, readonly) {
    super(key);
    this.component = VueNumControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}

class NumComponent extends Rete.Component {

    constructor(){
        super("Number");
    }

    builder(node) {
        var out1 = new Rete.Output('num', "Number", numSocket);

        return node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
    }

    worker(node, inputs, outputs) {
        outputs['num'] = node.data.num;
    }
}

class AddComponent extends Rete.Component {
    constructor(){
        super("Add");
    }

    builder(node) {
        var inp1 = new Rete.Input('num',"Number", numSocket);
        var inp2 = new Rete.Input('num2', "Number2", numSocket);
        var out = new Rete.Output('num3', "Number", numSocket);

        inp1.addControl(new NumControl(this.editor, 'num'))
        inp2.addControl(new NumControl(this.editor, 'num2'))

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl(this.editor, 'preview', true))
            .addOutput(out);
    }

    worker(node, inputs, outputs) {
        var n1 = inputs['num'].length?inputs['num'][0]:node.data.num1;
        var n2 = inputs['num2'].length?inputs['num2'][0]:node.data.num2;
        var sum = n1 + n2;
        
        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(sum);
        outputs['num3'] = sum;
    }
}


let editor, engine;


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

    let container = document.querySelector('#rete');
    editor = new Rete.NodeEditor('demo@0.1.0', container);
    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin);
    editor.use(ContextMenuPlugin);
    editor.use(AreaPlugin);
    editor.use(CommentPlugin);
    editor.use(HistoryPlugin);
    // editor.use(ConnectionMasteryPlugin);

    engine = new Rete.Engine('demo@0.1.0');

    let components = [new NumComponent(), new AddComponent()];
    components.map(c => {
      editor.register(c);
      engine.register(c);
    });

    let n1 = await components[0].createNode({num: 2});
    let n2 = await components[0].createNode({num: 0});
    let add = await components[1].createNode();

    n1.position = [80, 200];
    n2.position = [80, 400];
    add.position = [500, 240];

    editor.addNode(n1);
    editor.addNode(n2);
    editor.addNode(add);

    editor.connect(n1.outputs.get('num'), add.inputs.get('num'));
    editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));

    editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
      await engine.abort();
      await engine.process(editor.toJSON());
    });
    
    this.canvasZoomExtents();
    editor.trigger('process');

    console.log(editor);

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
  background-color: rosybrown;
}

</style>