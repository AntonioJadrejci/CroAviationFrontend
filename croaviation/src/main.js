import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'


axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';


axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})


axios.interceptors.response.use(response => response, async error => {
  if (!error.response) {
    console.error('Network error:', error)
    return Promise.reject(error)
  }

  const originalRequest = error.config


  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) throw error

      const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'}/api/refresh-token`, { token: refreshToken })
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


  if ([403, 404].includes(error.response.status)) {

    return Promise.reject(error);
  }

  return Promise.reject(error);
})


Vue.prototype.$api = axios


Vue.config.errorHandler = (err) => {
  console.error('Global error:', err)
}

Vue.config.productionTip = false


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {

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