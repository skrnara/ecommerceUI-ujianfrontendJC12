import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../supports/ApiURL';
import { Table, Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import Swal from 'sweetalert2';
import { cartCounter } from './../redux/actions';
import { Redirect } from 'react-router-dom';

class Cart extends Component {
    state = { 
        cartContent:[]
    }
    
    componentDidMount(){
        this.getAllData()
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
                this.props.cartCounter(this.state.cartContent.length)  
                
            })

        })
        .catch ((err)=>{
            console.log(err)
        })
    }
  
    renderCartContentData=()=>{
        return this.state.cartContent.map((val, index)=>{
            return (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{val.productData.name}</td>
                    <td><img src={val.productData.image} width="200px" alt="product"/></td>
                    <td><Button className="btn-sm rounded-pill px-3 py-2" color="brown"><MDBIcon style={{color:"white"}} icon="minus"/></Button>{val.qty}<Button className="btn-sm rounded-pill px-3 py-2" color="brown"><MDBIcon style={{color:"white"}} icon="plus" /></Button></td>
                    <td><Button className="btn-sm btn-danger rounded-pill px-3 py-2" color="red" onClick={()=>{this.deleteFromCart(index, val.id)}}><MDBIcon icon="times" style={{color:"white"}}/></Button></td>
                </tr>
            )
        })
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
                    this.state.cartContent===0?
                    <div style={{marginTop:"150px", textAlign:"center"}}>
                        <h1>Your cart is empty</h1>
                    </div>
                    :
                    <div style={{marginTop:"150px", textAlign:"center"}}>
                        <h1>Your Cart</h1>                    
                        <Table striped>
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