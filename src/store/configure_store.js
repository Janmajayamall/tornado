import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

//importing reducers
import user_info_reducer from './user_info/reducer'

const rootReducer = combineReducers({
                        user_info:user_info_reducer,
                    })
const composed_enchancers = compose(applyMiddleware(thunk, logger))

export const store =  createStore(rootReducer, composed_enchancers)

