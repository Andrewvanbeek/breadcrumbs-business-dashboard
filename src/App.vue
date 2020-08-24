<template>
  <v-app>
    <v-app-bar app color="white" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="/logoalone.png"
          transition="scale-transition"
          width="60"
        />
        <v-toolbar-title color="black">Breadcrumbs</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <div class="my-2" v-if="authenticated">
        <v-btn small color="primary" @click="logout()">log out</v-btn>
      </div>
      <div class="my-2" v-else>
        <v-btn small color="primary" @click="goLogin()">login</v-btn>
        <v-btn small color="primary" @click="goRegister()">register</v-btn>
      </div>
    </v-app-bar>
    <v-content transition="slide-x-transition">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    authenticated: true
  }),
  methods: {
    async initialize() {
      var component = this;
      component.$firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
          component.authenticated = true;
        } else {
          component.authenticated = false;
        }
      });
    },
    async logout() {
      var component = this;
      component.$firebase
        .auth()
        .signOut()
        .then(function() {
          console.log("gets here");
          component.$router.go("/");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    async goLogin() {
      var component = this;
      component.$router.replace("/login");
    },
    async goRegister() {
      var component = this;
      console.log("gets here");
      component.$router.replace("/register");
    }
  },
  async mounted() {
    console.log("I AM MOUNTING");
    this.initialize();
  }
};
</script>

<style>
div.v-toolbar__title {
  color: #050005;
}
</style>