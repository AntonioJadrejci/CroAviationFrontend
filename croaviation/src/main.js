import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

// Axios configuration
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api'

// Request interceptor for adding token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Response interceptor for error handling
axios.interceptors.response.use(response => response, async error => {
  if (!error.response) {
    console.error('Network error:', error)
    return Promise.reject(error)
  }

  const originalRequest = error.config

  // If 401 error and not a refresh request
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) throw error

      const response = await axios.post('/refresh-token', { token: refreshToken })
      const newToken = response.data.token

      localStorage.setItem('authToken', newToken)
      originalRequest.headers.Authorization = `Bearer ${newToken}`

      return axios(originalRequest)
    } catch (err) {
      console.error('Token refresh failed:', err)
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      router.push('/login')
      return Promise.reject(err)
    }
  }

  // If 403 error (unauthorized)
  if (error.response.status === 403) {
    router.push('/?error=unauthorized')
  }

  return Promise.reject(error)
})

// Set axios as global Vue property
Vue.prototype.$api = axios

// Global error handling - removed unused parameters
Vue.config.errorHandler = (err) => {
  console.error('Global error:', err)
}

Vue.config.productionTip = false

// Create Vue instance
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    // Check token on app start
    const token = localStorage.getItem('authToken')
    if (token) {
      axios.get('/profile').catch(err => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('authToken')
          localStorage.removeItem('refreshToken')
        }
      })
    }
  }
}).$mount('#app')