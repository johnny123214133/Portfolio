export interface Trip {
	id : number
	route_id : number
	start_time : number
	best_duration : number
	avg_duration : number
	worst_duration : number
}

export interface OneWeeksTrips {
	[key : number] : Trip[]
}

export interface TripData {
	morning : OneWeeksTrips
	evening : OneWeeksTrips
}