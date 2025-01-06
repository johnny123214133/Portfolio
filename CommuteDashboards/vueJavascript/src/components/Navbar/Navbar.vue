<template>
	<!-- Hamburger Menu -->
	<!-- <mq-layout mq='md'> -->
	<MqResponsive target='md-'>
		<BNavbar toggleable='lg' expand='lg' sticky-top class='py-2'>
			<BNavbarBrand href='#'>Commute Dashboard</BNavbarBrand>
			<BNavbarToggle target='navbarCollapsableContent' />
			<BCollapse id='navbarCollapsableContent' is-nav>
				<BNavbarNav>
					<BForm id='form' @submit='onSubmit' @reset='onReset'>
						<!-- origin address -->
						<BFormGroup
							label='Origin Address'
							label-for='sm-origin'
							label-align='center'
							label-class='font-weight-bold'
							class='mt-2'
						>
							<BFormInput id='sm-origin' v-model='input.originAddress'></BFormInput>
						</BFormGroup>
						<!-- destination address -->
						<BFormGroup
							label='Destination Address'
							label-for='sm-dest'
							label-align='center'
							class='mt-2'
						>
							<BFormInput id='sm-dest' v-model='input.destinationAddress'></BFormInput>
						</BFormGroup>
						<!-- morning start time -->
						<BFormGroup
							label='Morning Start Time'
							label-for='sm-morning-time'
							label-align='center'
							class='mt-2'
						>
							<BFormInput id='sm-morning-time' type='time' v-model='morningTime' @update:model-value='handleMorningTimeChange'></BFormInput>
						</BFormGroup>
						<!-- evening start time -->
						<BFormGroup
							label='Evening Start Time'
							label-for='sm-evening-time'
							label-align='center'
							class='mt-2'
						>
							<BFormInput id='sm-evening-time' type='time' v-model='eveningTime' @update:model-value='handleEveningTimeChange'></BFormInput>
						</BFormGroup>
						<!-- start date -->
						<BFormGroup
							label='Start Date'
							label-for='sm-start-date'
							label-align='center'
							class='my-2'
						>
							<BFormInput id='sm-start-date' type='date' v-model='startDate' @update:model-value='handleDateChange'></BFormInput>
						</BFormGroup>
						<!-- submit button -->
						<!-- <BButtonGroup> -->
						<!-- <BRow class='mt-2'>
							<BCol> -->
								<BButton class='mx-2' type='reset' variant = 'danger' @click='onReset'>
									Clear
								</BButton>
							<!-- </BCol>
							<BCol> -->
								<!-- submit button -->
								<BButton type='submit' variant='secondary' @click='onSubmit'>
									Submit
								</BButton>
							<!-- </BCol>
						</BRow> -->
						
						<!-- </BButtonGroup> -->
						<!-- <BButton class='ms-auto'>Submit</BButton> -->
					</BForm>
				</BNavbarNav>
			</BCollapse>
		</BNavbar>
	<!-- </mq-layout> -->
	</MqResponsive>

	<!-- desktop layout -->
	<!-- <mq-layout mq='lg'> -->
	<MqResponsive target='lg+'>
		<BContainer fluid class='mb-4' sticky-top>
			<BForm>
				<BRow>
					<BCol cols='6'>
						<!-- origin address -->
						<BFormGroup
							label='Origin Address'
							label-for='lg-origin'
							label-cols='3'
						>
							<BFormInput id='lg-origin' v-model='input.originAddress'></BFormInput>
						</BFormGroup>
					</BCol>
					<BCol cols='6'>
						<BRow style='flex-wrap: nowrap !important;'>
							<BCol cols='6'>
								<!-- morning start time -->
								<BFormGroup
									label='Morning Start Time'
									label-for='lg-morning-time'
									label-cols='6'
								>
									<BFormInput id='lg-morning-time' type='time' v-model='morningTime' @update:model-value='handleMorningTimeChange'></BFormInput>
								</BFormGroup>
							</BCol>
							<BCol cols='6' style='flex-wrap: nowrap !important;'>
								<!-- start date -->
								<BFormGroup
									label='Start Date'
									label-for='lg-start-date'
									label-cols='4'
									style='flex-wrap: nowrap !important;'
								>
									<BFormInput id='lg-start-date' type='date' v-model='startDate' @update:model-value='handleDateChange'></BFormInput>
								</BFormGroup>
							</BCol>
						</BRow>
					</BCol>
				</BRow>
				<BRow class='mt-2'>
					<BCol cols='6'>
						<!-- dest address -->
						<BFormGroup
							label='Destination Address'
							label-for='lg-dest'
							label-cols='3'
						>
							<BFormInput id='lg-dest' v-model='input.destinationAddress' @update:model-value='handleDateChange'></BFormInput>
						</BFormGroup>
					</BCol>
					<BCol cols='6'>
						<BRow>
							<BCol cols='6'>
								<!-- evening start time -->
								<BFormGroup
									label='Evening Start Time'
									label-for='lg-evening-start-time'
									label-cols='6'
								>
									<BFormInput id='lg-evening-start-time' type='time' v-model='eveningTime' @update:model-value='handleEveningTimeChange'></BFormInput>
								</BFormGroup>
							</BCol>
							<BCol cols='6'>
									<BButton class='mx-2' type='reset' variant = 'danger' @click='onReset'>
										Clear
									</BButton>
									<!-- submit button -->
									<BButton type='submit' variant='secondary' @click='onSubmit'>
										Submit
									</BButton>
								
							</BCol>
						</BRow>
					</BCol>
				
				</BRow>
			</BForm>
		</BContainer>
	<!-- </mq-layout> -->
	</MqResponsive>
	<hr />

