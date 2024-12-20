import { APIProvider, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps'
import {useState, useEffect, useContext, ReactNode} from 'react'

import { RouteDataContext } from './CommuteDataContext/CommuteDataContext.jsx'

import MediaQuery from "react-responsive";
import { LG_CUTOFF } from '../utils/constants.js'
import DirectionsRenderer = google.maps.DirectionsRenderer;
import DirectionsService = google.maps.DirectionsService;

export default function GoogleMap() {
	const routeData = useContext(RouteDataContext)

	return (
		<>
			<MediaQuery minWidth={LG_CUTOFF + 1}>
				{routeData && (
					<div style={{ width : '40vw', height : '80vh'}}>
						<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
							<Map
								fullscreenControl={false}
								defaultCenter={{ lat: 40.76972, lng: -111.89056 }}
								defaultZoom={10}
								mapId={import.meta.env.VITE_COMMUTE_MAP_ID}
							>
								<Directions />
							</Map>
						</APIProvider>
					</div>
				)}
			</MediaQuery>
			<MediaQuery maxWidth={LG_CUTOFF}>
				{routeData && (
					<div style={{ width : '100%', height : '80vh'}}>
						<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
							<Map
								fullscreenControl={false}
								defaultCenter={{ lat: 40.76972, lng: -111.89056 }}
								defaultZoom={10}
								mapId={import.meta.env.VITE_COMMUTE_MAP_ID}
							>
								<Directions />
							</Map>
						</APIProvider>
					</div>
				)}
			</MediaQuery>
		</>
	)
}

function Directions(): ReactNode {
	const map = useMap()
	const routesLibrary = useMapsLibrary('routes')
	const [directionsService, setDirectionsService] = useState<DirectionsService | undefined>()
	const [directionsRenderer, setDirectionsRenderer] = useState<DirectionsRenderer | undefined>()
	const routeData = useContext(RouteDataContext)

	useEffect(() => {
		if (!map || ! routesLibrary) return
		setDirectionsService(new routesLibrary.DirectionsService())
		setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}))
	}, [map, routesLibrary])

	useEffect(() => {
		if (!directionsService || !directionsRenderer || !routeData) return
		directionsService.route({
			origin : routeData.origin.address,
			destination : routeData.destination.address,
			travelMode : google.maps.TravelMode.DRIVING,
			provideRouteAlternatives : false
		}).then(response => {
			console.log(response)
			directionsRenderer.setDirections(response)
			if (map !== null) {map.fitBounds(response.routes[0].bounds)}
		})
	}, [directionsService, directionsRenderer, routeData])

	return (
		<>
		</>
	)
}