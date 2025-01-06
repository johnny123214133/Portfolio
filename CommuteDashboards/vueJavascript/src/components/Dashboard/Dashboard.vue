<template class='mx-2 mt-2'>
	<Navbar />
	<div v-if="showInstructions">
		<!-- TODO: replace react bootstrap classes with bootstrap vue ones -->
		<div className="p-4">
			<h2>Commute Dashboard</h2>
			<p>The purpose of this dashboard is to analyze the user's commute. It is built only to handle same-day round trips within a single timezone.</p>
			<p>For a pair of addresses (or Google-recognized locations) and a pair of future departure times on a given day,
				this dashboard displays: </p>
			<ul className="text-start">
				<li>The current best route on a map</li>
				<li>Controls over the current day's data to be displayed</li>
				<li>A toggle between the outgoing and return trips</li>
				<li>
					A graph detailing the best, average, and worst case commute times for the following 2.5 hours, <br/>
					starting after the given start times, incremented every 15 minutes
				</li>
				<li>A table detailing the expected arrival times for every given departure time</li>
			</ul>
			<h2>Usage</h2>
			<ul className="text-start">
				<li>Type in any two addresses or Google-recognized locations in the Origin and Destination fields</li>
				<li>Type in or select any two start times for the outgoing and return trips
					<br/>* Note: the return trip must not be sooner than the outgoing trip
				</li>
				<li>Select a start date
					<br/>* Note: Start date must be today or some future date
				</li>
				<li>Click Submit</li>
				<li>Click Clear if you wish to clear the current input</li>
			</ul>
		</div>
	</div>

	<div v-else-if="isLoading.value">
		<div style="height: 80vh;">
			<h1 className="m-2">Loading...</h1>
			<p>Please be patient. Loading up to 420 trips from Google.</p>
		</div>
	</div>

	<div v-else class='mx-0'>
		<!-- <h1>This is content</h1> -->
		<!-- <mq-layout mq='md'> -->
		<MqResponsive target='md-'>
			<BContainer fluid>
				<BRow class='pb-4'>
					<BCol>
						<GoogleMap />
					</BCol>
				</BRow>
				<BRow>
					<BCol style="width: 100%;">
						<CommuteAnalysis />
					</BCol>
				</BRow>
			</BContainer>
		<!-- </mq-layout> -->
		</MqResponsive>
		<MqResponsive target='lg+'>
		<!-- <mq-layout mq='lg'> -->
			<BContainer fluid class='px-0'>
				<BRow>
					<BCol>
						<GoogleMap />
					</BCol>
					<BCol style="width: 100%;">
						<CommuteAnalysis />
					</BCol>
				</BRow>
			</BContainer>
		<!-- </mq-layout> -->
		</MqResponsive>
	</div>

</template>


<script setup>
import Navbar from '../Navbar/Navbar.vue'
import CommuteAnalysis from '../CommuteAnalysis.vue'
import GoogleMap from '../GoogleMap.vue'
import { ref, inject } from 'vue'
import { MqResponsive } from 'vue3-mq'

import { BContainer, BRow, BCol } from 'bootstrap-vue-next'

// import VueMq from 'vue-mq'
// TODO: import bootstrap vue
let isLoading = inject('isLoading')
let showInstructions = inject('showInstructions')
console.log('isLoading: ' + isLoading.value)
console.log('showInstructions: ' + showInstructions.value)

</script>