</template>


<script setup>
import { ref, reactive, inject } from 'vue'
// import VueMq from 'vue-mq'
import { MqResponsive } from 'vue3-mq'

import { BForm, BFormGroup, BFormInput, BButton, BButtonGroup, BContainer, BRow, BCol, BNavbar, BNavbarBrand, BCollapse, BNavbarToggle, BNavbarNav } from 'bootstrap-vue-next'

import { HOUR_TO_MINUTES, MINUTE_TO_MILLISECONDS } from '../../utils/constants.js'

let params = inject('routeParams')
let showMorning = inject('showMorning')
let morningTime = ref('')
let eveningTime = ref('')
let startDate = ref('')
let collapse = ref(false)

let input = ref({
	originAddress : '',
	destinationAddress : '',
	startDate : new Date().setHours(0, 0, 0, 0),
	morningTimeDelta : [0, 0],
	eveningTimeDelta : [0, 0]
})

function adjustForTimeZone(newDate) {
	// get the timezone difference from the ISO string of the local machine's datetime
	// timestamp > set to local midnight
	// > split on first :
	// > split on T
	// cast isolated hours to int
	let hoursDelta = parseInt(new Date(new Date().setHours(0, 0, 0, 0)).toISOString().split(':')[0].split('T')[1])
	// add hours to new date
	return newDate.getTime() + hoursDelta * HOUR_TO_MINUTES * MINUTE_TO_MILLISECONDS
}

function handleDateChange(newDate) {
	// console.log('updating date')
	// console.log(typeof(newDate))
	// console.log('old date: ', input.value.startDate)
	// console.log('new date: ', adjustForTimeZone(new Date(newDate)))
	input.value.startDate = adjustForTimeZone(new Date(newDate))
}

function handleMorningTimeChange(newTime) {
	var components = newTime.split(':')
	components = components.map(item => {return Number(item)})
	input.value.morningTimeDelta = components
}

function handleEveningTimeChange(newTime) {
	var components = newTime.split(':')
	components = components.map(item => {return Number(item)})
	input.value.eveningTimeDelta = components
}

function handleToggleMorningSwitch(event) {
	// setShowMorning(!showMorning)
}


function adjustTime(startTime, timeDelta) {
	console.log(startTime, timeDelta)
	return startTime + (timeDelta[0] * HOUR_TO_MINUTES + timeDelta[1]) * MINUTE_TO_MILLISECONDS
}

function validateInput() {
	if (typeof input.value.originAddress !== 'string' || input.value.originAddress.length < 1) {
		throw 'Origin address must be a string of length greater than 0.'
	}
	if (typeof input.value.destinationAddress !== 'string' || input.value.destinationAddress.length < 1) {
		throw 'Destination address must be a string of length greater than 0.'
	}
	if (input.value.startDate < new Date().setHours(0, 0, 0, 0)) {
		throw 'Start date must be today or a future date.'
	}
	if (adjustTime(input.value.startDate, input.value.morningTimeDelta) < new Date().getTime()) {
		throw 'Morning start date and time must be now or in the future.'
	}
	if (adjustTime(input.value.startDate, input.value.eveningTimeDelta) < new Date().getTime()) {
		throw 'Evening start date and time must be now or in the future.'
	}
	if (input.value.morningTimeDelta[0] > input.value.eveningTimeDelta[0] || 
		(input.value.morningTimeDelta[0] == input.value.eveningTimeDelta[0] && 
			input.value.morningTimeDelta[1] > input.value.eveningTimeDelta[1])
	) {
		throw 'Morning start time must not be later than evening start time.'
	}
}

function onSubmit(event) {
	console.log('submitting')
	try {
		event.preventDefault()
		// console.log(input.value)
		validateInput()
		// TODO: uncomment following line to trigger submission
		console.log('ok, now actually submitting')
		params.value = input.value
	}
	catch(error) {
		// TODO: toast?
		alert(error)
	}
}

function onReset(event) {
	event.preventDefault()
	console.log('RESETTING INPUT')
	// console.log('input is: ')
	// console.log(input)
	input.value = {
		originAddress : '',
		destinationAddress : '',
		startDate : new Date().setHours(0, 0, 0, 0),
		morningTimeDelta : [0, 0],
		eveningTimeDelta : [0, 0]
	}
	morningTime.value = ''
	eveningTime.value = ''
	startDate.value = ''
	// console.log('and now: ')
	// console.log(input)
}

</script>



