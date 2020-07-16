import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Table from '../views/Table.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tables/:id',
    name: 'Table',
    component: Table
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

console.log("TESJOJFIOSHUI")

router.beforeEach(async (to, from, next) => {
  Vue.prototype.$firebase.auth().onAuthStateChanged(async function(user) {
    console.log("TESTING")
    var loggedIn = await user
    if (loggedIn) {
      console.log("user is still authenticated")
      if (to.name === "Login") next({name: 'Home'})
      next() // move on to the next page
    } else {
      console.log("user is logged out")
      if (to.name === "Register") next()
      else if( to.name !== 'Login') next({ name: 'Login' })
      else next()
    }
  });
})

export default router
