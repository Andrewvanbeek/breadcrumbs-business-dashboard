import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'

import firebase from "firebase"
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyB0yoH-mtbMdfSmb-Wm1Mh4jtRaTjDw01M",
  authDomain: "breadcrumbs-c8f5e.firebaseapp.com",
  databaseURL: "https://breadcrumbs-c8f5e.firebaseio.com",
  projectId: "breadcrumbs-c8f5e",
  storageBucket: "breadcrumbs-c8f5e.appspot.com",
  messagingSenderId: "667949652702",
  appId: "1:667949652702:web:7339fb733f02ffb30b404f",
  measurementId: "G-XVH44JMXYQ"
}

firebase.initializeApp(firebaseConfig);
Vue.config.productionTip = false
Vue.prototype.$firebase = firebase
Vue.prototype.$firestore = firebase.firestore();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
