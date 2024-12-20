import {
	FC,
	useState,
	useEffect,
	createContext,
	useRef,
	Context,
	MutableRefObject,
	Dispatch,
	SetStateAction
} from 'react'
import { getRouteDetails, getTrips } from './CommuteDataContext.ts'
import { RouteData } from '../../interfaces/RouteDataInterface.ts'
import { TripData } from '../../interfaces/TripDataInterface.ts'
import {Params} from "../../interfaces/ParamsInterface.ts";

interface ShowMorningContext {
	showMorning : boolean,
	// setShowMorning : (showMorning : boolean | null) => void
	setShowMorning: Dispatch<SetStateAction<boolean>>
}

interface ActiveDayContext {
	activeDay : number,
	// setShowMorning : (showMorning : boolean | null) => void
	setActiveDay: Dispatch<SetStateAction<number>>
}

export const RouteParamsContext : Context<Dispatch<SetStateAction<Params | null>>> = createContext<Dispatch<SetStateAction<Params | null>>>(() => {})
export const RouteDataContext : Context<RouteData | null> = createContext<RouteData | null>(null)
export const ShowMorningContext : Context<ShowMorningContext> = createContext<ShowMorningContext>({showMorning: true, setShowMorning: () => {}})
export const TripDataContext : Context<TripData | null> = createContext<TripData | null>(null)
export const WeekdaysContext : Context<number[] | null> = createContext<number[] | null>(null)
export const ActiveDayContext : Context<ActiveDayContext> = createContext<ActiveDayContext>({activeDay: Date.now(), setActiveDay: () => {}})
export const IsLoadingContext : Context<boolean | null> = createContext<boolean | null>(null)
export const ShowInstructionsContext : Context<boolean | null> = createContext<boolean | null>(null)

interface Props {
	Children: FC;
}

export default function CommuteDataContext(props : Props) {
	const [params, setParams] = useState<Params | null>(null)
	const [routeData, setRouteData] = useState<RouteData | null>(null)
	const [tripData, setTripData] = useState<TripData | null>(null)
	const [showMorning, setShowMorning] = useState<boolean>(true)
	const [weekdays, setWeekdays] = useState<number[] | null>(null)
	const [activeDay, setActiveDay] = useState<number>(Date.now())
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [showInstructions, setShowInstructions] = useState<boolean>(true)

	const abortControllerRef: MutableRefObject<AbortController> = useRef<AbortController>(new AbortController())

	const resetData = () : void => {
		setParams(null)
		setRouteData(null)
		setTripData(null)
		setWeekdays(null)
		setActiveDay(Date.now())
		setShowInstructions(true)
	}

	useEffect(() => {
		// prevent calls on initial mount, and when state gets rolled back from errors
		if (!params) return
		if (import.meta.env.VITE_GOOGLE_MAPS_API_KEY.length == 0) {
			alert('Please add a Google Maps API key to the .env file')
			return
		}
		if (import.meta.env.VITE_COMMUTE_MAP_ID.length == 0) {
			alert('Please add a Map ID to the .env file')
			return
		}

		const fetchData = async () => {
			try {
				// instantiate an abort controller to prevent race conditions
				if (abortControllerRef.current !== null) abortControllerRef.current.abort()
				abortControllerRef.current = new AbortController()
				
				// show loading message while data is loading
				setShowInstructions(false)
				setIsLoading(true)
				// fetch and set location and route details
				await getRouteDetails(params, abortControllerRef.current.signal)
				.then(data => {
					console.log('route data:')
					console.log(data)
					setRouteData(data as RouteData)
					return data
				}).then(params => {
					// fetch and set trip data for the returned routes
					return getTrips(params, abortControllerRef.current.signal)
				}).then((trips: Awaited<ReturnType<typeof getTrips>>) => {
					console.log('trips:')
					console.log(trips)
					setTripData(trips as TripData)
					// create and set state for daily charts and tables
					let days: number[] | string[] = Object.keys(trips.morning)
					days = days.map(day => parseInt(day))
					days.sort()
					setWeekdays(days)
					setActiveDay(days[0])
					setIsLoading(false)
				})
				.catch(error => {
					console.log(error)
					resetData()
					// const message = error.response.data.messages ? error.response.data.messages.join('\n') : error
					alert(error.response.data.messages.join('\n'))
				})
			}
			catch (error) {
				resetData()
				console.log(error)
				alert('Unexpected error occurred.')				
			}
			finally {
				setIsLoading(false)
			}
			return () => { if (abortControllerRef.current !== null) abortControllerRef.current.abort() }
		}
		if (!isLoading) {
			fetchData()
		}
	  // return () => { setIsLoading(false) }
	}, [params])


	return (
		<>
			<IsLoadingContext.Provider value={isLoading}>
			<ShowInstructionsContext.Provider value={showInstructions}>
			<RouteParamsContext.Provider value={setParams}>
				<RouteDataContext.Provider value={routeData}>
				<ShowMorningContext.Provider value={{showMorning, setShowMorning}}>
				<TripDataContext.Provider value={tripData}>
				<WeekdaysContext.Provider value={weekdays}>
				<ActiveDayContext.Provider value={{activeDay, setActiveDay}}>
					<props.Children />
				</ActiveDayContext.Provider>
				</WeekdaysContext.Provider>
				</TripDataContext.Provider>
				</ShowMorningContext.Provider>
				</RouteDataContext.Provider >
			</RouteParamsContext.Provider>
			</ShowInstructionsContext.Provider>
			</IsLoadingContext.Provider>
		</>
	)
}


