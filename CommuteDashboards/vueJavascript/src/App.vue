<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import CommuteData from './components/DataModel/CommuteData.vue'
import Dashboard from './components/Dashboard/Dashboard.vue'

// import VueMq from 'vue-mq'
// TODO: import bootstrap vue

// Vue.use(Vuemq, {
//   breakpoints: {
//     sm: 450,
//     md: 1250,
//     lg: Infinity,
//   }
// })

// TODO: import 
// Vue.use(VueGoogleMaps, {
//   load: {
//     key: import.meta.env.VUE_GOOGLE_MAPS_API_KEY,
//     libraries: {
//       'places'
//     }
//   }
// })

</script>

<template>
  <!-- TODO: figure out how to pass components as props -->
  <CommuteData :Children="Dashboard">
    <!-- <component :is="child_component"> -->
  </CommuteData>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
