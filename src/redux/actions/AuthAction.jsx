import Axios from 'axios'
import { 
    USER_LOGIN_START, 
    USER_LOGIN_FAILED, 
    USER_LOGIN_SUCCESS,
    USER_REGISTER_START,
    USER_REGISTER_FAILED,
    USER_REGISTER_SUCCESS,
    CHANGE_PASSWORD_START,
    CHANGE_PASSWORD_FAILED,
    CHANGE_PASSWORD_SUCCESS 
} from "./type"
import { API_URL } from '../../supports/ApiURL'

//nerima satu param object
export const loginUser=({username, password})=>{
    return (dispatch)=>{
        dispatch({type:USER_LOGIN_START})
        if(username===''||password===''){
            dispatch({type:USER_LOGIN_FAILED, payload:`Please fill all inputs correctly`})
        }
        else{            
            //cara query===
            // Axios.get(`http://localhost:2000/users?username=${data.username}&password=${data.password}`)
            Axios.get(`${API_URL}/users`,{
                params:{
                    username:username,
                    password:password
                }
            })
            .then((res)=>{
                if(res.data.length){  
                    localStorage.setItem('idUser', res.data[0].id)                  
                    dispatch({type:USER_LOGIN_SUCCESS, payload:res.data[0]})
                }
                else{
                    dispatch({type:USER_LOGIN_FAILED, payload:'username or password is not recognized'})
                }
            }).catch((err)=>{
                console.log(err)
                dispatch({type:USER_LOGIN_FAILED, payload:err.message})
            })
        }
    }
}

export const registerUser=({newUsername, newPassword, newConfirmPassword})=>{
    return(dispatch)=>{
        dispatch({type:USER_REGISTER_START})
        if(newUsername===''||newPassword===''||newConfirmPassword===''){
           dispatch({type:USER_REGISTER_FAILED, payload: `Please fill all inputs correctly`})
        }
        else if(newPassword!==newConfirmPassword){
            dispatch({type:USER_REGISTER_FAILED, payload: `Cannot confirm password. Please type new password correctly`})
        }
        else{
            Axios.get(`${API_URL}/users?username=${newUsername}`)
            .then((res)=>{
                if(res.data.length>0){
                    dispatch({type:USER_REGISTER_FAILED, payload: `Username already exist`})
                    
                }
                else{
                    dispatch({type:USER_REGISTER_SUCCESS, payload: `Registration successful`})
                    Axios.post(`${API_URL}/users`, {username:newUsername, password:newPassword, role:"user"})
                }
            })
            .catch((err)=>{
                console.log(err)
                dispatch({type:USER_REGISTER_FAILED, payload:err.message})
            })
            
        }
    }
}

export const changeUserPassword=({oldPassword, newChangedPassword, confirmNewChangedPassword}, userId)=>{
    return(dispatch)=>{
        dispatch({type:CHANGE_PASSWORD_START})
        if(oldPassword===''||newChangedPassword===''||confirmNewChangedPassword===''){
            dispatch({type:CHANGE_PASSWORD_FAILED, payload:`Please fill all inputs correctly`})

        }
        else if(newChangedPassword!==confirmNewChangedPassword){
            dispatch({type:CHANGE_PASSWORD_FAILED, payload:`Cannot confirm new password. Please type correctly`})            
        }
        else{
            Axios.get(`${API_URL}/users/${userId}`)
            .then((resToCheckUserPassword)=>{
                if(resToCheckUserPassword.data.password===oldPassword){
                    dispatch({type:CHANGE_PASSWORD_SUCCESS, payload:'Password sucessfully changed. You may login again.'})
                    Axios.patch(`${API_URL}/users/${userId}`, {password:newChangedPassword})
                    .then((resAfterChangePassword)=>{
                        
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                }
                else{
                    dispatch({type:CHANGE_PASSWORD_FAILED, payload:`Old password is not recognized`})             
                }
            })
            .catch((err)=>{
                console.log(err)
                dispatch({type:CHANGE_PASSWORD_FAILED, payload:err.message})
            })
        }
    }

}


export const changePassMessageClear=()=>{
    return{
        type:'ChangePassMessageClear'
    }
}

export const errorMessageClear=()=>{
    return {
        type:'ErrorClear'
    }
}

export const keepLogin=(data)=>{
    return{
        type:USER_LOGIN_SUCCESS,
        payload:data 
    }
}