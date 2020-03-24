import React, { Component } from "react";
import {
MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavbarToggler, MDBCollapse, MDBIcon,
MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBNavLink
} from "mdbreact";
import { Badge, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { cartCounter } from './../redux/actions'
import { GiShoppingCart } from 'react-icons/gi';
import { FiSearch } from 'react-icons/fi';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from './../supports/ApiURL';

class Header extends Component {
  state = {
    isOpen: false,
    redirect: null,
    modalSearch:false
  }

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  logoutUser=()=>{
    localStorage.clear()
  }

  toggleSearch=()=>{
    this.setState({modalSearch:!this.state.modalSearch})
  }
  
  onClickSearch=()=>{
    var searchKeyword=this.state.inputSearchBar
    this.setState({ redirect: `/searchproduct/${searchKeyword}` })    
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    
    return (
      <>
        <div>          
          <Modal isOpen={this.state.modalSearch} toggle={this.toggleSearch}>
            <ModalHeader toggle={this.toggleSearch}>Search</ModalHeader>
            <ModalBody>
              <input type="text" className="form-control" onChange={(e)=>this.setState({inputSearchBar:e.target.value})}/>
            </ModalBody>
            <ModalFooter>
              <Button color="brown" className="btn-sm rounded-pill py-2 px-4" onClick={this.onClickSearch}>Search</Button>{' '}
              <Button color="grey" className="btn-sm rounded-pill py-2 px-4" onClick={this.toggleSearch}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>



      <MDBNavbar light color="white"  expand="md" position="fixed" fixed="top" style={{height:"120px"}} className="shadow-sm p-3 mb-5 bg-white rounded">
        <MDBNavbarBrand href="/">
          <h2 style={{letterSpacing:"8px", textTransform:"uppercase", color:"black", fontWeight:"bolder"}}>Minimalés</h2>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={this.toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
          <MDBNavbarNav left>   
          </MDBNavbarNav>

          <MDBNavbarNav right>
            <MDBNavItem>
              {
                this.props.User.isLoggedIn?
                <div className="d-flex justify-content-center" style={{marginLeft:"-300px"}}>
                  <MDBDropdown>
                      <MDBDropdownToggle nav>
                        <span className="mr-2" style={{color:"black", fontWeight:"bolder"}}>{this.props.User.username}<MDBIcon far icon="user-circle" /></span>
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                      {
                        this.props.User.role==="user"?
                        <MDBDropdownItem href="/transactionstatus">Transaction Status</MDBDropdownItem>
                        :
                        <>
                        <MDBDropdownItem href="/managetransactions">Manage Transaction</MDBDropdownItem>
                        <MDBDropdownItem href="/manageadmin">Manage Products</MDBDropdownItem>
                        </>
                      }
                        <MDBDropdownItem href="/changepassword">Change Password</MDBDropdownItem>
                        <MDBDropdownItem href="/" onClick={this.logoutUser}>Logout</MDBDropdownItem>
                      </MDBDropdownMenu>
                  </MDBDropdown>
                    
                    {
                      this.props.User.role==="admin"?
                      null
                      :
                      <>
                        <MDBNavItem>
                        <MDBNavLink to="/cart">
                          <GiShoppingCart style={{fontSize:"24px", color:"black"}}/>
                        </MDBNavLink>        
                        </MDBNavItem>
                        <MDBNavItem>
                          <Badge href="/cart" color="dark" className="rounded-pill px-2 py-1">{this.props.CartCount.cartNumber}</Badge>
                        </MDBNavItem>
                      </>
                    }
                </div>

                : 
                             
                <MDBNavLink to="/login" style={{color:"black", marginLeft:"-100px"}}>
                  Login
                </MDBNavLink>
                
              }
            </MDBNavItem> 
            <MDBNavItem>  
              <FiSearch onClick={this.toggleSearch} style={{fontSize:"30px", color:"black", marginLeft:"-45px", paddingTop:"10px"}}/>                       
            </MDBNavItem>           
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
      </>
    )
  }
}

const MapStateToProps=(state)=>{
  return {
    User:state.Auth,
    Header:state.Header,
    CartCount:state.CartCount
  } 
}

export default connect(MapStateToProps, {cartCounter})(Header);