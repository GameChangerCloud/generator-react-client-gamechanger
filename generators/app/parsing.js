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

module.exports = {
	getAllTypes: getAllTypes,
	getAllTypesName: getAllTypesName,
}