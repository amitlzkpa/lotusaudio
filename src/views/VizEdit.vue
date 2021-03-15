<template>
  <div>

    <Split style="position: absolute; left: 0; right 0: top: 0; bottom: 0;" @onDrag="paneWidthUpdate">
      
      <SplitArea style="padding: 6px;" :size="paneWidth">

        <Navbar />
        
        <div v-if="id !== ''" style="height: 91vh; display: flex; flex-direction: column;">

          <div style="flex: 0 0 auto;">

            <router-link :to="{ name: 'view', params: { id: id } }">
              <span>{{ id }}</span>
            </router-link>

            <div v-if="!$auth.isLoading && !$auth.isAuthenticated">
              <span>
                Please login to save.
              </span>
            </div>
            <div v-else>
              <div v-if="!$auth.isLoading && !author || $auth.dbUser._id === author._id">
                <button
                  v-if="id !== ''"
                  @click="deleteDialog"
                >Delete</button>
                <button
                  @click="saveNew"
                >Save as new</button>
                <button
                  v-if="id !== ''"
                  @click="save"
                >Save</button>
              </div>

              <div>
                <span @click="paymentEnabled = !paymentEnabled">
                  <i :class="`fas fa-${paymentEnabled ? 'coins' : 'star-of-life'}`"></i>
                  <span>Make {{ paymentEnabled ? 'free' : 'paid' }}</span>
                </span>
                
                <span @click="visibility = !visibility">
                  <i :class="`fas fa-${visibility === 'public' ? 'eye' : 'eye-slash'}`"></i>
                  <span>Make {{ visibility === 'private' ? 'public' : 'private' }}</span>
                </span>
              </div>

              <span>Name:</span>
              <input
                type="text"
                placeholder="<unnamed>"
                v-model="name"
              />

            </div>

          </div>

          <div style="flex: 1 0 auto;">

            <div>
              <span
                @click="activeTab = 'Code'"
                style="cursor: pointer;"
              >
                <b v-if="activeTab === 'Code'">Code</b>
                <span v-else>Code</span>
              </span>

              &nbsp;&nbsp;|&nbsp;&nbsp;

              <span
                @click="activeTab = 'Details'"
                style="cursor: pointer;"
              >
                <b v-if="activeTab === 'Details'">Details</b>
                <span v-else>Details</span>
              </span>

              &nbsp;&nbsp;|&nbsp;&nbsp;

              <span
                @click="activeTab = 'Audio'"
                style="cursor: pointer;"
              >
                <b v-if="activeTab === 'Audio'">Audio</b>
                <span v-else>Audio</span>
              </span>
            </div>
            
            <div style="height: 75vh; overflow-y: auto; overflow-x: hidden;">
              <div v-if="activeTab === 'Code'">
                <vue-codemirror-editor
                  @keydown.enter="handleEnter"
                  @keydown.s="handleS"
                  v-model="code"
                  :option="{
                    theme:'base16-dark',
                    mode:'text/javascript',
                  }"
                />
              </div>

              <div v-if="activeTab === 'Details'">
                <span>Payment Pointer:</span>
                <input
                  :disabled="!paymentEnabled"
                  type="text"
                  v-model="paymentPointer"
                />
                <br/>

                <span>Short Description:</span>
                <br/>
                <textarea
                  v-model="short_description"
                  minlength="0"
                  maxlength="300"
                  style="width:100%"
                  resize
                  rows="3"
                />
                <br/>

                <span>Description:</span>
                <br/>
                <textarea
                  v-model="description"
                  minlength="0"
                  maxlength="800"
                  style="width:100%"
                  resize
                  rows="8"
                />
                <br/>
              </div>

              <div v-if="activeTab === 'Audio'">

                <details open>
                  <summary>Available sources</summary>
                  <i v-if="vizAudioSources.length < 1">
                    &lt;none&gt;
                  </i>
                  
                  <div v-if="vizAudioSources.length > 0">
                    <AudioItem
                      v-for="audioItem in vizAudioSources" :key="audioItem.name"
                      :source="audioItem.source"
                      :name="audioItem.name"
                      :format="audioItem.format"
                      :deleteDisabled="true"
                      @activeAudioClick="setActiveAudio"
                    />
                  </div>
                </details>

                <details>
                  <summary>Default sources</summary>
                  <i v-if="defaultSources.length < 1">
                    &lt;none&gt;
                  </i>
                  
                  <AudioItem
                    v-else
                    v-for="audioItem in defaultSources" :key="audioItem.name"
                    :source="audioItem.source"
                    :name="audioItem.name"
                    :format="audioItem.format"
                    :deleteDisabled="true"
                    @activeAudioClick="setActiveAudio"
                  />
                </details>

                <details>
                  <summary>Add sources</summary>
                  <div>
                    <span>Name</span>
                    <input
                      type="text"
                      v-model="newAudioSource.name"
                      placeholder=""
                    />
                    <br/>

                    <span>Source</span>
                    <input
                      type="text"
                      v-model="newAudioSource.source"
                      placeholder=""
                    />
                    <br/>

                    <button @click="addNewAudioSource">Add new source</button>
                  </div>
                </details>

              </div>
            </div>

          </div>

          <div style="flex: 0 0 auto; text-align: center">

            <div>
              {{ $store.state.audioSource.name }}
              <span alt="Play audio and run visualization" @click="run">
                <i :class="`fas fa-${$store.state.isPlaying ? 'pause' : 'play'}`"></i>
              </span>
            </div>

          </div>

        </div>

      </SplitArea>

      <SplitArea :size="100-paneWidth">
        <Three ref="three" />
      </SplitArea>
      
    </Split>


  </div>
