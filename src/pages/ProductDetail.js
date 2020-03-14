import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import { API_URL } from '../supports/ApiURL';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import ChangeToRp from './../supports/ChangeToRp';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { cartCounter } from './../redux/actions'

const ProductDetail = (props) => {
    const [data, setData] = useState ({})
    const [qty, setqty] = useState (1)
    const [modalOpen, setModalOpen]= useState(false)
    const [redirectToLogin, setRedirectToLogin]= useState(false)

    console.log(props.match.params.idprod)

    useEffect(() => {
        Axios.get(`${API_URL}/products/${props.match.params.idprod}`)
        .then((res)=>{
            console.log(res.data)
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
                    console.log(resoncart.data[0].transactiondetails.length)
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
        console.log(e.target.value)
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
            var objTransaction={
                status:'oncart',
                userId:props.User.id
            }
            Axios.get(`${API_URL}/transactions?status=oncart&userId=${props.User.id}`)
            .then((res1)=>{
                if(res1.data.length){
                    var objTransactionDetails={
                        transactionId:res1.data[0].id,
                        productId:data.id,
                        qty:qty
                    }
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
                else{
                    //klo belom ada data transaksi dr particular user, post dulu wadah baru
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
                <div className="row">
                    <div className="col-md-4 p-2">
                        <div className="product-detail">
                            <img src={image} alt={name} width='100%' className='rounded'/>
                        </div>
                    </div>
                    <div className="col-md-8 p-2">
                        <div className='border-headerdetail'>
                            <div className='font-weight-bolder font-nameprod'>
                                <h1>{name}</h1>
                            </div>
                            {/* <div className='font-typographysmall'>
                                <span className='font-weight-bold'>{0}&nbsp;X</span> bought
                            </div> */}
                        </div>
                        <div className='border-headerdetail' style={{lineHeight:'80px'}}>
                            <div className="row">
                                <div className="col-md-1 font-typographymed">
                                   Stock
                                </div>
                                <div className="col-md-11">
                                    {stock} pcs
                                </div>
                            </div>
                        </div>
                        <div className=' border-headerdetail' style={{lineHeight:'80px'}}>
                            <div className="row" style={{verticalAlign:'center'}}>
                                <div className="col-md-1 font-typographymed" >
                                   Price
                                </div>
                                <div className="col-md-11 font-harga">
                                    {ChangeToRp(price*qty)}
                                </div>                               
                            </div>
                        </div>
                        <div className=' border-headerdetail' >
                            <div className="row" >
                                <div className="col-md-1 font-typographymed py-3">
                                   Quantity
                                </div>
                                <div className="col-md-11 d-flex py-2">
                                    <Button className='btn-sm px-4 py-2 rounded-pill' color="brown" disabled={qty<=1?true:false} onClick={()=>setqty(qty-1)}>-</Button>
                                    <div className='rounded' style={{border:'1px black solid'}} >
                                        <input 
                                            type="text" 
                                            style={{width:'100px',height:'60px',textAlign:'center',backgroundColor:'transparent',border:'0px'}} 
                                            value={qty} 
                                            onChange={qtyOnchange}
                                        />
                                    </div>
                                    <Button className='btn-sm px-4 py-2 rounded-pill' color="brown" disabled={qty>=stock?true:false} onClick={()=>setqty(parseInt(qty)+1)}>+</Button>
                                </div>
                            </div>
                        </div>
                        <div className=' border-headerdetail' style={{lineHeight:'80px'}}>
                            <Button className='btn rounded-pill' color="brown" onClick={sendToCart}>Add to Cart</Button>
                        </div>
                    </div>
                </div>
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