<template>
  <div>

    <Split style="height: 100vh">
      
      <SplitArea :size="35">

        <Navbar />

        <div class="flex-container" v-if="id !== ''">

          <div class="side-pad">

            <span class="has-text-weight-bold is-size-4">
              {{ name }}
            </span>

            <div class="level" style="margin: 2px 0px 2px 0px;">
              
              <div class="level-left">
                <div class="level-item">
                  <span
                    class="has-text-grey-light is-italic is-size-7"
                  >{{ id }}
                  </span>
                </div>
              </div>

              <div class="level-right">
                <div class="level-item">
                  <router-link :to="{ name: 'edit', params: { id: id } }" v-if="$auth.isAuthenticated && $auth.dbUser._id === author._id">
                    <b-button
                      type="is-text"
                      size="is-small"
                    >Edit</b-button>
                  </router-link>
                </div>
              </div>
              
            </div>

          </div>

          <div class="is-marginless is-paddingless side-pad">
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

          <div v-if="activeTab === 'Details'">
            <div class="cont-ht side-pad">

              <div class="columns">

                <div class="column">
                  <p>
                    <b-icon
                      :icon="(visibility === 'public') ? 'eye' : 'eye-slash'"
                    ></b-icon>
                    {{ (visibility === 'public') ? 'Public' : 'Private' }}
                  </p>
                </div>
                
                <div class="column">
                  <p>
                    <b-icon
                      :icon="isPayable ? 'lock' : 'lock-open'"
                    ></b-icon>
                    {{ isPayable ? 'Paid' : 'Free' }}
                  </p>
                </div>
                
              </div>

              <div class="columns">
                <div class="column">

                    <b-field label="Short Description">
                      <p>
                        {{ short_description }}
                      </p>
                    </b-field>
                    
                    <b-field label="Description">
                      <p>
                        {{ description }}
                      </p>
                    </b-field>
                    
                </div>
              </div>
              
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
                  :deleteDisabled="true"
                  @activeAudioClick="setActiveAudio"
                />
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
              />

            </div>

          </div>

          <div>

            <div class="level is-marginless">

              <div class="level-left">
                <div class="level-item">
                  
                  <b-tooltip :label="(userWantsToPay ? 'Stop' : 'Start') + ' streaming payments'" position="is-right" v-if="isPayable">
                    <span class="clickable-icon" @click="toggleUserWantsToPay" v-if="isPayable">
                      <b-icon
                        pack="fas"
                        :icon="userWantsToPay ? 'tint' : 'tint-slash'"
                        size="is-small"
                      ></b-icon>
                    </span>
                  </b-tooltip>

                </div>
              </div>

              <div class="level-left">
                <b-tooltip :label="'Source: ' + $store.state.audioSource.source" position="is-top">
                  {{ $store.state.audioSource.name }}
                </b-tooltip>
              </div>

              <div class="level-right">
                <div class="level-item">

                  <b-tooltip label="Play audio and run visualization" position="is-left">
                    <span @click="run" class="clickable-icon" v-if="((isPayable) ? isPayable && userWantsToPay : true)">
                      <b-icon
                        pack="fas"
                        :icon="($store.state.isPlaying) ? 'pause' : 'play'"
                        size="is-small"
                      ></b-icon>
                    </span>
                  </b-tooltip>
                  
                </div>
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
      activeTab: 'Details',
      paymentEnabled: true,
      vizAudioSources: [],
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
      ],
      userWantsToPay: false
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
    toggleUserWantsToPay() {
      this.userWantsToPay = !this.userWantsToPay;
      this.updatePaymentStream();
    },
    async run() {
      this.$store.commit('updateCode', this.code);
      await this.$refs.three.initViz();
      await this.$refs.three.onPlayClicked();
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
    async setActiveAudio(audioSource) {
      this.$store.commit('updateAudioSource', audioSource);
      await this.$refs.three.onAudioSourceUpdate();
    },
    async updatePaymentStream() {
      
      let metas = Array.from(document.getElementsByTagName("meta"));
      let elem = metas.filter(m => Array.from(m.attributes).filter(a => { return a.name === "name" && a.value === "monetization"; }).length > 0 )[0];
      let shouldBeOn = this.isPayable ? this.isPayable && this.userWantsToPay : false;
      let isCurrentlyOn = !!elem;

      if ((shouldBeOn && isCurrentlyOn) || (!shouldBeOn && !isCurrentlyOn)) return;
      if (!shouldBeOn && isCurrentlyOn) {
        elem.parentNode.removeChild(elem);
        if(this.$store.state.isPlaying) {
          await this.$refs.three.onPlayClicked();
        }
        return;
      }
      if (shouldBeOn && !isCurrentlyOn) {
        let m = document.createElement("meta");
        let att1 = document.createAttribute("name");
        att1.value = "monetization";
        let att2 = document.createAttribute("content");
        att2.value = this.paymentPointer;
        m.setAttributeNode(att1);
        m.setAttributeNode(att2);
        document.head.appendChild(m);
      }

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
    
    let metas = Array.from(document.getElementsByTagName("meta"));
    let elem = metas.filter(m => Array.from(m.attributes).filter(a => { return a.name === "name" && a.value === "monetization"; }).length > 0 )[0];
    let isCurrentlyOn = !!elem;
    if (isCurrentlyOn) {
      elem.parentNode.removeChild(elem);
    }
  }
}
</script>

<style scoped>

</style>
