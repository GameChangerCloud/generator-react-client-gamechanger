const Generator = require('yeoman-generator');
const pluralize = require('pluralize')
const parsing = require('./parsing')
const easygraphqlSchemaParser = require('easygraphql-parser')
const inflection = require('inflection')
const fs = require('fs')
const constants = require('./constants');

const isFileSync = (aFile) => {
	try {
		return fs.statSync(aFile).isFile();
	} catch (e) {
		if (e.code === 'ENOENT') {
			return false;
		} else {
			throw e;
		}
	}
}


module.exports = class extends Generator {

	// The name `constructor` is important here
	constructor(args, opts) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts)
		// Getting the graphql schema as an argument
		this.argument("graphqlFile", { type: String, required: true });
	}

	/** Lifecycle of the generator : methods are executed in this order unless mentionned otherwise */

	//Your initialization methods (checking current project state, getting configs, etc)
	initializing() {
		this.log("Initializing")
	}

	// Saving configurations and configure the project
	configuring() {
		this.log("Configuring")
		this.defaultScalars = []
		for (const scalarName in constants) {
			if (constants.hasOwnProperty(scalarName)) {
				this.defaultScalars.push(constants[scalarName])
			}
		}
	}

	// Get the graphql file
	reading() {
		this.log("Reading")
		if (this.options.graphqlFile) {
			if (this.options.graphqlFile.includes('.graphql')) {
				this.log("Fetching schema from " + this.options.graphqlFile)
				try {
					this.schema = this.fs.read(this.options.graphqlFile)
				} catch (error) {
					this.log(error)
					exit(1)
				}

				// Parsing as a JSON object
				this.schemaJSON = easygraphqlSchemaParser(this.schema)
			}
			else {
				throw new Error("Invalid graphql file")
			}
		}
		else {
			throw new Error("Required graphql schema not found")
		}

	}

	// If the method name doesn’t match a priority, it will be pushed to this group.
	default() {
		this.log("Default")
	}

	// Where you write the generator specific files (routes, controllers, etc)
	writing() {

		this.fs.writeJSON("schema.json", this.schemaJSON)

		// Get all the types and types name
		this.types = parsing.getAllTypes(this.schemaJSON)
		this.typesName = parsing.getAllTypesName(this.schemaJSON)

		// All the scalars declaration in schema
		this.scalars = []
		this.types.forEach((type, index) => {
			if (type.type === "ScalarTypeDefinition")
				this.scalars.push(this.typesName[index])
		})

		//constants/types.js
		this.fs.copyTpl(
			this.templatePath('src/constants/types.js'),
			this.destinationPath('src/constants/types.js'),
			{
				typesName: this.typesName,
				scalarsName: this.scalars
			}
		)

		//utils/index.js
		this.fs.copyTpl(
			this.templatePath('src/utils/index.js'),
			this.destinationPath('src/utils/index.js'),
			{
				typesName: this.typesName,
				scalarsName: this.scalars
			}
		)

		/**
		 * Redux logic
		 */

		//constants/actions.js
		this.fs.copyTpl(
			this.templatePath('src/constants/actions.js'),
			this.destinationPath('src/constants/actions.js'),
			{
				constantsActions: parsing.getConstantsActions(this.typesName, this.scalars)
			}
		)

		//constants/queries.js
		this.fs.copyTpl(
			this.templatePath('src/constants/queries.js'),
			this.destinationPath('src/constants/queries.js'),
			{
				constantsQueries: parsing.getConstantsQueries(this.typesName, this.types, this.scalars)
			}
		)

		// constants/index.js
		this.fs.copyTpl(
			this.templatePath('src/constants/index.js'),
			this.destinationPath('src/constants/index.js'),
		)
			
		// src/store/configureStore.js
		this.fs.copyTpl(
			this.templatePath('src/store/configureStore.js'),
			this.destinationPath('src/store/configureStore.js')
		)

		// actions/index.js
		this.fs.copyTpl(
			this.templatePath('src/actions/index.js'),
			this.destinationPath('src/actions/index.js'),
			{
				actionsCreators: parsing.getActionsCreators(this.typesName, this.scalars),
			}
		)

		// actions/session.js
		this.fs.copyTpl(
			this.templatePath('src/actions/session.js'),
			this.destinationPath('src/actions/session.js'),
		)

		// reducers/index.js

		this.fs.copyTpl(
			this.templatePath('src/reducers/index.js'),
			this.destinationPath('src/reducers/index.js'),
			{
				entitiesName: this.typesName,
				scalarsName: this.scalars,
				pluralize: pluralize
			}
		)


		/**
		 * Components / UI
		 */

		for (let index = 0; index < this.types.length; index++) {

			let currentType = this.types[index]
			let currentTypeName = this.typesName[index]

			let lowerName = currentTypeName.toLowerCase()
			let pluralName = pluralize.plural(currentTypeName)
			let lowerPluralName = pluralize.plural(lowerName)

			if (currentTypeName !== "Query" && currentTypeName !== "Mutation" && !this.scalars.includes(currentTypeName)) {

				// components/<typeNameClassPlural>List.js
				this.fs.copyTpl(
					this.templatePath('src/components/EntitiesList.js'),
					this.destinationPath('src/components/' + pluralName + 'List.js'),
					{
						typeName: currentTypeName,
						typeNameLowerPlural: lowerPluralName,
						typeNamePlural: pluralName,
						columns: parsing.getColumnsForTable(currentType, this.scalars)
					}
				)

				// components/Create<typeName>.js
				this.fs.copyTpl(
					this.templatePath('src/components/CreateEntity.js'),
					this.destinationPath('src/components/Create' + currentTypeName + '.js'),
					{
						typeName: currentTypeName,
						initFieldsState: parsing.getInitFieldsState(currentType, this.scalars),
						typeNamePlural: pluralName,
						listOfValidators: parsing.getListOfValidators(currentType, this.scalars),
						initOtherEntities: parsing.getInitOtherEntities(currentType, this.scalars),
						baliseForMultipleSelect: parsing.getBaliseForMultipleSelect(currentType, this.scalars),
						checkArrayFields: parsing.getCheckArrayFields(currentType, this.scalars),
						checkBooleanFields: parsing.getCheckBooleanFields(currentType)

					}
				)

				// components/Update<typeName>.js
				this.fs.copyTpl(
					this.templatePath('src/components/UpdateEntity.js'),
					this.destinationPath('src/components/Update' + currentTypeName + '.js'),
					{
						typeName: currentTypeName,
						typeNamePlural: pluralName,
						relationsFields: parsing.getRelationsFields(currentType, this.scalars),
						listOfValidators: parsing.getListOfValidators(currentType, this.scalars),
						initOtherEntities: parsing.getInitOtherEntities(currentType, this.scalars),
						baliseForMultipleSelect: parsing.getBaliseForMultipleSelect(currentType, this.scalars),
						checkArrayFields: parsing.getCheckArrayFields(currentType, this.scalars),
						checkBooleanFields: parsing.getCheckBooleanFields(currentType)


					}
				)

				// containers/Connect<typeNameClassPlural>List.js
				this.fs.copyTpl(
					this.templatePath('src/containers/ConnectEntitiesList.js'),
					this.destinationPath('src/containers/Connect' + pluralName + 'List.js'),
					{
						typeNameLowerPlural: lowerPluralName,
						typeNameLower: lowerName,
						typeNamePlural: pluralName,
					}
				)

				// containers/ConnectCreate<typeNameClassPlural>.js
				this.fs.copyTpl(
					this.templatePath('src/containers/ConnectCreateEntity.js'),
					this.destinationPath('src/containers/ConnectCreate' + currentTypeName + '.js'),
					{
						typeName: currentTypeName,
						typeNameLowerPlural: lowerPluralName,
						typeNameLower: lowerName,
						typeNamePlural: pluralName,
						currentType: currentType,
						scalars: this.scalars,
						pluralize: pluralize
					}
				)

				// containers/ConnectUpdate<typeNameClassPlural>.js
				this.fs.copyTpl(
					this.templatePath('src/containers/ConnectUpdateEntity.js'),
					this.destinationPath('src/containers/ConnectUpdate' + currentTypeName + '.js'),
					{
						typeName: currentTypeName,
						typeNameLowerPlural: lowerPluralName,
						typeNameLower: lowerName,
						typeNamePlural: pluralName,
						currentType: currentType,
						scalars: this.scalars,
						pluralize: pluralize
					}
				)

				// reducers/<typeNameLower>Reducer.js
				this.fs.copyTpl(
					this.templatePath('src/reducers/entityReducer.js'),
					this.destinationPath('src/reducers/' + currentTypeName.toLowerCase() + 'Reducer.js'),
					{
						typeName: currentTypeName,
						typeNameLowerPlural: lowerPluralName,
						typeNameLower: lowerName,
					}
				)


			}
		}

		// components/Table.js
		this.fs.copyTpl(
			this.templatePath('src/components/Table.js'),
			this.destinationPath('src/components/Table.js')
		)

		// components/Home.js
		this.fs.copyTpl(
			this.templatePath('src/components/Home.js'),
			this.destinationPath('src/components/Home.js'),
			{
				endpointURL: parsing.getEndpointURL(),
				graphqlSchema: parsing.getGraphqlSchema(this.schema)
			}
		)

		// src/containers/ConnectHome.js
		this.fs.copyTpl(
			this.templatePath('src/containers/ConnectHome.js'),
			this.destinationPath('src/containers/ConnectHome.js'),
			{
				typesName: this.typesName,
				scalarsName: this.scalars
			}
		)

		/**
		 * Index / router
		 */
		if (isFileSync(this.destinationPath('src/index.js'))) {
			fs.unlinkSync(this.destinationPath('src/index.js'))
		}
		if (isFileSync(this.destinationPath('src/index.css'))) {
			fs.unlinkSync(this.destinationPath('src/index.css'))
		}
		if (isFileSync(this.destinationPath('public/index.html'))) {
			fs.unlinkSync(this.destinationPath('public/index.html'))
		}
		if (isFileSync(this.destinationPath('src/App.js'))) {
			fs.unlinkSync(this.destinationPath('src/App.js'))
		}

		// src/index.js
		this.fs.copyTpl(
			this.templatePath('src/index.js'),
			this.destinationPath('src/index.js'),
		)

		// src/index.css
		this.fs.copyTpl(
			this.templatePath('src/index.css'),
			this.destinationPath('src/index.css')
		)

		// public/index.css
		this.fs.copyTpl(
			this.templatePath('public/index.html'),
			this.destinationPath('public/index.html')
		)

		// src/app.js
		this.fs.copyTpl(
			this.templatePath('src/App.js'),
			this.destinationPath('src/App.js'),
			{
				routerImports: parsing.getRouterImports(this.typesName, this.scalars),
				linksTypes: parsing.getLinksForTypes(this.typesName, this.scalars),
				routesTypes: parsing.getRoutesForTypes(this.typesName, this.scalars)
			}
		)

		

		// src/components/Callback.js
		this.fs.copyTpl(
			this.templatePath('src/components/Callback.js'),
			this.destinationPath('src/components/Callback.js'),
		)


		/**
		 * AWS Services (Cognito, S3, CloudFront)
		 */

		// lib/cognitoUtils.js
		this.fs.copyTpl(
			this.templatePath('src/lib/cognitoUtils.js'),
			this.destinationPath('src/lib/cognitoUtils.js')
		)

		// config/app-config.json
		this.fs.copyTpl(
			this.templatePath('src/config/app-config.json'),
			this.destinationPath('src/config/app-config.json')
		)

		if (isFileSync(this.destinationPath('package.json'))) {
			let json = JSON.parse(this.fs.read('package.json'))
			this.appName = json.name
			fs.unlinkSync(this.destinationPath('package.json'))
		}

		// deploy.js
		this.fs.copyTpl(
			this.templatePath('deploy.js'),
			this.destinationPath('deploy.js'),
			{
				appName: this.appName
			}
		)

		// terraform/main.tf
		this.fs.copyTpl(
			this.templatePath('terraform/main.tf'),
			this.destinationPath('terraform/main.tf'),
		)

		// terraform/bucket.tf
		this.fs.copyTpl(
			this.templatePath('terraform/bucket.tf'),
			this.destinationPath('terraform/bucket.tf'),
			{
				appName: this.appName
			}
		)

		// package.json
		this.fs.copyTpl(
			this.templatePath('package.json'),
			this.destinationPath('package.json'),
			{
				appName: this.appName
			}
		)
	}

	// Where conflicts are handled (used internally)
	conflicts() {
		this.log("Conflicts")
	}

	// Where installations are run (npm, bower)
	install() {
		this.log("Install")
		// Npm install, essential modules
		this.npmInstall(['graphql', 'react-redux', 'react-table', 'redux', 'redux-thunk', 'redux-logger', 'redux-persist', 'react-router-dom', 'material-table@1.54.2', '@material-ui/core', 'bootstrap', 'react-material-ui-form-validator', 'react-calendar', 'react-toastify', 'react-bootstrap', 'bootstrap', 'react-color', 'amazon-cognito-auth-js', 'amazon-cognito-identity-js', 'react-router-bootstrap', 'react-deploy-cli'])
	}

	// Called last, cleanup, say good bye, etc
	end() {
		this.log("End")
	}
}
