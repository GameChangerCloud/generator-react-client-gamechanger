const pluralize = require('pluralize')
const inflection = require('inflection')

const getAllTypes = (schemaJSON) => {
	let types = []
	for (const type in schemaJSON) {
		if (type !== "Query" && type !== "Mutation")
			types.push(schemaJSON[type])
            schemaJSON[type]["typeName"] = type
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

/**
 * From a type object, get the fields and return an array of it
 * @param {*} type 
 * @returns 
 */
 const getFields = (type) => {
    let fields = []
    for (let index = 0; index < type["fields"].length; index++) {
        fields.push(type["fields"][index])
    }
    return fields
}

// Get all directive names from the fields of a type object
const getFieldsDirectiveNames = (fields, typeObject) =>{
    let directiveNames = []
    if(typeObject.directives.length > 0){
        for( let index = 0 ; index < typeObject.directives.length; index++){
            directiveNames.push(typeObject.directives[index].name)
        }
    }
    
    for (let index = 0; index < fields.length ; index++){
        if(fields[index].directives.length > 0){
            for( let j = 0 ; j < fields[index].directives.length ; j++){
                directiveNames.push(fields[index].directives[j].name)
            }
        }
        //console.log("*********" + JSON.stringify(fields[index].directives))
    }
    return directiveNames
}

module.exports = {
	getAllTypes: getAllTypes,
	getAllTypesName: getAllTypesName,
	getFields : getFields,
	getFieldsDirectiveNames: getFieldsDirectiveNames
}