var ejs = require('ejs')
var chai = require('chai')

chai.use(require('chai-string'))
chai.use(require('chai-as-promised'))
var should = chai.should()

var pluralize = require('pluralize')
var inflection = require('inflection')
const scalars = []

const typesName = ['Employe', 'Work']

const types = [
  {
    type: 'ObjectTypeDefinition',
    description: undefined,
    fields: [
      {
        name: 'id',
        arguments: [],
        isDeprecated: false,
        noNull: true,
        isArray: false,
        noNullArrayValues: false,
        type: 'ID',
      },
      {
        name: 'email',
        arguments: [],
        isDeprecated: false,
        noNull: true,
        isArray: false,
        noNullArrayValues: false,
        type: 'String',
      },
      {
        name: 'firstName',
        arguments: [],
        isDeprecated: false,
        noNull: false,
        isArray: false,
        noNullArrayValues: false,
        type: 'String',
      },
      {
        name: 'lastName',
        arguments: [],
        isDeprecated: false,
        noNull: false,
        isArray: false,
        noNullArrayValues: false,
        type: 'String',
      },
      {
        name: 'login',
        arguments: [],
        isDeprecated: false,
        noNull: true,
        isArray: false,
        noNullArrayValues: false,
        type: 'String',
      },
      {
        name: 'password',
        arguments: [],
        isDeprecated: false,
        noNull: true,
        isArray: false,
        noNullArrayValues: false,
        type: 'String',
      },
      {
        name: 'workInfo',
        arguments: [],
        isDeprecated: false,
        noNull: false,
        isArray: false,
        noNullArrayValues: false,
        type: 'Work',
      },
    ],
    values: [],
    types: [],
    implementedTypes: [],
  },
]

const expectedType = types[0]

describe('partials/utils', function () {
  describe('partials/parseNameField', function () {
    const filename = './generators/app/templates/src/partials/utils/parseNameField.ejs'
    it('should render email field', function () {
      return ejs.renderFile(filename, { field: types[0].fields[1] }).should.eventually.equal("'isEmail' ,, 'You need to put a valid email : myemail@example.fr'")
    })
    it('should render lastName field', function () {
      return ejs.renderFile(filename, { field: types[0].fields[3] }).should.eventually.equal("'matchRegexp:^[a-zA-Z]+$' ,, 'You need to put a valid name : only alphabet'")
    })
  })
  describe('partials/validatorsError', function () {
    const filename = './generators/app/templates/src/partials/utils/validatorsError.ejs'
    it('should render validators for email', function () {
      return ejs
        .renderFile(filename, { field: types[0].fields[1] })
        .should.eventually.equalIgnoreSpaces("validators={['required', 'isEmail' ]}errorMessages={['this field is required',  'You need to put a valid email : myemail@example.fr']}")
    })
    it('should render validators for name', function () {
      return ejs
        .renderFile(filename, { field: types[0].fields[2] })
        .should.eventually.equalIgnoreSpaces("validators={['matchRegexp:^[a-zA-Z]+$' ]}errorMessages={[ 'You need to put a valid name : only alphabet']}")
    })
  })
})

describe('partials', function () {
  describe('partials/columnsForTable', function () {
    const filename = './generators/app/templates/src/partials/columnsForTable.ejs'
    it('should render all columns for table', function () {
      return ejs.renderFile(filename, { type: types[0], inflection: inflection, scalars: scalars }).should.eventually.equalIgnoreSpaces(`{title: "Id", field: "id" }, 
        {title: "Email", field: "email" }, 
        {title: "Firstname", field: "firstName" },
        {title: "Lastname", field: "lastName" },
        {title: "Login", field: "login" }, 
        {title: "Password", field: "password" }, 
        {title: "Workinfo", field: "workInfo", 
        render: rowData => {if(rowData.workInfo && rowData.workInfo.id) return rowData.workInfo.id }}`)
    })
  })
})
