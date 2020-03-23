import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import { API_URL } from './../supports/ApiURL';
import { cartCounter, changePassMessageClear } from './../redux/actions';
import { Redirect } from 'react-router-dom';
import { Table, Container, Row, Col, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { MDBIcon, MDBAlert } from 'mdbreact';
import  ChangeToRp from './../supports/ChangeToRp';
import Swal from 'sweetalert2';

const TransactionStatus = (props) => {
    const[mainData, setMainData]=useState({
        arrayToShowProducts:[],
        status:''
    })

    const[paymentCC, setPaymentCC]=useState('')    
    const[modalPayment, setModalPayment]=useState(false)
    const togglePayment = () => setModalPayment(!modalPayment);

    useEffect(() => {
        if(props.User.role==="user"){
            Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${props.User.id}&status=oncart`)
            .then((resoncart)=>{
                if(props.User.isLoggedIn&&resoncart.data[0].transactiondetails.length>0){
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
        
        getData() 
          
    }, [])

    const getData=()=>{
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${props.User.id}`)
        .then((res)=>{
            var arrayForProducts=[]
            res.data[0].transactiondetails.forEach(element => {
                arrayForProducts.push(Axios.get(`${API_URL}/products/${element.productId}`))
            })   

            Axios.all(arrayForProducts)
            .then((res2)=>{
                res2.forEach((val, index)=>{
                    res.data[0].transactiondetails[index].productData=val.data
                })
                
                setMainData({...mainData, arrayToShowProducts:res.data[0].transactiondetails, status:res.data[0].status})         
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const renderDataProductToUser=()=>{        
        return mainData.arrayToShowProducts.map((val, index)=>{
            return (
                <div key={index}>
                    <p>{val.productData.name}</p>
                    <img src={val.productData.image} alt={val.productData.name} width="80px"/>
                    <br/>
                    <p>Qty {val.qty} Price {ChangeToRp(val.productData.price*val.qty)}</p>
                </div>
            )
        })
        
    }

    const totalSum=()=>{
        if(mainData.arrayToShowProducts.length){
            var sum=0
            mainData.arrayToShowProducts.map((val)=>{
                return sum=sum+val.productData.price*val.qty
            })

            return ChangeToRp(sum) 
        }
        else{}        
    }

    const cancelPendingTransaction=()=>{
        Swal.fire({
            title: `Are you sure you want to cancel transaction?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            cancelButtonColor: '#999',
            confirmButtonText: 'Confirm'
        }).then((result) => {
            if (result.value) {
                Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${props.User.id}&status=waiting%20payment`)
                .then((res)=>{
                    Axios.delete(`${API_URL}/transactions/${res.data[0].id}?_embed=transactiondetails&userId=${props.User.id}`)
                    .then((res2)=>{
                        setMainData({...mainData, arrayToShowProducts:[]})
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                })
                .catch((err)=>{
                    console.log(err)
                })                
            }
        })

    }

    const payTransaction=()=>{
        if(paymentCC===''){
            alert('Please fill credit card number')
        }
        else{
            console.log('hello')
        }
    }

    if(props.User.isLoggedIn&&props.User.role==="user"){
        
        if(mainData.status==="oncart"||mainData.arrayToShowProducts.length===0){
            return(
                <>
                    <div style={{paddingTop:"200px"}}> 
                        <Container>
                            <div style={{textAlign:"center", height:"200px"}}>
                                <h1>You Currently Have No Transaction</h1>
                            </div>
                        </Container>
                    </div>
                </>
            )
        }
        else{
            return (
                <div style={{paddingTop:"200px"}}>   
                    <Modal isOpen={modalPayment} toggle={togglePayment}>
                        <ModalHeader toggle={togglePayment}>Input your CC number</ModalHeader>
                        <ModalBody>
                            Total of {totalSum()}
                            <br/><br/>
                            <input type="number" className="form-control" onChange={(e)=>setPaymentCC({paymentCC:e.target.value})}/>
                        </ModalBody>
                        <ModalFooter>
                        <Button color="brown" className="btn-sm rounded-pill py-2 px-4" onClick={payTransaction}>Pay</Button>{' '}
                        <Button color="grey" className="btn-sm rounded-pill py-2 px-4" onClick={togglePayment}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Container>
                        <div style={{textAlign:"center"}}>
                            <h1>Transaction Status</h1>
                        </div>
                        <br/>
                        <Row>
                            <Col className="col-md-12">
                            <Table responsive className="shadow p-3 mb-5 bg-white rounded">
                                <thead style={{backgroundColor:"#a89485"}}>
                                    <tr style={{textAlign:"center"}}>
                                        <th style={{color:"white"}}>Products</th>
                                        <th style={{color:"white"}}>Total</th>
                                        <th style={{color:"white"}}>Status</th>
                                        <th style={{color:"white"}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{textAlign:"center"}}>
                                        <td>
                                            {renderDataProductToUser()}
                                        </td>
                                        <td>
                                            {totalSum()}
                                        </td>
                                        <td>
                                            {mainData.status}
                                        </td>
                                        <td>
                                            <Button className="btn-sm rounded-pill px-5" color="brown" onClick={togglePayment}>Pay</Button>      
                                            <Button className="btn-sm rounded-pill px-5" color="grey" onClick={cancelPendingTransaction}>Cancel Transaction</Button>                 
                                        </td>
                                    </tr>
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
 
export default connect (MapStateToProps, {cartCounter}) (TransactionStatus);
