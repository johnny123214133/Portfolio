import Chart from 'react-apexcharts'
import { useState, useEffect, useContext } from 'react'

import { ActiveDayContext, TripDataContext, ShowMorningContext } from './CommuteDataContext/CommuteDataContext.jsx'
import {TripData} from "../interfaces/TripDataInterface.ts";

export default function CommuteDurationsGraph() {
	const tripData = useContext(TripDataContext)
	const {activeDay, } = useContext(ActiveDayContext)
	const {showMorning, } = useContext(ShowMorningContext)

	const [options, setOptions] = useState(
	{
		chart : {
			toolbar : {
				show : false
			}
		},
		plotOptions : {
			bar : {
				horizontal : false
			},
		},
		title : {
			text : ('Trip Durations for '),
			align : 'center'
		},
		xaxis: {
			labels: {
				rotate: 45
			}
		}
	})

	const dummyData: {data: { x: string, y: number[]}[]}[] = [{
		data: [
			{
				x: "category 1",
				y: [40, 45, 45, 45, 60]
			}
		]
	}]

	// chart needs to be initialized with some data. without it, 
	// there's a weird bug when the first chart loaded where the evening data, 
	// and the morning data won't load for the default active day when toggled. 
	// If you change days and then return to the initial day, the chart works as expected.
	// It likely has to do with the order of state and render updates to the chart
	const [series, setSeries] = useState([{
		data: [
			{
				x: "category 1",
				y: [40, 45, 45, 45, 60]
			}
		]
	}])

	// map data from context to a format apex charts expects
	function mapData(tripsData: TripData, showMorning: boolean): {data: { x: string, y: number[]}[]}[] {
		if (!tripsData || showMorning === undefined) return dummyData
		
		let oneCommutesData = showMorning ? tripsData.morning[activeDay] : tripsData.evening[activeDay]
		let data = oneCommutesData.map(datum => {
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
		return data.length > 0 ?  [{data}] : dummyData
	}

	useEffect(() => {
		if (!tripData || !activeDay || showMorning === undefined) return
		setSeries(mapData(tripData, showMorning))
		setOptions({...options, title : {...options.title, text : ('Trip Durations (in Minutes) for ' + new Date(activeDay).toDateString())}})
	}, [tripData, activeDay, showMorning])

	return (
		<>
			{
				tripData && activeDay && options && series
				// @ts-ignore
				&& (<Chart options={options} series={series} type='boxPlot' height='300'/>)
			}
		</>
	)

}