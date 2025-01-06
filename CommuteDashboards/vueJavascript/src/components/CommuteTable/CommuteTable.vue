<template>
	<MqResponsive target='md-'>
	<!-- <mq-layout mq='md'> -->
		<!-- small format Table with headers down first row goes here -->
		<table striped responsive style='font-size: 12px; width: 100%;' v-if='tripData && activeDay && arrivalEstimates'>
			<thead>
				<tr>
					<th><b>Departure Time</b></th>
					<th>Best Case Arrival Time</th>
					<th>Avg. Case Arrival Time</th>
					<th>Worst Case Arrival Time</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for='(estimate, i) in arrivalEstimates.departureTimes'>
					<td>{{arrivalEstimates.departureTimes[i]}}</td>
					<td>{{arrivalEstimates.bestArrivalTimes[i]}}</td>
					<td>{{arrivalEstimates.avgArrivalTimes[i]}}</td>
					<td>{{arrivalEstimates.worstArrivalTimes[i]}}</td>
				</tr>
			</tbody>
		</table>
	<!-- </mq-layout> -->
	</MqResponsive>

	<!-- desktop layout -->
	<!-- <mq-layout mq='lg'> -->
	<MqResponsive target='lg+'>
	<!-- <mq-layout mq='lg'> -->
		<!-- large format Table with headers across first column goes here -->
		<table striped="columns" responsive style='font-size: 12px; width: 100%;' v-if='tripData && activeDay && arrivalEstimates'>
			<tbody>
			<tr>
				<td><b>Departure Time</b></td>
				<td v-for='time in arrivalEstimates.departureTimes' style='font-size: 11px;'><b>{{time}}</b></td>
			</tr>
			<tr>
				<td>Best Case Arrival Time</td>
				<td v-for='time in arrivalEstimates.bestArrivalTimes' style='font-size: 11px;'>{{time}}</td>
			</tr>
			<tr>
				<td>Avg. Case Arrival Time</td>
				<td v-for='time in arrivalEstimates.avgArrivalTimes' style='font-size: 11px;'>{{time}}</td>
			</tr>
			<tr>
				<td>Worst Case Arrival Time</td>
				<td v-for='time in arrivalEstimates.worstArrivalTimes' style='font-size: 11px;'>{{time}}</td>
			</tr>
			</tbody>
		</table>
	<!-- </mq-layout> -->
	</MqResponsive>
</template>


<script setup>
import { ref, inject, watch, onMounted } from 'vue'
import { MqResponsive } from 'vue3-mq'

import { BTable, BThead, BTbody, BTr, BTh, BTd } from 'bootstrap-vue-next'
import './CommuteTable.css'

// import { HOUR_TO_MINUTES, MINUTE_TO_MILLISECONDS } from '../../utils/constants.js'

const tripData = inject('tripData')
const activeDay = inject('activeDay')
const showMorning = inject('showMorning')

// const activeDayData = ref()
const arrivalEstimates = ref({})

function addMinutes(date, minutes) {
	return parseTime(new Date(date.getTime() + minutes*60000));
}
function parseTime(timestamp) {
	return timestamp.toTimeString().substring(0,5)
}

function mapData() {
	console.log('\nparams')
	console.log(tripData.value)
	console.log(activeDay.value)
	console.log(showMorning.value)
	console.log('end params\n')
	if (!tripData.value || !activeDay.value || typeof showMorning.value === undefined) return
	
	let data = showMorning.value ? tripData.value.morning[activeDay.value] : tripData.value.evening[activeDay.value]
	// var newData = []

	console.log('data:')
	console.log(data)

	let arrivals = {
		departureTimes : [],
		bestArrivalTimes : [],
		avgArrivalTimes : [],
		worstArrivalTimes : []
	}
	data.forEach(datum => {
		var timestamp = new Date(datum.start_time) 
		arrivals.departureTimes.push(parseTime(timestamp))
		arrivals.bestArrivalTimes.push(addMinutes(timestamp, datum.best_duration))
		arrivals.avgArrivalTimes.push(addMinutes(timestamp, datum.avg_duration))
		arrivals.worstArrivalTimes.push(addMinutes(timestamp, datum.worst_duration))
	})
	console.log(arrivals)
	
	arrivalEstimates.value = arrivals

	// console.log('ACTIVE DATE DATA')
	// console.log(activeDateData)
}

onMounted(() => {
	mapData()
})

watch([tripData, activeDay, showMorning], ([tripData, activeDay, showMorning], [oldtripData, oldActiveDay, oldShowMorning]) => {
	mapData()
})

</script>

