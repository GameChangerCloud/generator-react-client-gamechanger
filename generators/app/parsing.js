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

			s += "export const " + typeNameLowerCase + "LoadRequest = () => ({ type: Actions." + typeNameUpperCase + "_LOAD_REQUEST })\n"
			s += "export const " + typeNameLowerCase + "LoadSuccess = (" + typeNamePlural + ") => ({ type: Actions." + typeNameUpperCase + "_LOAD_SUCCESS, payload: " + typeNamePlural + " })\n"
			s += "export const " + typeNameLowerCase + "LoadFailure = (error) => ({ type: Actions." + typeNameUpperCase + "_LOAD_FAILURE, err: true, payload: error})\n"

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


const getColumnsForTable = (type, scalarsName) => {
	let s = ''

	type.fields.forEach(field => {
		s += '{title: "' + inflection.capitalize(field.name) + '", field: "' + field.name
		if (field.type === "ID" || field.type === "String" || field.type === "Int" || field.type === "Boolean" || scalarsName.includes(field.type)) {

			switch(field.type) {

				case "Boolean": 
				s += '", type: \'boolean\' }, '
				break

				case "Date":
				case "DateTime":
				case "Time":
				s +=	'", render: rowData => {if(rowData.' + field.name + ') return new Date(rowData.' + field.name + ').toString()}}, '
				break

				default:
					s += '" }, '
					break
			}
		}
		else {
			if (field.isArray) {
				s += '", render: rowData => constructArrayOfId(rowData.' + field.name + ') }, '
			}
			else {
				s += '", render: rowData => {if(rowData.' + field.name + ' && rowData.' + field.name + '.id) return rowData.' + field.name + '.id }}, '
			}
		}
	})

	return s.substring(0, s.lastIndexOf(', '))
}

const parseNameField = (field) => {
	if(field.name.toLowerCase().includes('mail')){
		return ['isEmail', 'You need to put a valid email : myemail@example.fr']
	}
	if(field.name.toLowerCase().includes('lastname')
	|| field.name.toLowerCase().includes('firstname')){
		return ['matchRegexp:^[a-zA-Z]+$', 'You need to put a valid name : only alphabet']
	}
	if(field.name.toLowerCase().includes('login')
		|| field.name.toLowerCase().includes('username')){
		return ['matchRegexp:^[a-zA-Z0-9_\.-]+$', 'You need to put a valid username : alphanumerics, "_", "-", "."']
	}
	if(field.type === 'Int'){
		return ['matchRegexp:^[0-9]+$', 'You must put a number']
	}
	return undefined
}

const getValidatorsError = (field) => {
	let validator = '['
	let errors = '['
	if(field.noNull){
		validator += "'required', "
		errors += "'this field is required', "
	}
	let valid_err = parseNameField(field)
	if(valid_err !== undefined) {
		validator += "'" + valid_err[0] + "'"
		errors += "'" + valid_err[1] + "'"
	}
	else{
		if(validator.includes(',')) {
			validator = validator.substring(0, validator.lastIndexOf(','))
		}
		if(errors.includes(',')){
			errors = errors.substring(0, errors.lastIndexOf(','))
		}
	}
	validator += "]"
	errors += "]"
	if(validator === '[]'){
		return ''
	}
	return "validators={" + validator + "}\nerrorMessages={" + errors + "}"
}

const getListOfValidators = (type, scalarsName) => {
	let s = ''

	type.fields.forEach(field => {
		let help = ""
		if (field.noNull) {
			help = `helperText="Not null"`
		}
		help += getValidatorsError(field)
		if(field.type !== "ID"){
		if (field.type === "String" || field.type === "Int" || field.type === "Boolean" || scalarsName.includes(field.type)) {
			switch(field.type) {

				case "Boolean":
					s += ` <br/>
            ${field.name} :`
				if (field.noNull) {
					s += "(Not null)"
				}
				s += `
            <br/>
            <RadioGroup aria-label="${field.name}" name="${field.name}" value={this.state.${field.name}} onChange={e => this.handleChange(e)}>
                <FormControlLabel value={true} control={<Radio />} label="True" checked={this.state.${field.name}} />
                <FormControlLabel value={false} control={<Radio />} label="False" checked={!this.state.${field.name}}/>
            </RadioGroup>`
					break
				
				case "Date":
				case "DateTime":
				case "Time": 
				s += `<p><b>${field.name} : {this.state.${field.name} ?this.formatDate(this.state.${field.name}) : 'pick a date'}</b></p>

				<Calendar
				onChange={e => this.onChangeDate(e, "${field.name}") }
				value={this.state.${field.name} ? new Date(this.state.${field.name}) : null}
				/>
				<br/>`
					break

				case "HexColorCode":
				case "RGB":
				case "RGBA":
				case "HSL":
				case "HSLA":
					s += `<p><b>${field.name}</b></p>
					<div style={{display: "flex", justifyContent: "center"}}>
					<ChromePicker
            color={this.state.${field.name}}
            onChange = {(e) => this.onChangeColor(e, "${field.name}", "${field.type}")}
						/>
					</div>
					<br/>`
					break

				default:
					s += `<TextValidator
						onChange={this.handleChange}
						label="${field.name}"
						name="${field.name}"
						${help}
						value={this.state.${field.name}}
						
						style={{ width: 500 }}
						/>
						<br/>
						`
					break
			}
		}
		else {
			if (field.isArray) {
				s += `${field.name} :`
				if (field.noNull) {
					s += "(Not null)"
				}

				s += `

			<br/>

			<div className="choose">

				{this.getAll${field.name}().map(item=>(
				    <div>
				    <Balise${field.name}
				    value={item.value}
				    key={item.key}
				    name={item.name}
				    onChange={this.handleChange}
				    />
				    </div>
				    )
				    )}
			</div>`
			} else {
				s += `<SelectValidator
				onChange={this.handleChange}
				label="${field.name}"
				name="${field.name}"
				value={this.state.${field.name}}
				${help}
				style={{ width: 500 }}
			>
				{this.getAll${field.name}().map((field, id) => <option key={id} value={field.id}>{field.id}</option>)}
					</SelectValidator>`
			}
		}
		}
	})

	return s
}

