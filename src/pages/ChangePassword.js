import React, { useState } from 'react';
import { MDBBtn, MDBInput, MDBAlert, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import { Modal, ModalBody, Button, ModalFooter } from 'reactstrap';
import { Redirect } from 'react-router-dom';

const ChangePassword = (props) => {

    const [changePasswordData, setChangePasswordData]=useState({
        oldPassword:'',
        newPassword:'',
        confirmNewPassword:''
    })

    const[modal, setModal]=useState(true)
    const toggle = () => setModal(!modal);
    const {className} = props;

    const onChangePassword=(e)=>{
        setChangePasswordData({...changePasswordData, [e.target.name]:e.target.value})
    }

    //kirim payload id user
    //di-put di action 

    
    
    if(props.User.isLoggedIn){
        return (
            <>
                <div className="d-flex justify-content-center align-items-center" style={{paddingTop:"200px"}}>            
                    <form style={{width:"35%"}}>
                    <p className="h5 text-center mb-4">Change password for {props.User.username}</p>
                        <div className="grey-text">
                            <MDBInput onChange={onChangePassword} name='oldPassword' value={changePasswordData.oldPassword} label="Type your old password" icon="lock" group type="text" validate error="wrong" success="right" />
                            <br/>
                            <MDBInput onChange={onChangePassword} name='newPassword' value={changePasswordData.newPassword} label="Type your new password" group type="password" validate />
                            <MDBInput onChange={onChangePassword} name='confirmNewPassword' value={changePasswordData.confirmNewPassword} label="Confirm your new password" group type="password" validate />
                        </div>
                        <div className="text-center"> 
                            {
                                props.registrationMessage?
                                <MDBAlert color="danger">
                                {props.registrationMessage}<MDBIcon className="float-right hoverErrorLogin mt-1" icon="times" /> 
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
                                                <p>Now you can now login to our website</p>
                                            </div>
                                        </ModalBody>   
                                        <ModalFooter>
                                            <Button className="btn-sm rounded-pill" color="black">Ok</Button>
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
    else{
        return <Redirect to="/notfound"/>
    }
}


const MapStateToProps=(state)=>{
    return{
        User:state.Auth
    }
}
 
export default connect(MapStateToProps)(ChangePassword);