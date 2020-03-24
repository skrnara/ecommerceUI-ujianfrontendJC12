import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { Table, Container, Row, Col, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import Axios from 'axios';
import { API_URL } from './../supports/ApiURL';
import { Redirect } from 'react-router-dom';
import  ChangeToRp from './../supports/ChangeToRp';

const ManageTransactions = (props) => {

    const[mainData, setMainData]=useState({
        dataToShowAdmin:[]
    })

    useEffect(() => {
        getData()
        
    }, [])

    const getData=()=>{
        Axios.get(`${API_URL}/transactions?status=confirmed%20and%20waiting%20process`)
        .then((res)=>{
            setMainData({...mainData, dataToShowAdmin:res.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const onClickProcessTransactionUser=(id)=>{
        Axios.patch(`${API_URL}/transactions/${id}`, {status:"finished"})
        .then((res)=>{
            getData()
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const renderTransactionToAdmin=()=>{
        return mainData.dataToShowAdmin.map((val, index)=>{
            return(
                <tr key={index} style={{textAlign:"center"}}>
                    <td>{val.status}</td>
                    <td>{val.userId}</td>
                    <td>{val.id}</td>
                    <td>{val.method}</td>
                    <td>{ChangeToRp(val.total)}</td>
                    <td>
                        <Button className="btn-sm rounded-pill px-5" color="brown" onClick={()=>{onClickProcessTransactionUser(val.id)}}>Process</Button>      
                    </td>
                </tr>
            )
        })
    }
    
    if(props.User.role==="admin"){
        if(mainData.dataToShowAdmin.length===0){
            return(
                <>
                    <div style={{paddingTop:"200px"}}> 
                        <Container>
                            <div style={{textAlign:"center", height:"200px"}}>
                                <h1>No Transaction to Process</h1>
                            </div>
                        </Container>
                    </div>
                </>
            )
        }
        else{
            return (
                <div style={{paddingTop:"200px"}}>
                    <Container>
                        <div style={{textAlign:"center"}}>
                            <h1>Customer Transactions to Process</h1>
                        </div>
                        <br/>
                        <Row>
                            <Col className="col-md-12">
                            <Table responsive className="shadow p-3 mb-5 bg-white rounded">
                                <thead style={{backgroundColor:"#a89485"}}>
                                    <tr style={{textAlign:"center"}}>
                                        <th style={{color:"white"}}>Status</th>
                                        <th style={{color:"white"}}>UserId</th>
                                        <th style={{color:"white"}}>Id</th>
                                        <th style={{color:"white"}}>Method</th>
                                        <th style={{color:"white"}}>Total</th>
                                        <th style={{color:"white"}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTransactionToAdmin()}
                                </tbody>
                            </Table>
                            </Col>                            
                        </Row>
                    </Container> 
                </div>
            )       
        }
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

export default connect (MapStateToProps) (ManageTransactions)
