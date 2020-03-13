import React, {useEffect, useState} from 'react';
import './App.css';
import Header from './component/Header';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import NotFound from './pages/NotFound'
import ManageAdmin from './pages/ManageAdmin';
import Cart from './pages/Cart';
import {Switch, Route} from 'react-router-dom';
import Axios from 'axios'
import { API_URL } from './supports/ApiURL';
import { keepLogin } from './redux/actions';
import {connect} from 'react-redux';
import {Spinner} from 'reactstrap';
import ProductDetail from './pages/ProductDetail';

//tiap reload pasti ngelewatin app js. jd taro di tempat yg pasti kerender duluan.
// ga bsa di index karena dia bukan komponen

function App({keepLogin}) {
  //Loading State
  const [loading, setLoading]=useState(true)
  

  //buat stay logged in buat didmount version func
  useEffect(() => {
    var id=localStorage.getItem('idUser')
    if(id){
      Axios.get(`${API_URL}/users/${id}`)
      .then(res=>{
        console.log(res.data)
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
      <Spinner animation="border" />
    )
  }

  return (
    <div>
      <Header/>
      <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/login' exact component={Login}/>
        <Route path='/register' exact component={Register}/>
        <Route path='/productdetail/:idprod' exact component={ProductDetail}/>
        <Route path='/manageadmin' exact component={ManageAdmin}/>
        <Route path='/cart' exact component={Cart}/>
        <Route path='/*' exact component={NotFound}/>
      </Switch>
    </div>
  );
}

export default connect(null, {keepLogin}) (App);
