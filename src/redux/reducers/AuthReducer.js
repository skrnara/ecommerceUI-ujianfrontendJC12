import {
    USER_LOGIN_START,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILED
} from './../actions/type';

const INITIAL_STATE={
    username:'',
    id:0,
    loading:false,
    isLoggedIn:false,
    errorMessage:'',
    role:''
}

export default (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case USER_LOGIN_START:
            return {...state, loading:true}
        case USER_LOGIN_SUCCESS:
            return {...state, loading:false,...action.payload,isLoggedIn:true}
        case USER_LOGIN_FAILED:
            return {...state, loading:false, errorMessage:action.payload}
        case 'ErrorClear':
            return INITIAL_STATE
        default:
            return state
    }    
}