const getBaliseForMultipleSelect = (type, scalarsName) => {
	let s = ''
	type.fields.forEach(field => {
		if (field.type !== "ID" && field.type !== "String" && field.type !== "Int" && field.type !== "Boolean" && !scalarsName.includes(field.type)) { // Temporary, until we deal with relationship
			if (field.isArray) {
				s += `const Balise${field.name} = (props) => (
			<label>
				<input
					type="checkbox"
					name="${field.name}"
					value={props.value}
					checked={this.isPresent(props.value, "${field.name}")}
					onChange={props.onChange}
				/>
				{props.name}

				<br/>
			</label>
		);`
			}
		}
	})

	return s
}


const getInitOtherEntities = (type, scalarsName) => {
	let s = ""

	type.fields.forEach(field => {
		if (field.type !== "ID" && field.type !== "String" && field.type !== "Int" && field.type !== "Boolean" && !scalarsName.includes(field.type)) {
			if (field.isArray) {
				s += `getAll${field.name}(){
				// TODO Get request
				return this.props.` + pluralize.plural(field.type.toLowerCase()) + ` ? this.props.` + pluralize.plural(field.type.toLowerCase()) + `.map(element => {
					return {...element, value: element.id, key: element.id, name: element.id}
				}) : []
		// return  [
		// { value: 'ValueA', key: 'KeyA', name: 'Name A' },
		// { value: 'ValueB', key: 'KeyB', name: 'Name B' },
		// { value: 'ValueC', key: 'KeyC', name: 'Name C' }
		// ];
	}`}
			else {
				s += `getAll${field.name}(){
	// TODO Get request
	return this.props.` + pluralize.plural(field.type.toLowerCase()) + ` ? this.props.` + pluralize.plural(field.type.toLowerCase()) + ` : []
		// return  [
		// "Choix 1", "Choix 2", "Choix 3"];
	}`
			}
		}
	})

	return s
}

const getCheckArrayFields = (type, scalarsName) => {
	let s = ""

	type.fields.forEach(field => {
		if (field.type !== "ID" && field.type !== "String" && field.type !== "Int" && field.type !== "Boolean" && !scalarsName.includes(field.type)) {
			if (field.isArray) {
				s += `e.target.name === "${field.name}" ||`
			}
		}
	})
	if (s === "") {
		s = "false"
	}
	else {
		s = s.substring(0, s.length - 2)
	}
	return s

}

const getCheckBooleanFields = (type) => {

	let s = ""

	type.fields.forEach(field => {
		if (field.type === "Boolean") {
			s += `e.target.name === "${field.name}" ||`
		}
	})
	if (s === "") {
		s = "false"
	}
	else {
		s = s.substring(0, s.length - 2)
	}
	return s
}

const getInitFieldsState = (type, scalarsName) => {
	let s = ''

	type.fields.forEach(field => {
		if(field.type !== "ID"){
		if (field.type === "String" || field.type === "Int" || field.type === "Boolean" || scalarsName.includes(field.type)) { // Temporary, until we deal with relationship
			if (field.type === "Boolean") {
				s += field.name + ": true,\n"
			}
			else if(field.type === "HexColorCode") {
				s += field.name + ": \"#fff\""
			}
			else if(field.type === "RGB" || field.type === "RGBA") {
				s += field.name + ": {r: 255, g: 255, b: 255, a: 1}"
			}
			else if(field.type === "HSL" || field.type === "HSLA") {
				s += field.name + ": {h: 255, s: 255, l: 255, a: 1}"
			}
			else {
				s += field.name + ": '',\n"
			}
		}
		else {
			if (field.isArray) {
				s += field.name + ": [],\n"
			} else {
				s += field.name + ": null,\n"
			}
		}

		}
	})

	s += `redirect: null`

	return s
}

