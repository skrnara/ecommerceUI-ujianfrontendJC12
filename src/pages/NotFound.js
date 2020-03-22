import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import { API_URL } from './../supports/ApiURL';
import { cartCounter } from './../redux/actions';

const NotFound = (props) => {

    useEffect(() => {
        
        if(props.role==="user"){
            Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${props.id}&status=oncart`)
            .then((resoncart)=>{
                if(props.isLoggedIn&&resoncart.data[0].transactiondetails.length>0){
                    var totalQtyOnCart=resoncart.data[0].transactiondetails.reduce((a, b)=>({qty:a.qty+b.qty})).qty
                    props.cartCounter(totalQtyOnCart)
                }
                else if(props.isLoggedIn&&resoncart.data[0].transactiondetails.length==0){
                    props.cartCounter(0)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }        
               
    },[])


    return (
        <>
        <div id="notfound">
        <div className="notfound">
            <div className="notfound-404">
            <h1>404</h1>
            <br/>
            </div>
            <h2>Oops! Nothing was found</h2>
            <p>
            The page you are looking for might have been removed had its name changed
            or is temporarily unavailable. <a href="/">Return to homepage</a>
            </p>
        </div>
        </div>
        </>
    )
}

const MapStateToProps=(state)=>{
    return state.Auth
}
 
export default connect(MapStateToProps, {cartCounter})(NotFound)
