import commuteApi from '../../api/index.js'

export async function getRouteDetails(params, signal) {
	try {
		console.log(Object.keys(params.value).length)
		// Don't fire off a request if the underlying params are still empty
		if (Object.keys(params).length == 0) return {}
		console.log(params.value)
		// console.log(params.value.target)
		var details = {}

		return await Promise.all([
			commuteApi.getLocationByAddress(params.value.originAddress, signal),
			commuteApi.getLocationByAddress(params.value.destinationAddress, signal),
		]).then(([origin, dest]) => {
			console.log('A')
			console.log(origin)
			console.log(dest)
			details.origin = origin.data
			details.destination = dest.data
			return Promise.all([
				commuteApi.getRouteByEndpointIds(origin.data.id, dest.data.id, signal),
				commuteApi.getRouteByEndpointIds(dest.data.id, origin.data.id, signal)
			])
		}).then(([morningRoute, eveningRoute]) => {
			console.log('B')
			console.log(morningRoute)
			console.log(eveningRoute)
			details.morningRoute = morningRoute.data
			details.eveningRoute = eveningRoute.data
			details.morningTimeDelta = params.value.morningTimeDelta
			details.eveningTimeDelta = params.value.eveningTimeDelta
			details.startDate = params.value.startDate
			return details
		})
		// })
	}
	catch (err) {
		throw err
	}
}

export async function getTrips(params, signal) {
	try {
		// Don't fire off a request if the underlying params are still empty
		console.log(params)
		if (Object.keys(params).length == 0) return {}
		// if (params.route_id === undefined) return {}

		var trips = {
			morning : {},
			evening : {}
		}
		
		var startTime = params.startDate
		console.log(startTime)
		// fetch the next week's worth of trips at the given start time
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
		return await trips
	}
	catch (err) {
		throw err
	}
}