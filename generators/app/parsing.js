const pluralize = require('pluralize')
const inflection = require('inflection')

const getAllTypes = (schemaJSON) => {
	let types = []
	for (const type in schemaJSON) {
		if (type !== "Query" && type !== "Mutation")
			types.push(schemaJSON[type])
	}
	return types
}

const getAllTypesName = (schemaJSON) => {
	let typesName = []
	for (const typeName in schemaJSON) {
		if (typeName !== "Query" && typeName !== "Mutation")
			typesName.push(typeName)
	}
	return typesName
}

const getConstantsActions = (typesName, scalarsName) => {
	let s = ""
	typesName.forEach(typeName => {

		if (!scalarsName.includes(typeName)) {
			let typeNameParsed = typeName.toUpperCase()

			s += "/* " + typeName + " */\n\n"

			s += "// Singular fetch\n"
			s += "export const " + typeNameParsed + "_LOAD_REQUEST = '" + typeNameParsed + "_LOAD_REQUEST'\n"
			s += "export const " + typeNameParsed + "_LOAD_SUCCESS = '" + typeNameParsed + "_LOAD_SUCCESS'\n"
			s += "export const " + typeNameParsed + "_LOAD_FAILURE = '" + typeNameParsed + "_LOAD_FAILURE'\n\n"

			s += "// All fetch\n"
			s += "export const ALL_" + typeNameParsed + "_LOAD_REQUEST = 'ALL_" + typeNameParsed + "_LOAD_REQUEST'\n"
			s += "export const ALL_" + typeNameParsed + "_LOAD_SUCCESS = 'ALL_" + typeNameParsed + "_LOAD_SUCCESS'\n"
			s += "export const ALL_" + typeNameParsed + "_LOAD_FAILURE = 'ALL_" + typeNameParsed + "_LOAD_FAILURE'\n\n"

			s += "// Singular add\n"
			s += "export const " + typeNameParsed + "_ADD_REQUEST = '" + typeNameParsed + "_ADD_REQUEST'\n"
			s += "export const " + typeNameParsed + "_ADD_SUCCESS = '" + typeNameParsed + "_ADD_SUCCESS'\n"
			s += "export const " + typeNameParsed + "_ADD_FAILURE = '" + typeNameParsed + "_ADD_FAILURE'\n\n"

			s += "// Singular update\n"
			s += "export const " + typeNameParsed + "_UPDATE_REQUEST = '" + typeNameParsed + "_UPDATE_REQUEST'\n"
			s += "export const " + typeNameParsed + "_UPDATE_SUCCESS = '" + typeNameParsed + "_UPDATE_SUCCESS'\n"
			s += "export const " + typeNameParsed + "_UPDATE_FAILURE = '" + typeNameParsed + "_UPDATE_FAILURE'\n\n"

			s += "// Singular delete\n"
			s += "export const " + typeNameParsed + "_DELETE_REQUEST = '" + typeNameParsed + "_DELETE_REQUEST'\n"
			s += "export const " + typeNameParsed + "_DELETE_SUCCESS = '" + typeNameParsed + "_DELETE_SUCCESS'\n"
			s += "export const " + typeNameParsed + "_DELETE_FAILURE = '" + typeNameParsed + "_DELETE_FAILURE'\n\n"
		}

	})

	return s
}

