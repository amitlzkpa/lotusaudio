<template>
  <div>

    <Split style="position: absolute; left: 0; right 0: top: 0; bottom: 0;" @onDrag="paneWidthUpdate">
      
      <SplitArea style="padding: 6px;" :size="paneWidth">

        <Navbar />

        <div v-if="id !== ''" style="height: 91vh; display: flex; flex-direction: column;">

          <div style="flex: 0 0 auto;">

            <span>{{ name }}</span>
            <br/>

            <span>{{ id }}</span>
            <br/>
            
            <router-link
              v-if="$auth.isAuthenticated && $auth.dbUser._id === author._id"
              :to="{ name: 'edit', params: { id: id } }"
              tag="button"
            >
              Edit
            </router-link>

          </div>

          <div style="flex: 1 0 auto;">

            <div>
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

              &nbsp;&nbsp;|&nbsp;&nbsp;

              <span
                @click="activeTab = 'Live'"
                style="cursor: pointer;"
              >
                <b v-if="activeTab === 'Live'">Live</b>
                <span v-else>Live</span>
              </span>
            </div>

            <div style="height: 77vh; overflow-y: auto; overflow-x: hidden;">
              <div v-if="activeTab === 'Details'">
                
                <i :class="`fas fa-${visibility === 'public' ? 'eye' : 'eye-slash'}`"></i>
                {{ visibility === 'public' ? 'Public' : 'Private' }}

                <i :class="`fas fa-${isPayable ? 'lock' : 'lock-open'}`"></i>
                {{ isPayable ? 'Paid' : 'Free' }}

                <p>
                  {{ description }}
                </p>

              </div>

              <div v-if="activeTab === 'Audio'">

                <details open>
                  <summary>Available sources:</summary>
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
                  <summary>Default sources:</summary>
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

              </div>
          
              <div v-if="activeTab === 'Live'">
                
                Status: {{ peerIsLive ? 'online' : 'offline' }}
                <br/>
                
                <button
                  @click="setPeerOnlineStatus(!peerIsLive)"
                >
                  Go {{ !peerIsLive ? 'online' : 'offline' }}
                </button>

                <div v-if="peerIsLive">
                  Your ID: {{ myPeerId }}
                  <br/>
                  Partner ID:
                  <input
                    type="text"
                    v-model="peerIdToConnectTo"
                    :disabled="theirPeerId !== ''"
                  />
                  <br/>
                  <button
                    @click="toggleConnToPeer"
                  >{{ theirPeerId === '' ? 'Connect' : 'Disconnect' }}</button>

                  <br/>
                  <br/>

                  <div v-if="theirPeerId !== ''">
                    Message:
                    <input
                      type="text"
                      v-model="msgForPeer"
                    />
                    <br/>
                    <button
                      @click="sendMsgToPeer"
                    >Send</button>

                    <br/>

                    <span
                      v-for="(msg, idx) in msgsHistory"
                      :key="idx"
                    >
                      {{ msg.peer }}: {{ msg.txt }} <br/>
                    </span>
                  </div>
                  
                </div>
                
              </div>
            </div>

          </div>

          <div style="flex: 0 0 auto; text-align: center">

            <span @click="toggleUserWantsToPay" v-if="isPayable" :alt="(userWantsToPay ? 'Stop' : 'Start') + ' streaming payments'">
              <i :class="`fas fa-${userWantsToPay ? 'donate' : 'ticket-alt'}`"></i>
            </span>

            {{ $store.state.audioSource.name }}

            <span alt="Play audio and run visualization" @click="run" v-if="((isPayable) ? isPayable && userWantsToPay : true)">
              <i :class="`fas fa-${$store.state.isPlaying ? 'pause' : 'play'}`"></i>
            </span>

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
import Navbar from '@/components/Navbar.vue';
import AudioItem from "@/components/AudioItem.vue";
import Three from "@/components/Three.vue";
import templateViz from "!raw-loader!@/assets/template_viz.js";

import Peer from 'peerjs';

let peer = null;
let conn = null;

