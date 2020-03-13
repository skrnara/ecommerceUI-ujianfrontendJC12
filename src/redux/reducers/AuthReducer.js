import {
    USER_LOGIN_START,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILED,
    USER_REGISTER_START,
    USER_REGISTER_FAILED,
    USER_REGISTER_SUCCESS 
} from './../actions/type';

const INITIAL_STATE={
    username:'',
    id:0,
    loading:false,
    isLoggedIn:false,
    errorMessage:'',
    role:'',
    registrationMessage:''

}

export default (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case USER_LOGIN_START:
            return {...state, loading:true}
        case USER_LOGIN_SUCCESS:
            return {...state, loading:false,...action.payload,isLoggedIn:true}
        case USER_LOGIN_FAILED:
            return {...state, loading:false, errorMessage:action.payload}
        
        
        case USER_REGISTER_START:
            return {...state, loading:true}
        case USER_REGISTER_FAILED:
            return {...state, loading:false, registrationMessage:action.payload}
        case USER_REGISTER_SUCCESS:
            return {...state, loading:false, registrationMessage:action.payload}
        
        
        case 'ErrorClear':
            return INITIAL_STATE
        default:
            return state
    }    
}