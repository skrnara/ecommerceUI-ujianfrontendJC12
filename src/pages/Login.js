import React, {useState} from "react";
import {MDBInput, MDBBtn, MDBAlert, MDBIcon, MDBLink} from 'mdbreact';
import {connect} from 'react-redux';
import {loginUser, errorMessageClear} from './../redux/actions';
import {Redirect} from 'react-router-dom';

const Login = (props) => {
    const [data, setData]=useState({
        username:'',
        password:''
    })

    const dataOnChange=(e)=>{
        setData({...data,[e.target.name]:e.target.value})
    }

    const onFormSubmit=(e)=>{
        e.preventDefault()
        props.loginUser(data)
    }

    if(props.isLoggedIn){
        console.log(props.isLoggedIn)
        return <Redirect to='/'/>
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{paddingTop:"200px"}}>            
            <form style={{width:"35%"}} onSubmit={onFormSubmit}>
                <p className="h5 text-center mb-4">Sign in</p>
                <div className="grey-text">
                    <MDBInput onChange={dataOnChange} name='username' value={data.username} label="Type your username" icon="user" group type="text" validate error="wrong" success="right" />
                    <MDBInput onChange={dataOnChange} name='password' value={data.password} label="Type your password" icon="lock" group type="password" validate />
                </div>
                <div className="text-center">
                    {
                        props.errorMessage?
                        <MDBAlert color="danger">
                            {props.errorMessage}<MDBIcon onClick={()=>{props.errorMessageClear()}} className="float-right hoverErrorLogin mt-1" icon="times" /> 
                        </MDBAlert>
                        :
                        null
                    }
                    
                    <div className="d-flex justify-content-">
                    <p style={{textAlign:"center"}}>Not a member yet? <a href="/register" style={{color:"grey"}}>Register here.</a></p>
                    </div>
                    <MDBBtn type="submit" disabled={props.loading} color="black" className="rounded-pill">Login</MDBBtn>
                </div>
            </form>
        </div>
    )
}

const MapStateToProps=(state)=>{
    return state.Auth
}

export default connect (MapStateToProps, {loginUser, errorMessageClear})(Login);