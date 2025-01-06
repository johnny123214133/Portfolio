<template> 
	<Dashboard />
</template>

<script setup>
import { getRouteDetails, getTrips } from './functions.js'
// import Navbar from '../Navbar/Navbar.vue'
import Dashboard from '../Dashboard/Dashboard.vue'
// import children?
import { ref, watch, provide } from 'vue' // defineProps is a compiler macro. does not need to be imported

const props = defineProps(['Children'])

let params = ref({})
let routeData = ref(null)
let tripData = ref({})
let showMorning = ref(true)
let weekdays = ref({})
let activeDay = ref(0)
let isLoading = ref(false)
let showInstructions = ref(true)

let abortController = ref(null)

provide('routeParams', params.value)
provide('routeData', routeData)
provide('tripData', tripData)
provide('showMorning', showMorning)
provide('weekdays', weekdays)
provide('activeDay', activeDay)
provide('isLoading', isLoading)
provide('showInstructions', showInstructions)

const resetData = () => {
	params.value = {}
	routeData.value = null
	tripData.value = {}
	showMorning.value = {}
	weekdays.value = {}
	activeDay.value = {}
	showInstructions.value = true
}

// watch(params, async () => {
const fetchData = async () => {
	try {
		console.log('submitting params. fetching data')

		if (abortController.value !== null) abortController.value.abort()
		abortController.value = new AbortController()

		showInstructions.value = false
		isLoading.value = true
		console.log('Now fetching route')

		await getRouteDetails(params.value, abortController.value.signal)
		.then(data => {
			console.log('got route:')
			console.log(data)
			routeData.value = data
			return data
		})
		.then(routeData => {
			console.log('fetching trips with data')
			console.log(routeData)
			return getTrips(routeData, abortController.value.signal)
		})
		.then(trips => {
			console.log('got trips:')
			console.log(trips)
			tripData.value = trips 
			let days = Object.keys(trips.morning)
			days = days.map(day => parseInt(day))
			days.sort()
			weekdays.value = days
			activeDay.value = days[0]
			isLoading.value = false
			console.log(weekdays)
			console.log(activeDay)
		})
		.catch(error => {
			console.log(error)
			resetData()
			const message = error.response.data.messages ? error.response.data.messages.join('\n') : error
			// TODO: toast error?
			alert(error.response.data.messages.join('\n'))
		})

	}
	catch (error) {
		resetData()
		console.log(error)
		// TODO: toast the error?
		alert('Unexpected error occurred.')				
	}
	finally {
		isLoading.value = false
	}
	return () => { if (abortController.value !== null) abortController.value.abort() }
}

watch(params.value, fetchData)

</script>



