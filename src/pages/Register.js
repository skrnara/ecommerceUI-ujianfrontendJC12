import React, { useState } from 'react';
import { MDBBtn, MDBInput, MDBAlert, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import { Modal, ModalBody, Button, ModalFooter } from 'reactstrap';
import { errorMessageClear, registerUser} from './../redux/actions';
import { Redirect } from 'react-router-dom';

const Register = (props) => {
    const[registerData, setRegisterData]=useState({
        newUsername:'',
        newPassword:'',
        newConfirmPassword:''
    })

    const[moveToLogin, setMoveToLogin]=useState(false)
    const[modal, setModal]=useState(true)
    const toggle = () => setModal(!modal);
    const {className} = props;
    

    const dataOnChange=(e)=>{
       setRegisterData({...registerData, [e.target.name]:e.target.value})
    }

    const onRegisterFormSubmit=(e)=>{
        e.preventDefault()
        console.log(props.registrationMessage)
        props.registerUser(registerData)
    }

    const redirectRegisteredUserToLogin=()=>{
        setMoveToLogin(true)
        setModal(false)
    }

    if(moveToLogin){
        return <Redirect to="/login"/>
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
                        {
                            props.registrationMessage?
                            <MDBAlert color="danger">
                            {props.registrationMessage}<MDBIcon onClick={()=>{props.errorMessageClear()}} className="float-right hoverErrorLogin mt-1" icon="times" /> 
                            </MDBAlert>
                            :
                            null
                        }                       
                        {
                            props.successRegistrationMessage?
                            <div>
                                <Modal isOpen={modal} toggle={toggle} className={className}>
                                    <ModalBody className="d-flex justify-content-center flex-column">
                                        <div style={{textAlign:"center"}}>
                                            <h3>Registration Successful</h3>
                                            <p>You can now login to our website</p>
                                        </div>
                                    </ModalBody>   
                                    <ModalFooter>
                                        <Button className="btn-sm rounded-pill" color="black" onClick={redirectRegisteredUserToLogin}>Ok</Button>
                                    </ModalFooter>                        
                                </Modal>
                            </div>
                            :
                            null
                        }
                        <MDBBtn type="submit" disabled="" color="black" className="rounded-pill">Submit</MDBBtn>
                    </div>
                </form>

            </div>            
        </>
    )
}

const MapStateToProps=(state)=>{
    return state.Auth
}

export default connect (MapStateToProps, {registerUser, errorMessageClear})(Register);
