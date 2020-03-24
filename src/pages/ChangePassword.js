import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBInput, MDBAlert, MDBIcon } from 'mdbreact';
import Axios from 'axios';
import { API_URL } from './../supports/ApiURL'
import { connect } from 'react-redux';
import { Modal, ModalBody, Button, ModalFooter } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { changeUserPassword, changePassMessageClear, cartCounter } from './../redux/actions'

const ChangePassword = (props) => {

    const [changePasswordData, setChangePasswordData]=useState({
        oldPassword:'',
        newChangedPassword:'',
        confirmNewChangedPassword:''
    })

    const[modal, setModal]=useState(true)
    const toggle = () => setModal(!modal);
    const {className} = props;

    useEffect(() => {
        
        if(props.role==="user"){
            Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${props.id}&status=oncart`)
            .then((resoncart)=>{
                if(props.isLoggedIn&&resoncart.data[0].transactiondetails.length>0){
                    var totalQtyOnCart=resoncart.data[0].transactiondetails.reduce((a, b)=>({qty:a.qty+b.qty})).qty
                    props.cartCounter(totalQtyOnCart)
                }
                else if(props.isLoggedIn&&resoncart.data[0].transactiondetails.length==0){
                    props.cartCounter(0)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }        
               
    },[])


    const onChangePassword=(e)=>{
        setChangePasswordData({...changePasswordData, [e.target.name]:e.target.value})
    }

    const ChangePasswordSubmit=(e)=>{
        e.preventDefault()
        console.log(props.id)
        console.log(props.changePassMessage)
        props.changeUserPassword(changePasswordData, props.id)
    }
    
    const redirectChangePasswordToLogin=()=>{
        localStorage.clear()
    }
    
    if(props.isLoggedIn){
        return (
            <>
                <div className="d-flex justify-content-center align-items-center" style={{paddingTop:"200px"}}>            
                    <form style={{width:"35%"}} onSubmit={ChangePasswordSubmit}>
                    <p className="h5 text-center mb-4">Change password for {props.username}</p>
                        <div className="grey-text">
                            <MDBInput onChange={onChangePassword} name='oldPassword' value={changePasswordData.oldPassword} label="Type your old password" icon="lock" group type="password" validate error="wrong" success="right" />
                            <br/>
                            <MDBInput onChange={onChangePassword} name='newChangedPassword' value={changePasswordData.newChangedPassword} label="Type your new password" group type="password" validate />
                            <MDBInput onChange={onChangePassword} name='confirmNewChangedPassword' value={changePasswordData.confirmNewChangedPassword} label="Confirm your new password" group type="password" validate />
                        </div>
                        <div className="text-center"> 
                            {
                                props.changePassMessage?
                                <MDBAlert color="danger">
                                {props.changePassMessage}<MDBIcon className="float-right hoverErrorLogin mt-1" onClick={()=>{props.changePassMessageClear()}} icon="times" /> 
                                </MDBAlert>
                                :
                                null
                            }                       
                            {
                                props.successChangePasswordMessage?
                                <div>
                                    <Modal isOpen={modal} toggle={toggle} className={className}>
                                        <ModalBody className="d-flex justify-content-center flex-column">
                                            <div style={{textAlign:"center"}}>
                                                <p>{props.successChangePasswordMessage}</p>
                                            </div>
                                        </ModalBody>   
                                        <ModalFooter>
                                            {/* FIX HERE */}
                                            <Button className="btn-sm rounded-pill" color="black" onClick={redirectChangePasswordToLogin}><a href="/login" style={{color:"white"}}>Ok</a></Button>
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
    return state.Auth
}
 
export default connect(MapStateToProps, {changePassMessageClear, changeUserPassword, cartCounter})(ChangePassword);