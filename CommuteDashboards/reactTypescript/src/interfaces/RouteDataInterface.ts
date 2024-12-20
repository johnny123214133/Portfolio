export interface Location {
	id : number
	address : string
	lat : string
	lng : string
}

export interface Route {
	id : number
	origin_id : number
	dest_id : number
}

export interface RouteData {
	origin : Location
	destination : Location
	eveningRoute : Route
	morningRoute : Route
	morningTimeDelta : number[]
	eveningTimeDelta : number[]
	startDate : number
}
