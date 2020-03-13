import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../supports/ApiURL';
import { Table } from 'reactstrap';
import Swal from 'sweetalert2';

class Cart extends Component {
    state = { 
        cartContent:[]
    }

    getAllData=()=>{
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${this.props.User.id}&status=oncart`)
        .then((res)=>{
            console.log(res.data[0].transactiondetails)
            var newArrForProducts=[]
            res.data[0].transactiondetails.forEach(element =>{
                newArrForProducts.push(Axios.get(`${API_URL}/products/${element.productId}`))
            });
            console.log(newArrForProducts)
            Axios.all(newArrForProducts)
            .then((res2)=>{
                res2.forEach((val, index)=>{
                        res.data[0].transactiondetails[index].productData=val.data
                })
                console.log(res.data[0].transactiondetails)
                this.setState({cartContent:res.data[0].transactiondetails})
                console.log(this.state.cartContent)
            })

        })
        .catch ((err)=>{
            console.log(err)
        })
    }

    componentDidMount(){
        this.getAllData()
    }

    renderCartContentData=()=>{
        return this.state.cartContent.map((val, index)=>{
            return (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{val.productData.name}</td>
                    <td><img src={val.productData.image} width="200px"/></td>
                    <td>{val.qty}</td>
                    <td><button className="btn-sm btn-danger rounded-pill" onClick={()=>{this.deleteFromCart(index, val.id)}}>Delete</button></td>
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
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                Axios.delete(`${API_URL}/transactiondetails/${id}`)
                .then((res)=>{
                    Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  ).then((result)=>{
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
        return ( 
            <>
                <div style={{marginTop:"150px"}}>
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
            </>
        );
    }
}

const MapStateToProps=(state)=>{
    return{
        User:state.Auth
    }
}
 
export default connect (MapStateToProps) (Cart);