const getActionsCreators = (typesName, scalarsName) => {
	let s = ""

	typesName.forEach(typeName => {

		if (!scalarsName.includes(typeName)) {
			// Flag actions
			let typeNameLowerCase = typeName.toLowerCase()
			let typeNameUpperCase = typeName.toUpperCase()
			let typeNamePlural = pluralize.plural(typeNameLowerCase)

			s += "/* " + typeName + " */\n\n"

			s += "export const " + typeNameLowerCase + "LoadRequest = () => ({ type: Actions.ALL_" + typeNameUpperCase + "_LOAD_REQUEST })\n"
			s += "export const " + typeNameLowerCase + "LoadSuccess = (" + typeNamePlural + ") => ({ type: Actions.ALL_" + typeNameUpperCase + "_LOAD_SUCCESS, payload: " + typeNamePlural + " })\n"
			s += "export const " + typeNameLowerCase + "LoadFailure = (error) => ({ type: Actions.ALL_" + typeNameUpperCase + "_LOAD_FAILURE, err: true, payload: error})\n"

			s += "export const " + typeNameLowerCase + "LoadByIdRequest = () => ({ type: Actions." + typeNameUpperCase + "_LOAD_REQUEST })\n"
			s += "export const " + typeNameLowerCase + "LoadByIdSuccess = (" + typeNamePlural + ") => ({ type: Actions." + typeNameUpperCase + "_LOAD_SUCCESS, payload: " + typeNamePlural + " })\n"
			s += "export const " + typeNameLowerCase + "LoadByIdFailure = (error) => ({ type: Actions." + typeNameUpperCase + "_LOAD_FAILURE, err: true, payload: error})\n"

			s += "export const " + typeNameLowerCase + "AddRequest = (" + typeNameLowerCase + ") => ({ type: Actions." + typeNameUpperCase + "_ADD_REQUEST, payload: " + typeNameLowerCase + " })\n"
			s += "export const " + typeNameLowerCase + "AddSuccess = (" + typeNamePlural + ") => ({ type: Actions." + typeNameUpperCase + "_ADD_SUCCESS, payload: " + typeNamePlural + " })\n"
			s += "export const " + typeNameLowerCase + "AddFailure = (error) => ({ type: Actions." + typeNameUpperCase + "_ADD_FAILURE, err: true, payload: error})\n"

			s += "export const " + typeNameLowerCase + "UpdateRequest = (" + typeNameLowerCase + ") => ({ type: Actions." + typeNameUpperCase + "_UPDATE_REQUEST })\n"
			s += "export const " + typeNameLowerCase + "UpdateSuccess = (" + typeNamePlural + ") => ({ type: Actions." + typeNameUpperCase + "_UPDATE_SUCCESS, payload: " + typeNamePlural + " })\n"
			s += "export const " + typeNameLowerCase + "UpdateFailure = (error) => ({ type: Actions." + typeNameUpperCase + "_UPDATE_FAILURE, err: true, payload: error})\n"

			s += "export const " + typeNameLowerCase + "DeleteRequest = (id) => ({ type: Actions." + typeNameUpperCase + "_DELETE_REQUEST, payload: id })\n"
			s += "export const " + typeNameLowerCase + "DeleteSuccess = (" + typeNamePlural + ") => ({ type: Actions." + typeNameUpperCase + "_DELETE_SUCCESS, payload: " + typeNamePlural + " })\n"
			s += "export const " + typeNameLowerCase + "DeleteFailure = (error) => ({ type: Actions." + typeNameUpperCase + "_DELETE_FAILURE, err: true, payload: error})\n\n"

			// API actions
			s += `export const ` + typeNameLowerCase + `Load = () => dispatch => {

			// Flag : we're loading
			dispatch(` + typeNameLowerCase + `LoadRequest())
		
			const params = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + store.getState().session.credentials.idToken },
				body: JSON.stringify({
					query: utils.constructQuery(Queries.GET_ALL, "` + typeName + `", null)
				})
			}
		
			// Now we do the actual loading 
			fetch(APIurl, params)
			.then(res => res.json())
			.then(payload => {
				if(payload.errors)
					dispatch(` + typeNameLowerCase + `LoadFailure(payload.errors))
				else if(payload.errorMessage)
					dispatch(` + typeNameLowerCase + `LoadFailure(payload.errorMessage))
				else
					dispatch(` + typeNameLowerCase + `LoadSuccess(payload))
			})
			.catch(err => {
				dispatch(` + typeNameLowerCase + `LoadFailure(err))
			})
		
		}
		`
		s += `export const ` + typeNameLowerCase + `LoadById = (id) => dispatch => {

			// Flag : we're loading
			dispatch(` + typeNameLowerCase + `LoadByIdRequest())
		
			const params = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + store.getState().session.credentials.idToken },
				body: JSON.stringify({
					query: utils.constructQuery(Queries.GET_BY_ID, "` + typeName + `", id)
				})
			}
		
			// Now we do the actual loading 
			fetch(APIurl, params)
			.then(res => res.json())
			.then(payload => {
				if(payload.errors)
					dispatch(` + typeNameLowerCase + `LoadByIdFailure(payload.errors))
				else if(payload.errorMessage)
					dispatch(` + typeNameLowerCase + `LoadByIdFailure(payload.errorMessage))
				else
					dispatch(` + typeNameLowerCase + `LoadByIdSuccess(payload))
			})
			.catch(err => {
				dispatch(` + typeNameLowerCase + `LoadByIdFailure(err))
			})
		
		}
		`

			s += `export const ` + typeNameLowerCase + `Add = (` + typeNameLowerCase + `) => dispatch => {
	
			// Flag : we're loading
			dispatch(` + typeNameLowerCase + `AddRequest(` + typeNameLowerCase + `))
		
			const params = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + store.getState().session.credentials.idToken },
				body: JSON.stringify({
					query: utils.constructQuery(Queries.ADD, "` + typeName + `", ` + typeNameLowerCase + `)
				})
			}
		
			// Now we do the actual loading 
			fetch(APIurl, params)
			.then(res => res.json())
			.then(payload => {
				if(payload.errors)
					dispatch(` + typeNameLowerCase + `AddFailure(payload.errors))
				else if(payload.errorMessage)
					dispatch(` + typeNameLowerCase + `AddFailure(payload.errorMessage))
				else
					dispatch(` + typeNameLowerCase + `AddSuccess(payload.data.` + typeNameLowerCase + `Create))
			})
			.then(() => {
				dispatch(` + typeNameLowerCase + `Load())
			})
			.catch(err => {
				dispatch(` + typeNameLowerCase + `AddFailure(err))
			})
		}
		`
			s += `export const ` + typeNameLowerCase + `Update = (` + typeNameLowerCase + `) => dispatch => {
	
			// Flag : we're loading
			dispatch(` + typeNameLowerCase + `UpdateRequest(` + typeNameLowerCase + `))
		
			const params = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + store.getState().session.credentials.idToken },
				body: JSON.stringify({
					query: utils.constructQuery(Queries.UPDATE, "` + typeName + `", ` + typeNameLowerCase + `)
				})
			}
		
			// Now we do the actual loading 
			fetch(APIurl, params)
			.then(res => res.json())
			.then(payload => {
				if(payload.errors)
					dispatch(` + typeNameLowerCase + `UpdateFailure(payload.errors))
				else if(payload.errorMessage)
					dispatch(` + typeNameLowerCase + `UpdateFailure(payload.errorMessage))
				else
					dispatch(` + typeNameLowerCase + `UpdateSuccess(payload.data.` + typeNameLowerCase + `Update)) 
			})
			.then(() => {
				dispatch(` + typeNameLowerCase + `Load())
			})
			.catch(err => {
				dispatch(` + typeNameLowerCase + `UpdateFailure(err))
			})
		}
		`

			s += `export const ` + typeNameLowerCase + `Delete = (id) => dispatch => {

			dispatch(` + typeNameLowerCase + `DeleteRequest(id))
			const params = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + store.getState().session.credentials.idToken },
				body: JSON.stringify({
					query: utils.constructQuery(Queries.DELETE, "` + typeName + `", id)
				})
			}
		
			fetch(APIurl, params)
			.then(res => res.json())
			.then(payload => {
				if(payload.errors)
					dispatch(` + typeNameLowerCase + `DeleteFailure(payload.errors))
				else if(payload.errorMessage)
					dispatch(` + typeNameLowerCase + `DeleteFailure(payload.errorMessage))
				else
					dispatch(` + typeNameLowerCase + `DeleteSuccess(payload.data.` + typeNameLowerCase + `Delete))
			})
			.then(() => {
				dispatch(` + typeNameLowerCase + `Load())
			})
			.catch(err => {
				dispatch(` + typeNameLowerCase + `DeleteFailure(err))
			})
		}`
		}

	})
	return s
}


