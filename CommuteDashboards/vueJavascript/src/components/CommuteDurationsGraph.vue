<template>
	<!-- TODO: figure out how to use chartjs in vue -->
	<VueApexCharts v-if='tripData && activeDay' :options='options' :series='series' type='boxPlot'  height='300' class='p-3'/>
</template>


<script setup>
import { ref, inject, watch, onBeforeMount } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import ApexCharts from 'apexcharts'

// IMPORTANT:
// TODO: figure out why the chart doesn't draw on first render

const tripData = inject('tripData')
const activeDay = inject('activeDay')
const showMorning = inject('showMorning')

// const options = ref({
// 	plotOptions: {
// 		bar: {
// 			horizontal: false
// 		},
// 	},
// 	title: {
// 		text: activeDay,
// 		align: 'center'
// 	}
// })

let options = {
	chart: {
		type: 'boxplot',
		height: 300,
		toolbar : {
				show : false
			}
	},
	title: {
		text: 'default chart',
		align: 'center'
	}
}

let series = ref([{
	data: [
		{
			x: "category 1",
			y: [40, 45, 45, 45, 60]
		},
		{
			x: "category 2",
			y: [43.66, 44.99, 51.35, 52.95, 59.42]
		},
		{
			x: "category n",
			y: [52.76, 57.35, 59.15, 63.03, 67.98]
		}
	]
}])

function mapData() {
	console.log('=========== NEW RENDER ===========')
	console.log(tripData)
	console.log(activeDay)
	if (tripData.value == {} || activeDay.value == 0) return
	console.log('updating graph with data:')

	console.log('\nparams')
	console.log(tripData.value)
	console.log(activeDay.value)
	console.log(showMorning.value)
	console.log('end params\n')
	var data = []
	let oneCommutesData = showMorning.value ? tripData.value.morning[activeDay.value] : tripData.value.evening[activeDay.value]

	data = oneCommutesData.map(datum => {
		let date = new Date(datum.start_time)
		// let timestamp = `${date.getHours()}:${date.getMinutes()}`
		let timestamp = date.toTimeString().substring(0,5)
		return {
			x: timestamp,
			y: [
				datum.best_duration,
				datum.avg_duration,
				datum.avg_duration,
				datum.avg_duration,
				datum.worst_duration,
			]
		}
	})
	console.log('old series:')
	console.log(series.value)
	series.value = [{data: data}]
	console.log('new series:')
	console.log(series.value)
	// this.$refs.commuteDurations.updateSeries([{data: data}])
	let date = new Date(activeDay.value)
	options = {...options.value,
		title: {
			text: ('Trip Durations for ' + new Date(activeDay.value).toDateString()),
			align: 'center'
		}
	}
	console.log('options')
	console.log(options)
	// setSeries([{data}])
	// console.log(series)
}

onBeforeMount(() => {
	mapData()
})

watch([tripData, activeDay, showMorning], ([tripData, activeDay, showMorning], [oldTripData, oldActiveDay, oldShowMorning]) => {
	mapData()
})

</script>



