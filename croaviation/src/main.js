import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

// Axios configuration
axios.defaults.baseURL = 'http://localhost:3000/api' // Added /api to base URL
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Global error handling
axios.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    router.push('/login')
  }
  return Promise.reject(error)
})

Vue.prototype.$api = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')