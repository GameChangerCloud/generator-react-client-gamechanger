/** Entry point of the redux cycle  */
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Actions, toastIdLoad, toastIdDone } from '../constants'
import Spinner from "react-bootstrap/Spinner";
import React from "react";
<%entitiesName.forEach(entityName => {%>
	<%if(!scalarsName.includes(entityName)){%>import <%-entityName.toLowerCase()%>Reducer from './<%-entityName.toLowerCase()%>Reducer'<%}%>
<%})%>



// Define the state template
const initialState = {
	<%entitiesName.forEach(entityName => {%>
		<%if(!scalarsName.includes(entityName)){%><%-pluralize.plural(entityName)%>: [],<%}%>
	<%})%>
	isLoading: false
}

export const rootReducer = (state = initialState, action) => {

	let { type, payload } = action

	switch (type) {
		<%entitiesName.forEach(entityName => {%><%if(!scalarsName.includes(entityName)){%>
			case Actions.ALL_<%-entityName.toUpperCase()%>_LOAD_REQUEST:
			case Actions.<%-entityName.toUpperCase()%>_LOAD_REQUEST:
			case Actions.<%-entityName.toUpperCase()%>_ADD_REQUEST:
			case Actions.<%-entityName.toUpperCase()%>_UPDATE_REQUEST:
			case Actions.<%-entityName.toUpperCase()%>_DELETE_REQUEST:<%}%><%})%>
			if(!toast.isActive(toastIdLoad)) {
				toast.info(
				<div>Loading data ... <Spinner animation="border" role="status">
				<span className="sr-only">Loading...</span>
				</Spinner>
				</div>, {toastId: toastIdLoad, autoClose: false})
			}
			return {
				...state,
				isLoading: true
			}
		<%entitiesName.forEach(entityName => {%><%if(!scalarsName.includes(entityName)){%>
		case Actions.ALL_<%-entityName.toUpperCase()%>_LOAD_SUCCESS:
		case Actions.<%-entityName.toUpperCase()%>_LOAD_SUCCESS:
		case Actions.<%-entityName.toUpperCase()%>_DELETE_SUCCESS:
		case Actions.<%-entityName.toUpperCase()%>_ADD_SUCCESS:
		case Actions.<%-entityName.toUpperCase()%>_UPDATE_SUCCESS:
			return {
				...state,
				<%-pluralize.plural(entityName)%>: <%-entityName.toLowerCase()%>Reducer(state.<%-pluralize.plural(entityName)%>, type, payload),
				isLoading: false
			}<%}%><%})%>

		<%entitiesName.forEach(entityName => {%><%if(!scalarsName.includes(entityName)){%>
			case Actions.ALL_<%-entityName.toUpperCase()%>_LOAD_FAILURE:
			case Actions.<%-entityName.toUpperCase()%>_LOAD_FAILURE:
			case Actions.<%-entityName.toUpperCase()%>_DELETE_FAILURE:
			case Actions.<%-entityName.toUpperCase()%>_ADD_FAILURE:
			case Actions.<%-entityName.toUpperCase()%>_UPDATE_FAILURE:<%}%><%})%>

				toast.dismiss(toastIdLoad)
				let msg = payload
				if(payload[0] && payload[0].message){
				msg = payload[0].message
			}
				toast.error("Error " + msg)
			console.log("Error : " + payload)
			return {
				...state,
				isLoading: false
			}

			case Actions.SET_SESSION:
				return {
					...state,
					session: action.session,
					isLoggedIn: true
				}

			case Actions.CLEAR_SESSION:
				return {
					...state,
					session: {},
					isLoggedIn: false
				}

		default:
			console.log("Root reducer : " + type + " not handled yet")
			return state
	}
}



