import Axios from 'axios'
import { 
    USER_LOGIN_START, 
    USER_LOGIN_FAILED, 
    USER_LOGIN_SUCCESS,
    USER_REGISTER_START,
    USER_REGISTER_FAILED,
    USER_REGISTER_SUCCESS 
} from "./type"
import { API_URL } from '../../supports/ApiURL'

//nerima satu param object
export const loginUser=({username, password})=>{
    return (dispatch)=>{
        dispatch({type:USER_LOGIN_START})
        if(username===''||password===''){
            dispatch({type:USER_LOGIN_FAILED, payload:`fill all blanks pls`})
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
            dispatch({type:USER_REGISTER_FAILED, payload: `pls fill all input correctly`})
        }
        else if(newPassword!==newConfirmPassword){
            dispatch({type:USER_REGISTER_FAILED, payload: `Cannot confirm password, please type new password correctly`})
        }
        else{
            Axios.get(`${API_URL}/users`)
            .then((res)=>{
                var toCheckUsername=res.data
                toCheckUsername.forEach((val)=>{
                    // console.log(val.username)
                    // console.log(newUsername)
                    if(newUsername===val.username){
                        return dispatch({type:USER_REGISTER_FAILED, payload:`username already exist, pick a new one`})
                    } 
                    // else if(newUsername!==val.username){
                    //     return(
                    //         Axios.post(`${API_URL}/users`, {username:newUsername, password:newPassword, role:"user"})
                    //         .then((res)=>{
    
                    //         })
                    //         .catch((err)=>{
                    //             console.log(err)
                    //         })
                        
                    //     )
                        

                    // }
                })
            })
            .catch((err)=>{
                console.log(err)
                dispatch({type:USER_REGISTER_FAILED, payload:err.message})
            })
            
        }
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