<template>
		<BButtonToolbar justify>
			<BButtonGroup aria-label="Weekday toggle bar">
				<!-- v-for... -->
				<BButton variant='secondary' v-for='day in dayNames' @click='handleClick(day[0])' :key='day[0]'>
					{{ day[1] }}
				</BButton>
				<!-- {dayNames.map((day) => {
					return (
						<Button key={day[0]} variant="secondary" onClick={handleClick} day={day[0]}>{day[1]}</Button>
					)
				})} -->
			</BButtonGroup>
			<!-- TODO: vue buttons -->
			<BButton variant='secondary' @click='handleToggleMorning'>{{ showMorning ? "Showing Morning" : "Showing Evening" }}</BButton>
			<!-- <Button className="ms-auto" variant="secondary" onClick={handleToggleMorning} >{showMorning ? "Showing Morning" : "Showing Evening"}</Button> -->
		</BButtonToolbar>

</template>

<script setup>
import { ref, inject, watch, onMounted } from 'vue'
import { BButton, BButtonGroup, BButtonToolbar } from 'bootstrap-vue-next'

const activeDay = inject('activeDay')
const days = inject('weekdays')
const dayNames = ref()
const showMorning = inject('showMorning')

function mapData() {
	console.log('watching days, val:')
	console.log(days.value)
	if (!activeDay.value || !days.value || !days.value.includes(activeDay.value)) return
	let dateMap = days.value.map(day => {
		let name = new Date(day).toDateString()
		name = name.substring(4, name.length - 5)
		console.log(day + ' ' + name)
		return [day, name] 
	})
	console.log('dateMap:')
	console.log(dateMap)
	dayNames.value = dateMap
	console.log(dayNames.value)
}

onMounted(() => {
	mapData()
})

watch(days, () => {
	mapData()
})

//TODO: capture click event in vue
function handleClick(timestamp) {
	console.log('old ' + activeDay.value)
	console.log('new ' + timestamp)
	// console.log(timestamp)

	activeDay.value = timestamp
}
function handleToggleMorning(event) {
	showMorning.value = !showMorning.value
}


</script>