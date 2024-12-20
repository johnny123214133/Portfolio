import axios from 'axios'
// import Location from '../interfaces/RouteDataInterface.ts'

const api = axios.create({
	baseURL : import.meta.env.VITE_COMMUTE_API_URL
})

export const getLocationByAddress = (address: string, signal: AbortSignal) => {
	return api.get(`/location/address/${address}`, {signal : signal})
	.catch(error => {
		console.log(error)
		throw error
	})
}
export const getRouteByEndpointIds = (originId: number, destId: number, signal: AbortSignal) => {
	return api.get(`/route/${originId}/${destId}`, {signal : signal})
	.catch(error => {
		console.log(error)
		throw error
	})
}
export const getTripsByRouteIdAndStartTime = (routeId: number, startTime: number, numTrips: number, signal: AbortSignal) => {
	return api.get(`trip/${routeId}/${startTime}/${numTrips}`, {signal : signal})
	.catch(error => {
		console.log(error)
		throw error
	})
}

const commuteApi = {
	getLocationByAddress,
	getRouteByEndpointIds,
	getTripsByRouteIdAndStartTime,
}

export default commuteApi