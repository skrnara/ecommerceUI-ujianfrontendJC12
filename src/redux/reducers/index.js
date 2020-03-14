import {combineReducers} from 'redux'
import AuthReducer from './AuthReducer'
import HeaderReducer from './HeaderReducer'
import CartCounterReducer from './CartCounterReducer'

export default combineReducers({
    Auth:AuthReducer,
    Header:HeaderReducer,
    CartCount:CartCounterReducer
})