const getConstantsQueries = (typesName, types, scalarsName) => {

	let s = ""

	for (let index = 0; index < typesName.length; index++) {
		if (!scalarsName.includes(typesName[index])) {
			let typeNameLowerCase = typesName[index].toLowerCase()
			let typeNameUpperCase = typesName[index].toUpperCase()
			let typeNamePlural = pluralize.plural(typeNameLowerCase)
			let fields = types[index].fields

			// Get all
			s += "export const getAll" + typesName[index] + " = \"{" + typeNamePlural + "{"
			fields.forEach(field => {
				if (field.type === "ID" || field.type === "String" || field.type === "Int" || field.type === "Boolean" || scalarsName.includes(field.type))
					s += field.name + " "
				else {
					s += field.name + "{id}"
				}
			})
			s += "}}\"\n"

			// Get by id
			s += "export const get" + typesName[index] + "byId = (id) => \"{" + typeNameLowerCase + "(id: \" + id + \") {"
			fields.forEach(field => {
				if (field.type === "ID" || field.type === "String" || field.type === "Int" || field.type === "Boolean" || scalarsName.includes(field.type))
					s += field.name + " "
				else {
					s += field.name + "{id}"
				}
			})
			s += "}}\"\n"

			// Create
			s += "export const create" + typesName[index] + " = (" + typeNameLowerCase + ") => {\n"
			fields.forEach(field => {
				if (field.type !== "ID" && field.type !== "String" && field.type !== "Int" && field.type !== "Boolean" && field.isArray) {
					let childType = getTypeFromName(field.type, typesName, types)
					s += "let all" + field.name + "= \"\"\n"
					s += typeNameLowerCase + "." + field.name + ".forEach(element => {\n"
					s += "all" + field.name + " += element + \", \""
					s += "\n})\n"
				}
			})
			s += "return \"mutation {" + typeNameLowerCase + "Create("
			fields.forEach(field => {
				if (field.type === "ID" || field.type === "String" || field.type === "Int" || field.type === "Boolean" || scalarsName.includes(field.type))
					if (field.type === "String")
						s += field.name + ": \\\"\" + " + typeNameLowerCase + "." + field.name + " + \"\\\", "
					else if(field.type === "DateTime") {
						s += field.name + ": \\\"\" + (" + typeNameLowerCase + "." + field.name + " ? new Date(" + typeNameLowerCase + "." + field.name + ").toISOString(): null) + \"\\\", "
					}
					else
						s += field.name + ": \" + " + typeNameLowerCase + "." + field.name + " + \", "
				else {
					if (field.isArray)
						s += field.name + ": [\" + all" + field.name + " + \"],"
					else
						s += field.name + ": \" + (" + typeNameLowerCase + "." + field.name + " ? " + typeNameLowerCase + "." + field.name + ": null) + \", "
				}
			})
			s += ") {"
			fields.forEach(field => {
				if (field.type === "ID" || field.type === "String" || field.type === "Int" || field.type === "Boolean" || scalarsName.includes(field.type))
					s += field.name + " "
				else {
					s += field.name + "{id}"
				}
			})
			s += "}}\"\n}\n"

			// Update
			s += "export const update" + typesName[index] + " = (" + typeNameLowerCase + ") => {\n"
			fields.forEach(field => {
				if (field.type !== "ID" && field.type !== "String" && field.type !== "Int" && field.type !== "Boolean" && field.isArray) {
					let childType = getTypeFromName(field.type, typesName, types)
					s += "let all" + field.name + "= \"\"\n"
					s += typeNameLowerCase + "." + field.name + ".forEach(element => {\n"
					s += "if(element.id){ all" + field.name + " += element.id + \", \"}\n"
					s += "else {all" + field.name + " += element + \", \"}\n"
					s += "\n})\n"
				}
			})
			s += "return \"mutation {" + typeNameLowerCase + "Update("
			fields.forEach(field => {
				if (field.type === "ID" || field.type === "String" || field.type === "Int" || field.type === "Boolean" || scalarsName.includes(field.type))
					if (field.type === "String")
						s += field.name + ": \\\"\" + " + typeNameLowerCase + "." + field.name + " + \"\\\", "
					else if(field.type === "DateTime") {
						s += field.name + ": \\\"\" + (" + typeNameLowerCase + "." + field.name + " ? new Date(" + typeNameLowerCase + "." + field.name + ").toISOString(): null) + \"\\\", "
					}
					// Parsing other type of scalar here if needed
					else
						s += field.name + ": \" + " + typeNameLowerCase + "." + field.name + " + \", "
				else {
					if (field.isArray)
						s += field.name + ": [\" + all" + field.name + " + \"],"
					else
						s += field.name + ": \" + (" + typeNameLowerCase + "." + field.name + " ? " + typeNameLowerCase + "." + field.name + ": null) + \", "
				}
			})
			s += ") {"
			fields.forEach(field => {
				if (field.type === "ID" || field.type === "String" || field.type === "Int" || field.type === "Boolean" || scalarsName.includes(field.type))
					s += field.name + " "
				else {
					s += field.name + "{id}"
				}
			})
			s += "}}\"\n}\n"

			// Delete
			s += "export const delete" + typesName[index] + " = (id) => \"mutation{" + typeNameLowerCase + "Delete(id: \" + id + \") {"
			fields.forEach(field => {
				if (field.type === "ID" || field.type === "String" || field.type === "Int" || field.type === "Boolean" || scalarsName.includes(field.type))
					s += field.name + " "
				else {
					s += field.name + "{id}"
				}
			})
			s += "}}\"\n"
		}
	}

	return s

}

const getTypeFromName = (typeName, typesName, types) => {
	let type
	for (let index = 0; index < typesName.length; index++) {
		if (typesName[index] === typeName) {
			type = types[index]
			break
		}
	}
	return type
}

module.exports = {
	getAllTypes: getAllTypes,
	getAllTypesName: getAllTypesName,
	getConstantsActions: getConstantsActions,
	getConstantsQueries: getConstantsQueries,
	getActionsCreators: getActionsCreators,
}