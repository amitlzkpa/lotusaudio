<template>
  <div>

    <Split style="height: 100vh">
      
      <SplitArea :size="35">

        <div class="level is-marginless">
          
          <div class="level-left">

            <div class="level-item">

              <p class="is-size-7">
                <b-icon
                  :icon="(visibility === 'public') ? 'eye' : 'eye-slash'"
                  size="is-small"
                ></b-icon>
                {{ (visibility === 'public') ? 'Public' : 'Private' }}
              </p>
              
              <p style="margin: 0px 2px 0px 2px;">
              </p>
              
              <p class="is-size-7">
                <b-icon
                  :icon="isPayable ? 'lock' : 'lock-open'"
                  size="is-small"
                ></b-icon>
                {{ isPayable ? 'Paid' : 'Free' }}
              </p>

            </div>

          </div>

          <div class="level-right">
            <div class="level-item">

              <b-dropdown position="is-bottom-left" aria-role="list">
                <button class="button is-text" slot="trigger">
                  <b-icon
                    icon="prescription-bottle"
                    size="is-small"
                  ></b-icon>
                </button>

                <b-dropdown-item aria-role="listitem">
                  <router-link to="/home">Home</router-link>
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem" v-if="$auth.isAuthenticated">
                  <router-link to="/profile">Profile({{ $auth.user.name }})</router-link>
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem" v-if="$auth.isAuthenticated" >
                  <a @click="logout" href="#!">Log out</a>  
                </b-dropdown-item>
              </b-dropdown>

            </div>
          </div>
          
        </div>


        <div class="flex-container">

          <div style="padding: 0px 6px 0px 6px;">

            <p class="has-text-weight-bold is-size-4">
              {{ name }}
            </p>

          </div>

          <hr />

          <div class="is-marginless is-paddingless">
            <span
               @click="activeTab = 'Details'"
               class="clickable-icon">
              <span v-if="activeTab === 'Details'" class="has-text-weight-bold">Details</span>
              <span v-else>Details</span>
            </span>
          </div>

          <div v-if="activeTab === 'Details'" style="padding: 0px 6px 0px 6px;">
            <div style="height: 79vh;">

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


          <div>

            <div class="level is-marginless">

              <div class="level-left">
                <div class="level-item">
                  <span class="clickable-icon" @click="toggleUserWantsToPay" v-if="isPayable">
                    <b-icon
                      pack="fas"
                      :icon="userWantsToPay ? 'tint' : 'tint-slash'"
                      size="is-small"
                    ></b-icon>
                  </span>
                </div>
              </div>

              <div class="level-right">
                <div class="level-item">
                  <span @click="run" class="clickable-icon" v-if="((isPayable) ? isPayable && userWantsToPay : true)">
                    <b-icon
                      pack="fas"
                      icon="play"
                      size="is-small"
                    ></b-icon>
                  </span>
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
import Three from "@/components/Three.vue";
import templateViz from "!raw-loader!@/assets/template_viz.js.txt";

export default {
  name: 'VizEdit',
  components: {
    Three
  },
  data() {
    return {
      id: "",
      name: "",
      visibility: "public",
      short_description: "",
      description: "",
      code: templateViz,
      paymentPointer: "",
      activeTab: 'Details',
      paymentEnabled: true,
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
    },
    async run() {
      this.$store.commit('updateCode', this.code);
      this.$refs.three.onCodeUpdate();
    },
    async updateFromParam() {
      if(this.$route.params.id) {
        let resp = await this.$api.get(`/api/vizs/id/${this.$route.params.id}`);
        let viz = resp.data;
        console.log(viz);
        this.id = viz._id;
        this.name = viz.name;
        this.visibility = viz.visibility;
        this.short_description = viz.short_description;
        this.description = viz.description;
        this.code = JSON.parse(viz.code);
        this.paymentPointer = viz.paymentPointer;
        this.paymentEnabled = viz.paymentEnabled;
        this.$store.commit('updateCode', this.code);

        if (document.monetization && this.paymentPointer !== "") {
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
      this.run();
    }
  },
  async mounted() {

    while(this.$auth.loading) {
      await this.wait(100);
    }

    await this.updateFromParam();

  }
}
</script>

<style scoped>
.flex-container {
  display:flex;
  flex-direction:column;
}

.clickable-icon {
  cursor: pointer;
  margin: 4px;
}
</style>
