<template>
	<BContainer fluid class='px-0'>
		<BRow>
			<ToggleBar />
			<!-- <h2>ToggleBar</h2> -->
		</BRow>
		<BRow>
			<CommuteDurationsGraph />
			<!-- <h2>Graph</h2> -->
		</BRow>
		<BRow>
			<CommuteTable />
			<!-- <h2>Table</h2> -->
		</BRow>
	</BContainer>
</template>


<script setup>
import { BRow, BContainer } from 'bootstrap-vue-next'
import ToggleBar from './ToggleBar.vue'
import CommuteDurationsGraph from './CommuteDurationsGraph.vue'
import CommuteTable from './CommuteTable/CommuteTable.vue'

</script>



