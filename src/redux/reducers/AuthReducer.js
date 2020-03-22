import {
    USER_LOGIN_START,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILED,
    USER_REGISTER_START,
    USER_REGISTER_FAILED,
    USER_REGISTER_SUCCESS,
    CHANGE_PASSWORD_START,
    CHANGE_PASSWORD_FAILED,
    CHANGE_PASSWORD_SUCCESS 
} from './../actions/type';

const INITIAL_STATE={
    username:'',
    id:0,
    loading:false,
    isLoggedIn:false,
    errorMessage:'',
    role:'',
    registrationMessage:'',
    successRegistrationMessage:'',
    changePassMessage:'',
    successChangePasswordMessage:''
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
            return {...state, loading:false, successRegistrationMessage:action.payload}
        

        case CHANGE_PASSWORD_START:
            return {...state, loading:true}
        case CHANGE_PASSWORD_FAILED:
            return {...state, loading:false, changePassMessage:action.payload}
        case CHANGE_PASSWORD_SUCCESS:
            return {...state, loading:false, successChangePasswordMessage:action.payload}
            
        
        case 'ChangePassMessageClear':
            return {...state, changePassMessage:''}
        case 'ErrorClear':
            return INITIAL_STATE
        default:
            return state
    }    
}