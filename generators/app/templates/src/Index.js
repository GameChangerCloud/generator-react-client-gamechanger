import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'
import App from './App';
import { store, persistor } from './store/configureStore'
import './index.css';

ReactDOM.render(
	<Provider store={store}>
		<ToastContainer />
		<PersistGate loading={null} persistor={persistor}>

			<App/>
		</PersistGate>
	</Provider>, document.getElementById('root')
);

