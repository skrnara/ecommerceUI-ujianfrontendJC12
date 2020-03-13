import {combineReducers} from 'redux'
import AuthReducer from './AuthReducer'
import HeaderReducer from './HeaderReducer'

export default combineReducers({
    Auth:AuthReducer,
    Header:HeaderReducer
})