</template>

<script>
import Navbar from '@/partials/Navbar.vue';
import AudioItem from "@/components/AudioItem.vue";
import Three from "@/components/Three.vue";
// import templateViz from "!raw-loader!@/assets/template_viz.js";
import newViz from "!raw-loader!@/assets/new_viz.js";

export default {
  name: 'VizEdit',
  components: {
    Navbar,
    AudioItem,
    Three
  },
  data() {
    return {
      id: "",
      name: "",
      author: null,
      visibility: "public",
      short_description: "",
      description: "",
      code: newViz,
      paymentPointer: "",
      paymentEnabled: false,
      paneWidth: 40,
      vizAudioSources: [],
      activeTab: 'Code',
      newAudioSource: {
        name: "",
        source: "",
        format: "audio/mpeg"
      },
      defaultSources: [
        {
          name: "Tours01 - Enthusiast",
          source: "/audio_samples/Tours01-Enthusiast.mp3",
          format: "audio/mpeg"
        },
        {
          name: "Lotus 03",
          source: "/audio_samples/lotus_03.mp3",
          format: "audio/mpeg"
        },
        {
          name: "Sine 30",
          source: "/audio_samples/sine_30.wav",
          format: "audio/mpeg"
        },
        {
          name: "Sine 400",
          source: "/audio_samples/sine_400.wav",
          format: "audio/mpeg"
        },
        {
          name: "Sine Chirp 20-600",
          source: "/audio_samples/sine-chirp_20-600.wav",
          format: "audio/mpeg"
        },
        {
          name: "Sine Sweep 20-20000",
          source: "/audio_samples/sine-sweep_20-20000.wav",
          format: "audio/mpeg"
        }
      ]
    }
  },
  computed: {
    isPayable() {
      return this.paymentPointer !== "" && this.paymentEnabled;
    }
  },
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    },
    async save() {
      let postData = {
          id: this.id,
          name: this.name,
          visibility: this.visibility,
          short_description: this.short_description,
          description: this.description,
          code: JSON.stringify(this.code),
          paymentPointer: this.paymentPointer,
          paymentEnabled: this.paymentEnabled,
          audioSources: this.vizAudioSources
      };
      let v = await this.$api.post("/api/vizs/save", postData);
      let viz = v.data;
      await this.updateVizInView(viz);
      console.log('Saved successfully');
    },
    async saveNew() {
      let postData = {
          id: this.id,
          name: this.name,
          visibility: this.visibility,
          short_description: this.short_description,
          description: this.description,
          code: JSON.stringify(this.code),
          audioSources: this.vizAudioSources
      };
      let v = await this.$api.post("/api/vizs/new", postData);
      let viz = v.data;
      await this.updateVizInView(viz);
      this.$buefy.toast.open('New save successful');
      this.$router.replace(`/edit/${viz._id}`);
    },
    async deleteDialog() {
      this.$buefy.dialog.confirm({
        title: 'Delete',
        message: `Are you sure you want to delete?`,
        cancelText: 'No',
        confirmText: 'Yes',
        type: 'is-danger',
        onConfirm: async () => {
          await this.$api.delete(`/api/vizs/id/${this.id}`);
          this.$router.replace('/');
        }
      })
    },
    async run() {
      this.$store.commit('updateCode', this.code);
      await this.$refs.three.initViz();
      await this.$refs.three.onPlayClicked();
    },
    async clear() {
      this.code = null;
      this.$store.commit('updateCode', this.code);
    },
    async handleEnter(e) {
      if (e.ctrlKey) await this.run();
    },
    async handleS(e) {
      if (e.ctrlKey) {
        e.preventDefault();
        await this.save();
      }
    },
    async updateFromParam() {
      if (this.$route.params.id === 'new_viz.js') {
        this.$store.commit('updateCode', this.code);
        let audioSourceToLoad = (this.vizAudioSources.length > 0) ? this.vizAudioSources[0] : this.defaultSources[3];
        this.$store.commit('updateAudioSource', audioSourceToLoad);
        await this.$refs.three.onAudioSourceUpdate();
        await this.$refs.three.initViz();
        return;
      }
      if (this.$route.params.id) {
        let resp = await this.$api.get(`/api/vizs/id/${this.$route.params.id}`);
        let viz = resp.data;
        await this.updateVizInView(viz);
      }
    },
    async updateVizInView(viz) {
      this.id = viz._id;
      this.name = viz.name;
      this.author = viz.author;
      this.visibility = viz.visibility;
      this.short_description = viz.short_description;
      this.description = viz.description;
      this.code = JSON.parse(viz.code);
      this.paymentPointer = viz.paymentPointer;
      this.paymentEnabled = viz.paymentEnabled;
      this.vizAudioSources = viz.audioSources;
      this.$store.commit('updateCode', this.code);
      let audioSourceToLoad = (this.vizAudioSources.length > 0) ? this.vizAudioSources[0] : this.defaultSources[0];
      this.$store.commit('updateAudioSource', audioSourceToLoad);
      await this.$refs.three.onAudioSourceUpdate();
      // get scene config from code
      // update scene
      await this.$refs.three.initViz();
    },
    addNewAudioSource() {
      if (this.newAudioSource.name === ""
       || this.newAudioSource.source === "") return;
      let i = this.vizAudioSources.filter(a => a.name === this.newAudioSource.name);
      if (i > 0) return;
      i = this.defaultSources.filter(a => a.name === this.newAudioSource.name);
      if (i > 0) return;
      let a = JSON.parse(JSON.stringify(this.newAudioSource));
      this.vizAudioSources.push(a);
      this.newAudioSource.name = "";
      this.newAudioSource.source = "";
    },
    async setActiveAudio(audioSource) {
      this.$store.commit('updateAudioSource', audioSource);
      await this.$refs.three.onAudioSourceUpdate();
    },
    removeAudioSource(audioParams) {
      if (this.$store.state.audioSource.name === audioParams.name) {
        this.$buefy.toast.open({
          duration: 3000,
          message: `Can't remove a source while its playing.`,
          position: 'is-bottom',
          type: 'is-danger'
        })
        return;
      }
      this.vizAudioSources = this.vizAudioSources.filter(s => s.name !== audioParams.name);
    },
    paneWidthUpdate(size) {
      this.paneWidth = size[0];
      this.$refs.three.onContainerResize();
    },
    togglePaneWidth() {
      this.paneWidth = (this.paneWidth < 10) ? 60 : 1;
      setTimeout(() => { this.$refs.three.onContainerResize(); }, 0);
    }
  },
  async mounted() {

    while(this.$auth.loading) {
      await this.wait(100);
    }

    setTimeout(() => { this.$refs.three.onContainerResize(); }, 0);
    await this.updateFromParam();
  },
  async beforeDestroy() {
    if (this.$store.state.isPlaying) {
      await this.$refs.three.onPlayClicked();
    }

    await this.clear();
  }
}
</script>

<style scoped>

</style>
