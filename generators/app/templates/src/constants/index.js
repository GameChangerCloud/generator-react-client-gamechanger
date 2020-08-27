import * as Actions from './actions'
import * as Queries from './queries'
import * as Types from './types'

const herokuPrefix = "https://cors-anywhere.herokuapp.com/"
export const APIurl = herokuPrefix + '' /** set API url here */
export const reduxPersistKey = '<%-Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)%>' // Use to define cache id, modify if you want something easier
export const toastIdLoad = 1
export const toastIdDone = 2
export { Actions, Queries, Types }