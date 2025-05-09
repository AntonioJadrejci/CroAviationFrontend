import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import AddPlaneView from "@/views/AddPlaneView.vue";
import ProfileView from "@/views/ProfileView.vue";


Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView, // Koristite HomeView umjesto HelloWorld
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/addplane",
    name: "AddPlaneView",
    component: AddPlaneView,
  },
  {
    path: "/profile",
    name: "ProfileView",
    component: ProfileView,
  },
  {
    path: "/airport/:airport/:airline",
    name: "AirlinePlanesView",
    component: () => import("@/views/AirlinePlanesView.vue"),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
