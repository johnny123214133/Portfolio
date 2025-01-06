import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { Vue3Mq } from 'vue3-mq'
import { createBootstrap } from 'bootstrap-vue-next'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
// import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
// import 'bootstrap'

// import ApexCharts from "apexcharts";

const app = createApp(App)

app.use(Vue3Mq, {
	global: true,
	preset: 'bootstrap5'
  // breakpoints: {
  //   sm: 450,
  //   md: 1250,
  //   lg: Infinity,
  // }
})

// app.provide('bootstrap', bootstrap)
app.use(createBootstrap())

// app.config.globalProperties.$apexcharts = ApexCharts;

app.mount('#app')
