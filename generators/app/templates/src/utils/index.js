import { Queries, Types } from '../constants'

export const constructQuery = (queryType, entityType, params = null) => {

	switch (entityType) {
	<% typesName.forEach(typeName => {%>
		<%if(!scalarsName.includes(typeName)){%>
		case Types.<%-typeName%>:
		switch (queryType) {
		case Queries.GET_ALL:
			return Queries.getAll<%-typeName%>

		case Queries.GET_BY_ID:
			return Queries.get<%-typeName%>byId(params)

			case Queries.ADD:
			return Queries.create<%-typeName%>(params)

		case Queries.DELETE:
			return Queries.delete<%-typeName%>(params)

		case Queries.UPDATE:
			return Queries.update<%-typeName%>(params)

		default:
			console.log("Invalid query construction")
			break
		}	
		break
		<%}%>	
	<%})%>
	default:
		console.log("Invalid type")
break
}
}