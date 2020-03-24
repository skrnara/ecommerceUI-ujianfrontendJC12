import React, {useEffect, useState} from 'react';
import './App.css';
import Header from './component/Header';
import Footer from './component/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import NotFound from './pages/NotFound';
import ManageAdmin from './pages/ManageAdmin';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import AllProducts from './pages/AllProducts';
import TransactionStatus from './pages/TransactionStatus';
import ManageTransactions from './pages/ManageTransactions';
import { Switch, Route, Router } from 'react-router-dom';
import Axios from 'axios'
import { API_URL } from './supports/ApiURL';
import { keepLogin } from './redux/actions';
import { connect } from 'react-redux';

//tiap reload pasti ngelewatin app js. jd taro di tempat yg pasti kerender duluan.
//ga bsa di index karena dia bukan komponen

function App({keepLogin}) {
  //Loading State
  const [loading, setLoading]=useState(true)
  

  //buat stay logged in buat didmount version func
  useEffect(() => {
    var id=localStorage.getItem('idUser')
    if(id){
      Axios.get(`${API_URL}/users/${id}`)
      .then(res=>{
        // console.log(res.data)
        keepLogin(res.data)
      }).catch((err)=>{
        console.log(err)
      }).finally(()=>{//ketrigger kalo then selesai dan catch selesai
        setLoading(false)
      })    
    }
    else{
      setLoading(false)
    }
  }, [])

  if(loading){
    return (
      <>
        <div className="d-flex justify-content-center flex-row" style={{marginTop:"150px", height:"450px"}}>
            <div className="d-flex justify-content-center flex-column">
                <div className="d-flex justify-content-center flex-row">
                    <div className="spinner-grow" role="status"></div>
                    <div className="spinner-grow" role="status"></div>
                    <div className="spinner-grow" role="status"></div>
                </div>
                <br/><br/>
                <div>We'll be with you in a moment.</div>
            </div>
        </div>            
      </>
    )
  }

  return (
    <div>
      <Header/>
      <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/allproducts' exact component={AllProducts}/>
        <Route path='/login' exact component={Login}/>
        <Route path='/register' exact component={Register}/>
        <Route path='/changepassword' exact component={ChangePassword}/>
        <Route path='/productdetail/:idprod' exact component={ProductDetail}/>
        <Route path='/manageadmin' exact component={ManageAdmin}/>
        <Route path='/cart' exact component={Cart}/>
        <Route path='/transactionstatus' exact component={TransactionStatus}/>
        <Route path='/managetransactions' exact component={ManageTransactions}/>
        <Route path='/*' exact component={NotFound}/>
      </Switch>
      <Footer/>
    </div>
  )
}

export default connect(null, {keepLogin}) (App);
