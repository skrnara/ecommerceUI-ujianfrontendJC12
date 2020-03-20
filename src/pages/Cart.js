import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../supports/ApiURL';
import ChangeToRp from './../supports/ChangeToRp';
import { Table, Button, Container, Col, Row } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import Swal from 'sweetalert2';
import { cartCounter } from './../redux/actions';
import { Redirect } from 'react-router-dom';

class Cart extends Component {
    state = { 
        cartContent:[]
    }

    getAllData=()=>{
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${this.props.User.id}&status=oncart`)
        .then((res)=>{
            // console.log(this.props.User.id)
            // console.log(res.data[0].transactiondetails)
            var newArrForProducts=[]
            res.data[0].transactiondetails.forEach(element => {
                newArrForProducts.push(Axios.get(`${API_URL}/products/${element.productId}`))
            });           
            
            Axios.all(newArrForProducts)
            .then((res2)=>{
                res2.forEach((val, index)=>{
                    res.data[0].transactiondetails[index].productData=val.data
                })
                // console.log(res.data[0].transactiondetails)
                this.setState({cartContent:res.data[0].transactiondetails})

                //cart counter 
                console.log(this.state.cartContent.length)
                if(this.state.cartContent.length>0){
                    var totalQtyOnCart=this.state.cartContent.reduce((a, b)=>({qty:a.qty+b.qty})).qty
                    this.props.cartCounter(totalQtyOnCart)      
                    console.log(this.state.cartContent[0].productData)  
                }
                else{
                    this.props.cartCounter(0)
                }                
            })

        })
        .catch ((err)=>{
            console.log(err)
        })
    }
    
    componentDidMount(){
        this.getAllData()   
    }

    

    qtyCartOnchange=(e)=>{
        // console.log(e.target.value)        
    }

    renderCartContentData=()=>{
        return this.state.cartContent.map((val, index)=>{
            return (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{val.productData.name}</td>
                    <td><img src={val.productData.image} width="100px" alt="product"/></td>
                    <td>
                        <Button className="btn-sm rounded-pill px-3 py-2" color="brown"><MDBIcon style={{color:"white"}} icon="minus"/></Button>
                        <input 
                        type="text" 
                        style={{width:'20px',height:'40px',textAlign:'center',backgroundColor:'transparent',border:'0px'}} 
                        value={val.qty}
                        onChange={this.qtyCartOnchange}
                        />
                        <Button className="btn-sm rounded-pill px-3 py-2" color="brown"><MDBIcon style={{color:"white"}} icon="plus" /></Button>
                        <br/><br/>
                        <p style={{color:"dimgrey"}}>{val.qty} x {ChangeToRp(val.productData.price)}</p>
                        <h5>{ChangeToRp(val.qty*val.productData.price)}</h5>
                    </td>
                    <td><Button className="btn-sm btn-danger rounded-pill px-3 py-2" color="red" onClick={()=>{this.deleteFromCart(index, val.id)}}><MDBIcon icon="times" style={{color:"white"}}/></Button></td>
                </tr>
            )
        })
    }

    countItemQuantityInCart=()=>{
        if(this.state.cartContent.length){
           var quantityOfAllItems=this.state.cartContent.reduce((a, b)=>({qty:a.qty+b.qty})).qty
           return quantityOfAllItems
        }
        else{}
    }

    sumAllInCart=()=>{
        if(this.state.cartContent.length){
            // console.log(this.state.cartContent[1].productData.price)
            // console.log(this.state.cartContent[1].qty)
            var sum=0
            this.state.cartContent.map((val)=>{
                return sum=sum+val.productData.price*val.qty
            })

            return ChangeToRp(sum) 
        }
        else{}
    }


    deleteFromCart=(index, id)=>{
        Swal.fire({
            title: `Are you sure you want to delete ${this.state.cartContent[index].productData.name}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            cancelButtonColor: '#999',
            confirmButtonText: 'Confirm'
          }).then((result) => {
            if (result.value) {
                Axios.delete(`${API_URL}/transactiondetails/${id}`)
                .then((res)=>{
                    Swal.fire({
                    title:'Deleted!',
                    text:'Item has been deleted from your cart.',
                    icon:'success',
                    confirmButtonColor: '#000'
                    }).then((result)=>{
                      if(result.value){
                        this.getAllData()                    
                      }
                  })
                }).catch((err)=>{
                    console.log(err)
                })
            }
          })
    }

    render() { 
        if(this.props.User.isLoggedIn&&this.props.User.role==="user"){
            return ( 
                <>
                {
                    this.state.cartContent.length===0?
                    <div style={{marginTop:"150px", textAlign:"center"}}>
                        <h1>Your cart is empty</h1>
                    </div>
                    :
                    <div style={{marginTop:"150px", textAlign:"center"}}>
                        <h1>Your Cart</h1>  
                        <br/><br/>
                        <Container>
                            <Row>
                                <Col className="col-md-8">
                                <Table responsive style={{border:"solid 2px #dedede"}}>
                                    <thead>
                                        <tr>
                                        <th>No.</th>
                                        <th>Name</th>
                                        <th>Picture</th>
                                        <th>Qty</th>
                                        <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderCartContentData()}
                                    </tbody>
                                </Table>
                                </Col>
                                <Col className="col-12 col-md-4">
                                    <div className="floating-cart-total">
                                    <div style={{backgroundColor:"#a89485", borderRadius:"5px", paddingBottom:"20px"}}>
                                        <h3 style={{borderBottom:"1px solid white", color:"white"}} className="p-4">Your Purchase:</h3>
                                        <h6 style={{color:"white"}}>
                                            {this.countItemQuantityInCart()} items
                                            <br/>
                                            <br/>
                                            Total Purchase:
                                        </h6>
                                        <h3 style={{color:"white"}}>{this.sumAllInCart()}</h3>
                                    </div>    
                                    <br/>
                                    <Button className="btn-lg rounded-pill px-5" color="brown">Checkout</Button>                           
                                    </div>
                                </Col>
                            </Row>
                        </Container>               
                        
                    </div>
                }
                </>
            );
        }
        else{
            return <Redirect to="/notfound"/>
        }
        
    }
}

const MapStateToProps=(state)=>{
    return{
        User:state.Auth
    }
}
 
export default connect (MapStateToProps, {cartCounter}) (Cart);