<template>
  <div>

    <Split style="height: 100vh">
      
      <SplitArea :size="35">

        <Navbar />

        <div class="flex-container">

          <div class="side-pad">

            <div class="level" style="margin: 2px 0px 2px 0px;">
              
              <div class="level-left">

                <div class="level-item">
                  <router-link :to="{ name: 'view', params: { id: id } }">
                    <span
                      class="has-text-grey-light is-italic is-size-7"
                    >{{ id }}
                    </span>
                  </router-link>
                </div>
                
              </div>

              <div class="level-right">
                <div class="level-item">
                  <div v-if="!$auth.isLoading && !$auth.isAuthenticated">
                    <p class="is-size-7 is-italic has-text-grey-light">
                      Please login to save.
                    </p>
                  </div>
                  <div v-else>
                    <div v-if="!$auth.isLoading && !author || $auth.dbUser._id === author._id">
                      <b-button
                        type="is-text"
                        size="is-small"
                        @click="deleteDialog"
                      >Delete</b-button>
                      <b-button
                        type="is-text"
                        size="is-small"
                        @click="saveNew"
                      >Save as new</b-button>
                      <b-button
                        v-if="id !== ''"
                        type="is-primary"
                        size="is-small"
                        @click="save"
                      >Save</b-button>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>

            <b-field>

              <p class="control" size="is-small">
                <span class="button is-static is-small">Name:</span>
              </p>
              
              <b-input
                expanded
                placeholder="<unnamed>"
                v-model="name"
                size="is-small"
              ></b-input>

            </b-field>
            
          </div>

          <div class="is-marginless is-paddingless side-pad">
            <span
               @click="activeTab = 'Code'"
               class="is-size-7 clickable-icon">
              <span v-if="activeTab === 'Code'" class="has-text-weight-bold">Code</span>
              <span v-else>Code</span>
            </span>

            &nbsp;&nbsp;
            <span class="is-size-7">|</span>
            &nbsp;&nbsp;

            <span
               @click="activeTab = 'Details'"
               class="is-size-7 clickable-icon">
              <span v-if="activeTab === 'Details'" class="has-text-weight-bold">Details</span>
              <span v-else>Details</span>
            </span>

            &nbsp;&nbsp;
            <span class="is-size-7">|</span>
            &nbsp;&nbsp;

            <span
               @click="activeTab = 'Audio'"
               class="is-size-7 clickable-icon">
              <span v-if="activeTab === 'Audio'" class="has-text-weight-bold">Audio</span>
              <span v-else>Audio</span>
            </span>
          </div>

          <div v-if="activeTab === 'Code'">
            <div class="cont-ht">
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
          </div>

          <div v-if="activeTab === 'Details'">
            <div class="cont-ht side-pad">

              <b-field label="Payment Pointer">
                <b-input
                  :disabled="!paymentEnabled"
                  type="text"
                  v-model="paymentPointer"
                ></b-input>
              </b-field>

              <b-field label="Short Description">
                <b-input
                  type="textarea"
                  v-model="short_description"
                  minlength="0"
                  maxlength="100"
                ></b-input>
              </b-field>
              
              <b-field label="Description">
                <b-input
                  type="textarea"
                  v-model="description"
                  minlength="0"
                  maxlength="800"
                ></b-input>
              </b-field>
            </div>
          </div>

          <div v-if="activeTab === 'Audio'">

            <div class="cont-ht side-pad">

              <b-field label="Available sources"></b-field>

              <b>Visualization:</b>
              <br />

              <p class="is-italic is-small has-text-grey" v-if="vizAudioSources.length < 1">
                &lt;none&gt;
              </p>
              
              <div v-if="vizAudioSources.length > 0">
                <AudioItem
                  v-for="audioItem in vizAudioSources" :key="audioItem.name"
                  :source="audioItem.source"
                  :name="audioItem.name"
                  :format="audioItem.format"
                  :deleteDisabled="false"
                  @activeAudioClick="setActiveAudio"
                  @removeAudioSourceClick="removeAudioSource"
                />
              </div>

              <div class="panel">
                
                <div class="panel-block">

                  <b-input
                    type="text"
                    v-model="newAudioSource.name"
                    placeholder="Name"
                  ></b-input>

                  <b-input
                    type="text"
                    v-model="newAudioSource.source"
                    placeholder="Source"
                  ></b-input>

                  <b-button type="is-primary" expanded @click="addNewAudioSource">Add new source</b-button>

                </div>
                
              </div>

              <b>Default:</b>
              <br />

              <p class="is-italic is-small has-text-grey" v-if="defaultSources.length < 1">
                &lt;none&gt;
              </p>
              
              <AudioItem
                v-else
                v-for="audioItem in defaultSources" :key="audioItem.name"
                :source="audioItem.source"
                :name="audioItem.name"
                :format="audioItem.format"
                :deleteDisabled="true"
                @activeAudioClick="setActiveAudio"
                @removeAudioSourceClick="removeAudioSource"
              />

            </div>

          </div>

          <div>

            <div class="level is-marginless">

              <div class="level-left">

                <b-tooltip :label="'Make ' + (paymentEnabled ? 'free' : 'paid')" position="is-right">
                  <div @click="paymentEnabled = !paymentEnabled" class="clickable-icon">
                    <b-icon
                      :icon="(paymentEnabled) ? 'coins' : 'star-of-life'"
                      size="is-small"
                    ></b-icon>
                  </div>
                </b-tooltip>

                <div style="margin: 0px 6px 0px 0px"></div>
                
                <b-tooltip :label="'Make ' + (visibility === 'public' ? 'private' : 'public')" position="is-right">
                  <div @click="visibility = (visibility === 'public') ? 'private' : 'public'" class="clickable-icon">
                    <b-icon
                      :icon="(visibility === 'public') ? 'eye' : 'eye-slash'"
                      size="is-small"
                    ></b-icon>
                  </div>
                </b-tooltip>

              </div>

              <div class="level-left">
                <b-tooltip :label="'Source: ' + $store.state.audioSource.source" position="is-top">
                  {{ $store.state.audioSource.name }}
                </b-tooltip>
              </div>

              <div class="level-right">

                <b-tooltip label="Play audio and run visualization" position="is-left">
                  <div class="level-item clickable-icon" @click="run">
                    <b-icon
                      pack="fas"
                      :icon="($store.state.isPlaying) ? 'pause' : 'play'"
                      size="is-small"
                    ></b-icon>
                  </div>
                </b-tooltip>
                
              </div>
              
            </div>

          </div>

        </div>

      </SplitArea>

      <SplitArea :size="65">
        <Three ref="three" />
      </SplitArea>
      
    </Split>


  </div>
</template>

<script>
import Navbar from '@/partials/Navbar.vue';
import AudioItem from "@/components/AudioItem.vue";
import Three from "@/components/Three.vue";
import templateViz from "!raw-loader!@/assets/template_viz.js.txt";

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
      code: templateViz,
      paymentPointer: "",
      paymentEnabled: false,
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
      ]
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
      this.$buefy.toast.open('Saved successfully');
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
      if(this.$route.params.id) {
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
    }
  },
  async mounted() {

    while(this.$auth.loading) {
      await this.wait(100);
    }

    await this.updateFromParam();

  },
  async beforeDestroy() {
    if (this.$store.state.isPlaying) {
      await this.$refs.three.onPlayClicked();
    }
  }
}
</script>

<style scoped>

</style>
