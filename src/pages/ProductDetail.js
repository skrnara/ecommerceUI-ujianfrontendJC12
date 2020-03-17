import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import { API_URL } from '../supports/ApiURL';
import { Modal, ModalBody, ModalFooter, Button, Table } from 'reactstrap';
import ChangeToRp from './../supports/ChangeToRp';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { cartCounter } from './../redux/actions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal)

const ProductDetail = (props) => {
    const [data, setData] = useState ({})
    const [qty, setqty] = useState (1)
    const [modalOpen, setModalOpen]= useState(false)
    const [redirectToLogin, setRedirectToLogin]= useState(false)

    // console.log(props.match.params.idprod)

    useEffect(() => {
        Axios.get(`${API_URL}/products/${props.match.params.idprod}`)
        .then((res)=>{
            // console.log(res.data)
            setData(res.data)

            //make cart counter stay intact when reloaded
            toCount()
            
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

    const toCount=()=>{
        Axios.get(`${API_URL}/transactions?status=oncart&userId=${props.User.id}`)
        .then((res1)=>{
            if(res1.data.length){
                Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${props.User.id}&status=oncart`)
                .then((resoncart)=>{
                    // console.log(resoncart.data[0].transactiondetails.length)
                    props.cartCounter(resoncart.data[0].transactiondetails.length)
                })
                .catch((err)=>{
                    console.log(err)
                })
            }
            else{
                props.cartCounter(0)
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const qtyOnchange=(e)=>{
        // console.log(e.target.value)
        if(e.target.value===''){
            setqty(0)
        }
        if(Number(e.target.value)){
            if(qty===0){
                setqty(e.target.value[1])
            }
            else{
                if(e.target.value>stock){
                    setqty(stock)
                }
                else if(e.target.value<1){
                    setqty(1)
                }
                else{
                    setqty(e.target.value)
                }
            }
        }
    }
    
    const sendToCart=()=>{
        // console.log(props.User.isLoggedIn)
        if(props.User.isLoggedIn&&props.User.role==="user"){
            
            Axios.get(`${API_URL}/transactions?status=oncart&userId=${props.User.id}`)
            .then((res1)=>{
                //udah ada data transaksi dr particular user, post di wadah yg udah ada
                if(res1.data.length){

                    var objTransactionDetails={
                        transactionId:res1.data[0].id,
                        productId:data.id,
                        qty:qty
                    }

                    //get data transactiondetails di sini, cocokin sama product id, klo udh ada
                    //jangan post, tapi put. 
                    //get qty lama, add qty baru

                    Axios.get(`${API_URL}/transactiondetails?transactionId=${objTransactionDetails.transactionId}&productId=${objTransactionDetails.productId}`)
                    .then((restocheckproduct)=>{
                        if(restocheckproduct.data.length){
                            console.log(restocheckproduct.data[0].qty)
                            
                            Axios.patch(`${API_URL}/transactiondetails/${restocheckproduct.data[0].id}`, {qty:restocheckproduct.data[0].qty+qty})
                            .then((resafterput)=>{
                                Axios.get(`${API_URL}/transactiondetails/${restocheckproduct.data[0].id}`)
                                .then((resafterput2)=>{
                                    console.log(resafterput2.data)
                                    Swal.fire({
                                        icon: 'success',
                                        text: 'Item successfully added to cart',
                                        confirmButtonColor: '#000'
                                    })
                                })
                                .catch((err)=>{
                                    console.log(err)
                                })
                            })
                            .catch((err)=>{
                                console.log(err)
                            })
                        }
                        else{
                            Axios.post(`${API_URL}/transactiondetails`, objTransactionDetails)
                            .then((res2)=>{
                            
                                toCount()

                                Swal.fire({
                                    icon: 'success',
                                    text: 'Item successfully added to cart',
                                    confirmButtonColor: '#000'
                                })
                            })
                        }
                    })
                    .catch((err)=>{
                        console.log(err)
                    })

                    
                }
                else{
                    //klo belom ada data transaksi dr particular user, post dulu wadah baru
                    var objTransaction={
                        status:'oncart',
                        userId:props.User.id
                    }
                    Axios.post(`${API_URL}/transactions`, objTransaction)
                    .then((res2)=>{
                        var objTransactionDetails={
                            transactionId:res2.data.id,
                            productId:data.id,
                            qty:qty
                        }
                        Axios.post(`${API_URL}/transactiondetails`, objTransactionDetails)
                        .then((res3)=>{
                            
                            toCount()

                            Swal.fire({
                                icon: 'success',
                                text: 'Item successfully added to cart',
                                confirmButtonColor: '#000'
                            })
                        })
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                }

                //get res.dataarray 0 transaction details after done. trus add cartcounter

            })
            .catch((err)=>{
                console.log(err)
            })
        }
        else{
            setModalOpen(true)
        }
    }

    const onToLoginClick=()=>{
        if(props.User.role==="admin"){
            setModalOpen(false)
        }
        else{
            setRedirectToLogin(true)
            setModalOpen(false)
        }
    }

    if(redirectToLogin){
        return <Redirect to='/login'/>
    }
    
    const {name, image, price, stock, description}=data
    
    if(data){
        return (
            <>    
                <div style={{paddingTop:"200px"}}>                
                <Modal centered toggle={()=>setModalOpen(false)} isOpen={modalOpen}>
                    <ModalBody>
                        {
                            props.User.role==='admin'?
                            'maaf anda admin'
                            :
                            'Maaf Anda harus login dahulu'
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="brown" className="btn-sm rounded-pill" onClick={onToLoginClick}>OK</Button>
                    </ModalFooter>
                </Modal>
                
                <Container>
                    <Row className="col-md-12">
                        <Col className="col-md-4 p-2">
                            <img src={image} alt={name} width='100%' className='rounded'/>
                        </Col>
                        <Col className="col-md-8 p-2">
                            <Row className="p-3">
                                <h2>{name}</h2>
                            </Row>

                            <Table responsive>
                                <tr>
                                    <td>{description}</td>
                                </tr>
                                <tr>
                                    <td>Stock {stock} pcs</td>
                                </tr>
                                <tr>
                                    <td>Price {ChangeToRp(price*qty)} </td>
                                </tr>
                                <tr>
                                    <td>
                                        Quantity 
                                        <br/><br/>
                                        <Row>
                                            <br/>
                                            <Button className='btn-sm px-3 py-2 rounded-pill' color="brown" disabled={qty<=1?true:false} onClick={()=>setqty(qty-1)}>-</Button>
                                                <div className='rounded' style={{border:'1px black solid'}} >
                                                    <input 
                                                        type="text" 
                                                        style={{width:'40px',height:'40px',textAlign:'center',backgroundColor:'transparent',border:'0px'}} 
                                                        value={qty} 
                                                        onChange={qtyOnchange}
                                                    />
                                                </div>
                                            <Button className='btn-sm px-3 py-2 rounded-pill' color="brown" disabled={qty>=stock?true:false} onClick={()=>setqty(parseInt(qty)+1)}>+</Button>
                                        </Row>
                                    </td>
                                </tr>
                            </Table>
                            <Row>
                                <Button className='btn rounded-pill' color="brown" onClick={sendToCart}>Add to Cart</Button>                            
                            </Row>                               
                        </Col>
                    </Row>
                </Container>  
                </div> 
            </> 
        )
    }
}

const MapStateToProps=(state)=>{
    return{
        User:state.Auth
    }
}

export default connect(MapStateToProps, {cartCounter})(ProductDetail);