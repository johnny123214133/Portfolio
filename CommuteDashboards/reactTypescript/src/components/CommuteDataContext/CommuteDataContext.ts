import commuteApi from '../../api/commuteDataAPI.ts'
import { TripData } from "../../interfaces/TripDataInterface.ts";
import { Params } from '../../interfaces/ParamsInterface.ts'
import { RouteData } from '../../interfaces/RouteDataInterface.ts'

export async function getRouteDetails(params: Params, signal: AbortSignal): Promise<RouteData> {
	try {
		console.log(Object.keys(params).length)
		// because useEffect is called twice when the component loads,
		// I need to verify my params is still in its initial state

		let details: RouteData = {
			origin: {id: 0, address: '', lat: '', lng: ''},
			destination: {id: 0, address: '', lat: '', lng: ''},
			morningRoute: {id: 0, origin_id: 0, dest_id: 0},
			eveningRoute: {id: 0, origin_id: 0, dest_id: 0},
			morningTimeDelta: [0, 0],
			eveningTimeDelta: [0, 0],
			startDate: 0
		}
		if (Object.keys(params).length == 0) return details

		console.log('here')

		return await Promise.all([
			commuteApi.getLocationByAddress(params.originAddress, signal),
			commuteApi.getLocationByAddress(params.destinationAddress, signal),
		]).then(([origin, dest]) => {
			console.log('origin and dest')
			console.log(origin)
			console.log(dest)
			details.origin = origin.data
			details.destination = dest.data
			return Promise.all([
				commuteApi.getRouteByEndpointIds(origin.data.id, dest.data.id, signal),
				commuteApi.getRouteByEndpointIds(dest.data.id, origin.data.id, signal)
			])
		}).then(([morningRoute, eveningRoute]) => {
			details.morningRoute = morningRoute.data
			details.eveningRoute = eveningRoute.data
			details.morningTimeDelta = params.morningTimeDelta
			details.eveningTimeDelta = params.eveningTimeDelta
			details.startDate = params.startDate
			return details
		})
		// })
	}
	catch (err) {
		throw err
	}
}

export async function getTrips(params: RouteData, signal:AbortSignal): Promise<TripData> {
	try {
		// because useEffect is called twice when the component loads, 
		// I need to verify my params is still in its initial state

		// if (params.route_id === undefined) return {}
		let trips: TripData = {
			morning: {},
			evening : {}
		}
		if (Object.keys(params).length == 0) return trips
		
		var startTime = params.startDate
		for (let i = 0; i < 7; i++) {
			let morningStartTime = startTime + (params.morningTimeDelta[0] * 60 + params.morningTimeDelta[1]) * 60 * 1000
			let eveningStartTime = startTime + (params.eveningTimeDelta[0] * 60 + params.eveningTimeDelta[1]) * 60 * 1000
			trips.morning[startTime] = await commuteApi.getTripsByRouteIdAndStartTime(params.morningRoute.id, morningStartTime, 10, signal).then(result => {
				return result.data
			}) // { id : params.morningRoute.id, startTime : new Date(morningStartTime), numTrips : 10 }
			trips.evening[startTime] = await commuteApi.getTripsByRouteIdAndStartTime(params.eveningRoute.id, eveningStartTime, 10, signal).then(result => {
				return result.data
			}) // { id: params.eveningRoute.id, startTime : new Date(eveningStartTime), numTrips : 10 } 
			startTime += 24*60*60*1000
		}
		return trips
	}
	catch (err) {
		throw err
	}
}