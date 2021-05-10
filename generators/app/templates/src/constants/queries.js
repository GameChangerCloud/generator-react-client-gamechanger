/** Describe all the basic queries */

// Keys
export const GET_ALL = "GET_ALL"
export const UPDATE = "UPDATE"
export const ADD = "ADD"
export const DELETE = "DELETE"
export const GET_BY_ID = "GET_BY_ID"

<%- include('../partials/constantsQueries.ejs',{typesName:typesName, types:types, scalarsName:scalars, pluralize: pluralize}) %>