import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'

import MediaQuery from 'react-responsive'

import { Params } from '../../interfaces/ParamsInterface.ts'

import { HOUR_TO_MINUTES, MINUTE_TO_MILLISECONDS, LG_CUTOFF } from '../../utils/constants.ts'

import './NavBar.css'

import {useState, useContext, Dispatch, SetStateAction} from 'react'
import { RouteParamsContext } from '../CommuteDataContext/CommuteDataContext.tsx'

export default function NavBar() {
	const setParams: Dispatch<SetStateAction<Params | null>> = useContext(RouteParamsContext)

	const [morningTime, setMorningTime] = useState<string>('')
	const [eveningTime, setEveningTime] = useState<string>('')
	const [startDate, setStartDate] = useState<string>('')

	const [input, setInput] = useState<Params>({
		originAddress: '',
		destinationAddress: '',
		startDate: new Date().setHours(0, 0, 0, 0),
		morningTimeDelta: [0, 0],
		eveningTimeDelta: [0, 0]
	})

	function handleOriginChange(event: { target: { value: any } }) {
		setInput({...input, originAddress: event.target.value})
	}

	function handleDestinationChange(event: { target: { value: any } }) {
		setInput({...input, destinationAddress: event.target.value})
	}

	function handleDateChange(event: { target: { value: any } }) {
		var dateString = event.target.value
		setStartDate(event.target.value)
		var components = dateString.split('-')
		dateString = [components[1], components[2], components[0]].join('-')
    setInput({...input, startDate : new Date(dateString).getTime()})
	}

	function handleMorningTimeChange(event: { target: { value: any } }) {
		setMorningTime(event.target.value)
		var components = event.target.value.split(':')
		components = components.map((item: string) => {return Number(item)})
		setInput({...input, morningTimeDelta : components})
	}

	function handleEveningTimeChange(event: { target: { value: any } }) {
		setEveningTime(event.target.value)
		var components = event.target.value.split(':')
		components = components.map((item: string) => {return Number(item)})
		setInput({...input, eveningTimeDelta : components})
	}

	function adjustTime(startTime: number, timeDelta: number[]) {
		return startTime + (timeDelta[0] * HOUR_TO_MINUTES + timeDelta[1]) * MINUTE_TO_MILLISECONDS
	}

	function validateInput() {
		if (input.originAddress.length < 1) {
			throw 'Origin address must be a string of length greater than 0.'
		}
		if (input.destinationAddress.length < 1) {
			throw 'Destination address must be a string of length greater than 0.'
		}
		if (input.startDate < new Date().setHours(0, 0, 0, 0)) {
			throw 'Start date must be today or a future date.'
		}
		if (adjustTime(input.startDate, input.morningTimeDelta) < new Date().getTime()) {
			throw 'Morning start date and time must be now or in the future.'
		}
		if (adjustTime(input.startDate, input.eveningTimeDelta) < new Date().getTime()) {
			throw 'Evening start date and time must be now or in the future.'
		}
		if (input.morningTimeDelta[0] > input.eveningTimeDelta[0] || 
			(input.morningTimeDelta[0] == input.eveningTimeDelta[0] && 
				input.morningTimeDelta[1] > input.eveningTimeDelta[0])
		) {
			throw 'Morning start time must not be later than evening start time.'
		}
	}

	function handleSubmit(event: { preventDefault: () => void }) {
		try {
			event.preventDefault()
			console.log(input)
			validateInput()
			setParams(input)
		} 
		catch (err) {
			alert(err)
		}
	}

	return (
		<>
		{/* full width */}
			<MediaQuery minWidth={LG_CUTOFF + 1}>
				<Navbar className="p-0 bg-white" sticky="top" expand="lg">
					{/*<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">*/}
					<Stack className="pt-4 px-2 bg-white" direction="vertical">
						<Row>
							<Col md={6}>
								<Form.Group as={Row} className="mb-1" controlId="originInput">
									<Form.Label column sm={4} md={4}>
										<b>Origin Address</b>
									</Form.Label>
									<Col sm={8} md={8}>
										<Form.Control type="text" value={input.originAddress} onChange={handleOriginChange} placeholder="1234 Main St. Anytown, US" />
									</Col>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Row>
									<Col md={7}>
										<Form.Group as={Row} className="mb-1" controlId="morningStartTimeInput">
											<Col sm={8} md={7}>
												<Form.Label column >
													<b>Morning Start Time</b>
												</Form.Label>
											</Col>
											<Col sm={4} md={5}>
												<Form.Control type="time" value={morningTime} onChange={handleMorningTimeChange} />
											</Col>
										</Form.Group>
									</Col>
									<Col md={5}>
										<Form.Group as={Row} className="mb-1" controlId="startDateInput">
											<Col sm={6} md={5}>
												<Form.Label column >
													<b>Start Date</b>
												</Form.Label>
											</Col>
											<Col sm={6} md={7}>
												<Form.Control type="date" value={startDate} onChange={handleDateChange} />
											</Col>
										</Form.Group>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className="my-2">
							<Col md={6}>
								<Form.Group as={Row} className="mb-1" controlId="destinationInput">
									<Col sm={4} md={4}>
										<Form.Label column >
											<b>Destination Address</b>
										</Form.Label>
									</Col>
									<Col sm={8} md={8}>
										<Form.Control type="text" value={input.destinationAddress} onChange={handleDestinationChange} placeholder="5678 Center St. Anytown, US" />
									</Col>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Row>
									<Col md={7}>
										<Form.Group as={Row} className="mb-1" controlId="eveningStartTimeInput">
											<Col sm={8} md={7}>
												<Form.Label column >
													<b>Evening Start Time</b>
												</Form.Label>
											</Col>
											<Col sm={4} md={5}>
												<Form.Control type="time" value={eveningTime} onChange={handleEveningTimeChange} />
											</Col>
										</Form.Group>
									</Col>
									<Col md={5} className="align-middle">
										<Stack direction="horizontal" className="mb-1">
											<Button className="ms-auto" variant="secondary" onClick={handleSubmit}>
												Submit
											</Button>
										</Stack>
									</Col>
								</Row>
							</Col>
						</Row>
					</Stack>
					{/*</Navbar.Collapse>*/}
				</Navbar>

			</MediaQuery>


			{/* hamburger */}
			<MediaQuery maxWidth={LG_CUTOFF}>
				<Navbar className="px-3 pt-3 bg-white" sticky="top" expand="lg">
					<Container fluid>
						<Navbar.Brand>Commute Dashboard</Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav">
						<Stack className="mb-2 px-2 bg-white" direction="vertical">
							<Form.Group className="mb-1" controlId="originInput">
								<Form.Label><b>Origin Address</b></Form.Label>
								<Form.Control type="text" value={input.originAddress} onChange={handleOriginChange} placeholder="1234 Main St. Anytown, US" />
							</Form.Group>
							<Form.Group className="mb-1" controlId="destinationInput">
								<Form.Label><b>Destination Address</b></Form.Label>
								<Form.Control type="text" value={input.destinationAddress} onChange={handleDestinationChange} placeholder="5678 Center St. Anytown, US" />
							</Form.Group>
							<Form.Group className="mb-1" controlId="morningStartTimeInput">
									<Form.Label ><b>Morning Start Time</b></Form.Label>
									<Form.Control type="time" value={morningTime} onChange={handleMorningTimeChange} />
							</Form.Group>					
							<Form.Group className="mb-1" controlId="eveningStartTimeInput">
									<Form.Label ><b>Evening Start Time</b></Form.Label>
									<Form.Control type="time" value={eveningTime} onChange={handleEveningTimeChange} />
							</Form.Group>
							<Form.Group className="mb-1" controlId="startDateInput">
								<Form.Label ><b>Start Date</b></Form.Label>
								<Form.Control type="date" value={startDate} onChange={handleDateChange} />
							</Form.Group>
							<Button className="mt-2" variant="secondary" onClick={handleSubmit}>
								Submit
							</Button>
						</Stack>
						</Navbar.Collapse>
					</Container>
				</Navbar>
			</MediaQuery>
		</>
	)
}
