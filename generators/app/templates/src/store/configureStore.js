/* eslint-disable */
import { rootReducer } from '../reducers'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { reduxPersistKey } from '../constants'

const persistConfig = {
	key: reduxPersistKey,
	storage: storage,
	blacklist: ['isLoading']
};

const loggerMiddleware = createLogger()
const pReducer = persistReducer(persistConfig, rootReducer);
const middleware = applyMiddleware(
	thunkMiddleware, // lets us dispatch() functions
	loggerMiddleware, // neat middleware that logs actions
);

export const store = createStore(
	pReducer,
	middleware,
)

export const persistor = persistStore(store)