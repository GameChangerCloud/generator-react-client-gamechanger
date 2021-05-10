/** Describe all the actions creators */

import { Actions, APIurl, Queries } from '../constants'
// import fetch from 'cross-fetch'
import * as utils from '../utils'
import {store} from '../store/configureStore'

<%- include('../partials/actionsCreators.ejs',{typesName:typesName, scalarsName:scalarsName}) %>