const getRelationsFields = (type, scalarsName) => {
	let s = ''
	type.fields.forEach(field => {
		if (field.type !== "String" && field.type !== "Int" && field.type !== "Boolean" && field.type !== "ID" && !scalarsName.includes(field.type)) {
			if (field.isArray) {
				s += "," + field.name + ": this.props.location.state." + field.name + " ? this.props.location.state." + field.name + ".map(element => element.id) : []"
			}
			else {
				s += "," + field.name + ": this.props.location.state." + field.name + " ? this.props.location.state." + field.name + ".id : null"
			}
		}
	})
	return s
}


const getRouterImports = (typesName, scalarsName) => {
	
	let s = ""
	typesName.forEach(typeName => {
		if(!scalarsName.includes(typeName) ) {
			let currentTypeName = typeName
			let pluralName = pluralize.plural(currentTypeName)
			s += "import Connect" + pluralName + "List from './containers/Connect" + pluralName + "List'\n"
			s += "import ConnectCreate" + typeName + " from './containers/ConnectCreate" + typeName + "'\n"
			s += "import ConnectUpdate" + typeName + " from './containers/ConnectUpdate" + typeName + "'\n"
		}
	})
	s += "import AppHTTP from \"./components/Table\"\n"
	s += "import ConnectHome from \"./containers/ConnectHome\"\n"
	s += "import ConnectCallback from \"./components/Callback\""
	return s
}

const getEndpointURL = () => {
	return 'Not Available yet'
}

const getGraphqlSchema = (schemaJSON) => {
	let s = "";
	schemaJSON = schemaJSON.replace(/{/g, '{"{"}')

	let tab = schemaJSON.split("\n")
	for (let i = 0; i < tab.length; i++) {
		s += "<br/>" + tab[i] + "\n"
	}

	return s;
}

const getLinksForTypes = (typesName, scalarsName) => {
	let s = ""
	typesName.forEach(typeName => {
		if(!scalarsName.includes(typeName)) {
			let currentTypeName = typeName
			let pluralName = pluralize.plural(currentTypeName)
			s += "<LinkContainer to=\"/" + pluralName + "\"><Dropdown.Item>" + pluralName + "</Dropdown.Item></LinkContainer>"
		}
	})
	return s
}

const getRoutesForTypes = (typesName, scalarsName) => {
	let s = ""
	typesName.forEach(typeName => {
		if(!scalarsName.includes(typeName)) {
			let currentTypeName = typeName
			let pluralName = pluralize.plural(currentTypeName)
			s += "<PrivateRoute path=\"/" + pluralName + "\" isLoggedIn={this.props.isLoggedIn} component={Connect" + pluralName + "List} />\n"
			s += "<PrivateRoute path=\"/Create" + currentTypeName + "\" isLoggedIn={this.props.isLoggedIn} component={ConnectCreate" + currentTypeName + "} />\n"
			s += "<PrivateRoute path=\"/Update" + currentTypeName + "\" isLoggedIn={this.props.isLoggedIn} component={ConnectUpdate" + currentTypeName + "} />\n"
		}
	})
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

const getStateFieldRelation = (type, scalarsName) => {
	let s = ""
	type.fields.forEach(field => {
		if (field.type !== "ID" && field.type !== "String" && field.type !== "Int" && field.type !== "Boolean" && !scalarsName.includes(field.type)) {
			s += pluralize.plural(field.type.toLowerCase()) + ": state." + pluralize.plural(field.type) + ","
		}
	})
	return s.substring(0, s.lastIndexOf(','))
}

module.exports = {
	getAllTypes: getAllTypes,
	getAllTypesName: getAllTypesName,
	getConstantsActions: getConstantsActions,
	getConstantsQueries: getConstantsQueries,
	getActionsCreators: getActionsCreators,
	getColumnsForTable: getColumnsForTable,
	getRelationsFields: getRelationsFields,
	getRouterImports: getRouterImports,
	getLinksForTypes: getLinksForTypes,
	getRoutesForTypes: getRoutesForTypes,
	getInitFieldsState: getInitFieldsState,
	getListOfValidators: getListOfValidators,
	getInitOtherEntities: getInitOtherEntities,
	getBaliseForMultipleSelect: getBaliseForMultipleSelect,
	getCheckArrayFields: getCheckArrayFields,
	getCheckBooleanFields: getCheckBooleanFields,
	getGraphqlSchema: getGraphqlSchema,
	getEndpointURL: getEndpointURL,
	getStateFieldRelation: getStateFieldRelation

}
