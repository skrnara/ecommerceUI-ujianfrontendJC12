import React, { useState } from 'react';
import { MDBBtn, MDBInput, MDBAlert, MDBIcon } from 'mdbreact';
import Axios from 'axios';
import { API_URL} from './../supports/ApiURL'

const Register = () => {
    const[registerData, setRegisterData]=useState({
        newUsername:'',
        newPassword:'',
        newConfirmPassword:''
    })

    const dataOnChange=(e)=>{
       setRegisterData({...registerData, [e.target.name]:e.target.value})
    }

    const onRegisterFormSubmit=(e)=>{
        e.preventDefault()
        Axios.get(`${API_URL}/users`)
        .then((res)=>{
            console.log(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center" style={{paddingTop:"200px"}}>            
                <form style={{width:"35%"}} onSubmit={onRegisterFormSubmit}>
                    <p className="h5 text-center mb-4">Register</p>
                    <div className="grey-text">
                        <MDBInput onChange={dataOnChange} name='newUsername' value={registerData.newUsername} label="Type your username" icon="user" group type="text" validate error="wrong" success="right" />
                        <MDBInput onChange={dataOnChange} name='newPassword' value={registerData.newPassword} label="Type your password" icon="lock" group type="password" validate />
                        <MDBInput onChange={dataOnChange} name='newConfirmPassword' value={registerData.newConfirmPassword} label="Confirm your password" icon="lock" group type="password" validate />
                    </div>
                    <div className="text-center">                        
                        <MDBBtn type="submit" disabled="" color="black" className="rounded-pill">Submit</MDBBtn>
                    </div>
                </form>
            </div>            
        </>
    )
}

export default Register;
