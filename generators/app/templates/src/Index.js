import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Link as RouterLink, BrowserRouter as Router, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Link from '@material-ui/core/Link';
import { ToastContainer } from 'react-toastify'
import App from './App';
import * as serviceWorker from './serviceWorker';
import { store, persistor } from './store/configureStore'
import './index.css';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
ReactDOM.render(
	<Provider store={store}>
		<ToastContainer />
		<PersistGate loading={null} persistor={persistor}>

			<App/>
		</PersistGate>
	</Provider>, document.getElementById('root')
);

