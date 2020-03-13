import React, { Component } from "react";
import {
MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavbarToggler, MDBCollapse, 
MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBNavLink, MDBFormInline, MDBBtn
} from "mdbreact";
import { NavLink } from 'reactstrap'
import {connect} from 'react-redux';
import {GoSearch} from 'react-icons/go';
import Axios from "axios";
import { API_URL } from './../supports/ApiURL';
import { nonHome } from "../redux/actions";
import { GiShoppingCart } from 'react-icons/gi'

class Header extends Component {
state = {
  isOpen: false,
  searchQuery:'',
  toDisplayAfterSearch:[]
};

onClickSearch=(e)=>{
  e.preventDefault()
  var searchKeyword=this.state.inputSearchBar

  Axios.get(`${API_URL}/products?q=${searchKeyword}`)
  .then((res)=>{
    this.setState({toDisplayAfterSearch:res.data})
    
  })
  .catch((err)=>{
    console.log(err)
  })

}


toggleCollapse = () => {
  this.setState({ isOpen: !this.state.isOpen });
}

logoutUser=()=>{
  localStorage.clear()
}

render() {
  return (
      <MDBNavbar light color="white"  expand="md" position="fixed" fixed="top" style={{height:"150px"}}>
        <MDBNavbarBrand href="/">
          <h2 style={{letterSpacing:"8px", textTransform:"uppercase", color:"black", fontWeight:"bolder"}}>Minimalés</h2>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={this.toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
          <MDBNavbarNav left>   
            <MDBNavItem>
              <MDBFormInline className="md-form mr-auto m-0">
                <input className="form-control mr-sm-2" type="text" placeholder="Search for products..." aria-label="Search" style={{fontSize:"smaller"}} onChange={(e)=>this.setState({inputSearchBar:e.target.value})}/>
                <MDBBtn outline color="black" size="sm" type="submit" className="mr-auto" className="rounded-pill" onClick={this.onClickSearch}>
                  <GoSearch/>
                </MDBBtn>
              </MDBFormInline>
            </MDBNavItem>

            <MDBNavItem>
                <div></div>
            </MDBNavItem>
            <MDBNavItem>
                <div></div>              
            </MDBNavItem>
          </MDBNavbarNav>
          <MDBNavbarNav right>
            
            <MDBNavItem active>
              {
                this.props.User.role==="admin"?
                <MDBNavLink to='/manageadmin' style={{color:"black", fontWeight:"bolder"}}>Manage Admin</MDBNavLink>
                :
                null
              }   
            </MDBNavItem>
            
            <MDBNavItem>
              {
                this.props.User.isLoggedIn?
                null
                :
                
                  
                <MDBNavLink to="/login" style={{color:"black"}}>
                  Login
                </MDBNavLink>
                
              }
            </MDBNavItem>
            <MDBNavItem>
              {
                this.props.User.username?
                  <>
                  <MDBNavItem>
                    <MDBNavLink to="/cart">
                      <GiShoppingCart style={{fontSize:"24px", color:"black"}}/>
                    </MDBNavLink>                            
                  </MDBNavItem>
                  <MDBDropdown>
                      <MDBDropdownToggle nav caret>
                        <span className="mr-2" style={{color:"black", fontWeight:"bolder"}}>{this.props.User.username}</span>
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem href="/cart">Shopping Cart</MDBDropdownItem>
                        <MDBDropdownItem href="#!">Manage Account</MDBDropdownItem>
                        <MDBDropdownItem onClick={this.logoutUser}><a href="/" style={{textDecoration:"none", color:"black"}}>Logout</a></MDBDropdownItem>
                      </MDBDropdownMenu>
                  </MDBDropdown>
                  </>
                :
                null
              }
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    );
  }
}

const MapStateToProps=(state)=>{
  return {
    User:state.Auth,
    Header:state.Header
  } 
}

export default connect(MapStateToProps)(Header);