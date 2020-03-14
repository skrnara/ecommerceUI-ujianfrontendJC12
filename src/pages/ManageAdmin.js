import React, { Component } from 'react';
import {Table, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import Axios from 'axios';
import { API_URL } from './../supports/ApiURL'
import Swal from 'sweetalert2';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import ChangeToRp from './../supports/ChangeToRp';

class ManageAdmin extends Component {
    state = {
        products:[],
        isModalAddOpen: false,
        isModalEditOpen: false,
        indexdelete:0,
        indexedit:0,
        categories:[]
    }

    componentDidMount(){
        Axios.get(`${API_URL}/products?_expand=category`)
        .then((res)=>{
            console.log(res.data)
            Axios.get(`${API_URL}/categories`)
            .then((rescategory)=>{
                this.setState({products:res.data, categories:rescategory.data})
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    toggleAdd=()=>{
        this.setState({isModalAddOpen:!this.state.isModalAddOpen})
    }

    onSubmitNewProductData=()=>{
        var nameAdd=this.refs.nameAdd.value
        var imageAdd=this.refs.imageAdd.value
        var stockAdd=parseInt(this.refs.stockAdd.value)
        var categoryAdd=parseInt(this.refs.categoryAdd.value)
        var priceAdd=parseInt(this.refs.priceAdd.value)
        var descriptionAdd=this.refs.descriptionAdd.value

        var objectAddDataProducts={
            name:nameAdd,
            image:imageAdd,
            stock:stockAdd,
            categoryId:categoryAdd,
            price:priceAdd,
            description:descriptionAdd
        }
        Axios.post(`${API_URL}/products`, objectAddDataProducts)
        .then((res)=>{
            console.log(res.data)
            Axios.get(`${API_URL}/products?_expand=category`)
            .then((resAfterInput)=>{
                this.setState({products:resAfterInput.data, isModalAddOpen:false})
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
        console.log(objectAddDataProducts)
    }

    adminDeleteProductConfirmation=(index, id)=>{
        Swal.fire({
            title: `Are you sure you want to delete ${this.state.products[index].name}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            cancelButtonColor: '#999',
            confirmButtonText: 'Confirm!'
          }).then((result) => {
            if (result.value) {
                Axios.delete(`${API_URL}/products/${id}`)
                .then((res)=>{
                    Swal.fire(
                    'Product has been deleted.',
                    'success'
                  ).then((result)=>{
                      if(result.value){
                        Axios.get(`${API_URL}/products`)
                        .then((resafterdel)=>{
                            this.setState({products:resafterdel.data})
                        })                        
                      }
                  })
                }).catch((err)=>{
                    console.log(err)
                })
            }
          })
    }    

    renderProductsToAdmin=()=>{
        const {products} = this.state 
        return products.map((val, index)=>{
            return(
                <tr key={index}>
                    <td scope="row">{index+1}</td>
                    <td>{val.name}</td>
                    <td><img src={val.image} alt={val.name} width="200px"/></td>
                    <td>{val.stock}</td>
                    <td>{val.category.name}</td>
                    <td>{ChangeToRp(val.price)}</td>
                    <td>{val.description}</td>
                    <td><Button color="brown" className="btn-sm rounded-pill  px-3" onClick={()=>{this.onEditClick(index)}}>Edit</Button><Button className="btn-sm rounded-pill  px-3" color="brown" onClick={()=>{this.adminDeleteProductConfirmation(index, val.id)}}>Delete</Button></td>
                </tr>
            )
        })
    }

    toggleEdit=()=>{
        this.setState({isModalEditOpen:!this.state.isModalEditOpen})
    }
    onEditClick=(index)=>{
        this.setState({indexedit:index, isModalEditOpen:true})
    }

    onSaveEditClick=()=>{
        var nameEdit=this.refs.nameEdit.value
        var imageEdit=this.refs.imageEdit.value
        var stockEdit=parseInt(this.refs.stockEdit.value)
        var categoryEdit=parseInt(this.refs.categoryEdit.value)
        var priceEdit=parseInt(this.refs.priceEdit.value)
        var descriptionEdit=this.refs.descriptionEdit.value

        var objectEditDataProducts={
            name:nameEdit,
            image:imageEdit,
            stock:stockEdit,
            categoryId:categoryEdit,
            price:priceEdit,
            description:descriptionEdit
        }

        var id = this.state.products[this.state.indexedit].id
        console.log(objectEditDataProducts, id)
        Axios.put(`${API_URL}/products/${id}`, objectEditDataProducts)
        .then((res)=>{
            Axios.get(`${API_URL}/products?_expand=category`)
            .then((resafterEdit)=>{
                this.setState({products:resafterEdit.data, isModalEditOpen:false})
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderCategoriesOption=()=>{
        return this.state.categories.map((val, index)=>{
            return <option key={index} value={val.id}>{val.name}</option>
        })
    }

    render() { 
        const {indexedit, products} = this.state
        if(this.props.User.role==="admin"){
            return (
                <>
                    {console.log(this.props.User.role)}
                    {/* //MODAL ADD */}
                    <Modal isOpen={this.state.isModalAddOpen} toggle={this.toggleAdd}>
                        <ModalHeader toggle={this.toggleAdd} style={{backgroundColor:"#795548"}}><div style={{color:"white"}}>Adding New Product Data</div></ModalHeader>
                        <ModalBody>
                            <input type="text" ref="nameAdd" placeholder='Product name' className="form-control mt-2"/>
                            <input type="text" ref="imageAdd" placeholder='Url image' className="form-control mt-2"/>
                            <input type="number" ref="stockAdd" placeholder='Stock' className="form-control mt-2"/>
                            <select ref='categoryAdd' className="form-control mt-2">
                                <option value="" hidden>Choose category...</option>
                                {this.renderCategoriesOption()}
                            </select>
                            <input type="number" ref="priceAdd" placeholder='Price' className="form-control mt-2"/>
                            <textarea cols="30" rows="10"  ref="descriptionAdd" className="form-control mt-2" placeholder="Description"></textarea>
                        </ModalBody>
                        <ModalFooter>
                        <Button color="brown" className="btn-sm rounded-pill" onClick={this.onSubmitNewProductData}>Add Data</Button>{' '}
                        <Button color="grey" className="btn-sm rounded-pill" onClick={this.toggleAdd}>Cancel</Button>
                        </ModalFooter>
                    </Modal>


                    {/* MODAL EDIT */}
                    {
                        this.state.products.length?
                        <Modal isOpen={this.state.isModalEditOpen} toggle={this.toggleEdit}>
                            <ModalHeader toggle={this.toggleEdit} style={{backgroundColor:"#795548"}}><div style={{color:"white"}}>Edit {products[indexedit].name}?</div></ModalHeader>
                            <div className="d-flex justify-content-center">
                                <img src={products[indexedit].image} alt="edit image" width="40%" style={{padding:"5%"}}/>
                            </div>
                            <ModalBody>                                
                                {console.log(this.state.products.length)}
                                {console.log(indexedit)}
                                <input type="text" ref="nameEdit" placeholder='Product name' className="form-control mt-2" defaultValue={products[indexedit].name}/>
                                <input type="text" ref="imageEdit" placeholder='Url image' className="form-control mt-2" defaultValue={products[indexedit].image}/>
                                <input type="number" ref="stockEdit" placeholder='Stock' className="form-control mt-2" defaultValue={products[indexedit].stock}/>
                                <select ref='categoryEdit' className="form-control mt-2" defaultValue={products[indexedit].categoryId}>
                                    <option value="" hidden>Choose category...</option>
                                    {this.renderCategoriesOption()}
                                </select>
                                <input type="number" ref="priceEdit" placeholder='Price' className="form-control mt-2" defaultValue={products[indexedit].price}/>
                                <textarea cols="30" rows="10"  ref="descriptionEdit" className="form-control mt-2" placeholder="Description" defaultValue={products[indexedit].description}></textarea>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="brown" className="btn-sm rounded-pill px-5 py-2" onClick={this.onSaveEditClick}>Save</Button>{' '}
                                <Button color="grey" className="btn-sm rounded-pill px-5 py-2" onClick={this.toggleEdit}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                        :
                        null
                    }
                    
                    
                    <div style={{paddingTop:"15%", position:"-webkit-sticky"}}>                            
                        <br/>
                        <h2 style={{textAlign:"center"}}>Manage Products</h2>
                        <br/>
                        <div className="d-flex justify-content-center">
                            <Button onClick={this.toggleAdd} className="btn-sm rounded-pill px-5 py-2" color="brown">Add New Products</Button>
                        </div>
                        <br/>
                        <br/>                        
                    </div>
                    <Table hover responsive>
                    <thead>
                        <tr>
                        <th>No</th>
                        <th>Product Name</th>
                        <th>Image</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderProductsToAdmin()}
                    </tbody>
                    </Table>
                    
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
export default connect (MapStateToProps)(ManageAdmin);