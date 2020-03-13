import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import { API_URL } from '../supports/ApiURL';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import ChangeToRp from './../supports/ChangeToRp';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

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
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

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
        if(props.User.isLoggedin&&props.User.role=="user"){

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
                <div className='paddingatas'>
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
                        <button className='btn btn-primary btn-sm' onClick={onToLoginClick}>OK</button>
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
                                {name}
                            </div>
                            <div className='font-typographysmall'>
                                <span className='font-weight-bold'>{0}&nbsp;X</span> bought
                            </div>
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
                                    <button className='btn btn-primary btn-sm' disabled={qty<=1?true:false} onClick={()=>setqty(qty-1)}>-</button>
                                    <div className='rounded' style={{border:'1px black solid'}} >
                                        <input 
                                            type="text" 
                                            style={{width:'100px',height:'60px',textAlign:'center',backgroundColor:'transparent',border:'0px'}} 
                                            value={qty} 
                                            onChange={qtyOnchange}
                                        />
                                    </div>
                                    <button className='btn btn-primary btn-sm' disabled={qty>=stock?true:false} onClick={()=>setqty(parseInt(qty)+1)}>+</button>
                                </div>
                            </div>
                        </div>
                        <div className=' border-headerdetail' style={{lineHeight:'80px'}}>
                            <button className='btn btn-success rounded-pill' onClick={sendToCart}>Add to Cart</button>
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

export default connect(MapStateToProps)(ProductDetail);