import { Actions, toastIdLoad, toastIdDone } from '../constants'
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const <%-typeNameLower%>Reducer = (state = [], type, payload) => {
	switch (type) {
		case Actions.<%-typeName.toUpperCase()%>_LOAD_SUCCESS: {
			let newState = payload.data.<%-typeNameLowerPlural%>.map(<%-typeNameLower%> => <%-typeNameLower%>)
			toast.dismiss(toastIdLoad)
			toast.success("Data loaded", {toastId: toastIdDone})
			return newState
			
		}

		case Actions.<%-typeName.toUpperCase()%>_DELETE_SUCCESS:
			toast.dismiss()
			toast.success("Data deleted")
			return state.filter(<%-typeNameLower%> => <%-typeNameLower%>.id !== payload.id)

		case Actions.<%-typeName.toUpperCase()%>_ADD_SUCCESS: {
			toast.dismiss()
			toast.success("Data added")
			return [
				...state.slice(0, payload.id-1),
				payload,
				...state.slice(payload.id-1)
			]
		}

		case Actions.<%-typeName.toUpperCase()%>_UPDATE_SUCCESS: {
			toast.dismiss()
			toast.success("Data updated")
			return state.map((<%-typeNameLower%>, index) => {
				if (<%-typeNameLower%>.id !== payload.id) {
					return <%-typeNameLower%>
				}
				return {
					...<%-typeNameLower%>,
					...payload
				}
			})
		}

		default:
			console.log("Reducer for <%-typeName%>: " + type + " not handled yet")
			return state
	}
}

export default <%-typeNameLower%>Reducer