export default {
  name: 'VizEdit',
  components: {
    Navbar,
    AudioItem,
    Three
  },
  data() {
    return {
      myPeerId: "",
      theirPeerId: "",
      peerIdToConnectTo: "",
      peerIsLive: false,
      msgForPeer: "",
      msgsHistory: [],

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
      paneWidth: 40,
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
        {
          name: "Sine 30",
          source: "/audio_samples/sine_30.mp3",
          format: "audio/mpeg"
        },
        {
          name: "Sine 400",
          source: "/audio_samples/sine_400.mp3",
          format: "audio/mpeg"
        },
        {
          name: "Sine Chirp 20-600",
          source: "/audio_samples/sine-chirp_20-600.mp3",
          format: "audio/mpeg"
        },
        {
          name: "Sine Sweep 20-20000",
          source: "/audio_samples/sine-sweep_20-20000.mp3",
          format: "audio/mpeg"
        }
      ],
      userWantsToPay: false,
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

    },
    paneWidthUpdate(size) {
      this.paneWidth = size[0];
      this.$refs.three.onContainerResize();
    },
    togglePaneWidth() {
      this.paneWidth = (this.paneWidth < 10) ? 60 : 1;
      setTimeout(() => { this.$refs.three.onContainerResize(); }, 0);
    },
    async recvMsgFmPeer(data) {
      this.msgsHistory.push({
        peer: this.theirPeerId,
        txt: data.msg
      });
    },
    async sendMsgToPeer() {
      let data = {
        msg: this.msgForPeer
      };
      conn.send(data);
      this.msgsHistory.push({
        peer: this.myPeerId,
        txt: this.msgForPeer
      });
    },
    async toggleConnToPeer() {
      if (conn) {

        conn.close();
        conn = null;
        this.theirPeerId = '';
        
      } else {

        conn = peer.connect(this.peerIdToConnectTo, {});
        this.theirPeerId = conn.peer;
        
        let that = this;
  
        conn.on('data', function(data) {
          that.recvMsgFmPeer(data);
        });
        
        conn.on('open', function(data) {
          console.log(data);
        });
  
        // invitee gone
        conn.on('close', function() {
          conn.close();
          conn = null;
          that.theirPeerId = '';
        });
  
        conn.on('error', function(err) {
          console.log('Error in connection.');
          console.log(err);
          if (conn) {
            conn.close();
            conn = null;
            that.theirPeerId = '';
          }
        });
        
      }

    },
    async setPeerOnlineStatus(isOnline) {

      this.peerIsLive = isOnline;
      if (this.peerIsLive) {
        
        let peerjsOpts = {
          host: location.hostname,
          port: location.port,
          path: '/peerjs'
        };

        peer = new Peer(this.myPeerId, peerjsOpts);

        // connected to PeerServer
        peer.on('open', function(id) {
          console.log(`Registered with peer id: ${id}`);
        });

        // error in connecting to PeerServer
        peer.on('error', function(err) {
          console.log('Error in connecting.');
          console.log(err);
        });

        let that = this;

        // connection received
        peer.on('connection', function(newConn) {
          if (conn !== null) {
            console.log('Session already running. Ignoring connection.');
            newConn.close();
            return;
          }
          conn = newConn;
          that.theirPeerId = conn.peer;
          that.peerIdToConnectTo = conn.peer;
          
          conn.on('data', function(data) {
            that.recvMsgFmPeer(data);
          });
        
          conn.on('open', function(data) {
            console.log(data);
          });

          // inviter gone
          conn.on('close', function() {
            conn.close();
            conn = null;
            that.theirPeerId = '';
          });

          conn.on('error', function(err) {
            console.log('Error in connection.');
            console.log(err);
            if (conn) {
              conn.close();
              conn = null;
              that.theirPeerId = '';
            }
          });

        });

      } else {
        peer.destroy();
        peer = null;
      }

    }
  },
  async mounted() {

    while(this.$auth.loading) {
      await this.wait(100);
    }
    
    this.myPeerId = new Date().getTime().toString().slice(-6);

    setTimeout(() => { this.$refs.three.onContainerResize(); }, 0);
    await this.updateFromParam();
  },
  async beforeDestroy() {
    if (peer) {
      peer.destroy();
      peer = null;
    }

    if (this.$store.state.isPlaying) {
      await this.$refs.three.onPlayClicked();
    }
    
    let metas = Array.from(document.getElementsByTagName("meta"));
    let elem = metas.filter(m => Array.from(m.attributes).filter(a => { return a.name === "name" && a.value === "monetization"; }).length > 0 )[0];
    let isCurrentlyOn = !!elem;
    if (isCurrentlyOn) {
      elem.parentNode.removeChild(elem);
    }

    this.code = null;
    this.$store.commit('updateCode', this.code);
  }
}
</script>

<style scoped>

</style>
