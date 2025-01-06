<template>
	<!-- <h1>Hi...</h1> -->
	<div ref="mapDiv" style="width: 100%; height: 80vh" />

</template>


<script setup>
import { ref, onMounted, inject, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

const routeData = inject('routeData')

const loader = new Loader({ apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, libraries: ['routes'] })

const mapDiv = ref(null)
let map = ref(null)

const directionsService = ref(null)
const directionsRenderer = ref(null)

function drawRoute() {
	if (directionsService.value == null || directionsRenderer.value == null || routeData.value == null || map.value == null) return
	directionsService.value.route({
		origin : routeData.value.origin.address,
		destination : routeData.value.destination.address,
		travelMode : google.maps.TravelMode.DRIVING,
		provideRouteAlternatives : false
	}).then(response => {
		console.log(response)
		directionsRenderer.value.setDirections(response)
		if (map.value !== null) {map.value.fitBounds(response.routes[0].bounds)}
	})
}

onMounted(async () => {
	console.log('awaiting loader load')
	await loader.load()
	console.log('loaded')

	map.value = new google.maps.Map(mapDiv.value, {
		center: { lat: 40.76972, lng: -111.89056 },
		zoom: 10,
		mapId: import.meta.env.VITE_COMMUTE_MAP_ID
	})
	console.log(map)

	directionsService.value = new google.maps.DirectionsService()
	directionsRenderer.value = new google.maps.DirectionsRenderer({map: map.value})
	console.log(google.maps)
	console.log(directionsService.value)

	drawRoute()
})

watch(routeData, () => {
	console.log(routeData)
	drawRoute()
})

</script>

