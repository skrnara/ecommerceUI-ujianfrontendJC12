import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { cartCounter } from './../redux/actions'
import { API_URL } from './../supports/ApiURL';
import Fade from 'react-reveal';
import Numeral from 'numeral';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button, Col, Row, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { MDBIcon } from 'mdbreact';

const SearchProduct = (props) => {
    const[searchData, setSearchData]=useState({
        dataToShow:[]
    })

    useEffect(() => {
        Axios.get(`${API_URL}/products?_expand=category&_limit=8`)
        .then((res)=>{
            Axios.get(`${API_URL}/products?q=${props.match.params.keyword}`)
            .then((res)=>{
                console.log(res.data)
                setSearchData({...searchData, dataToShow:res.data})
                if(props.User.role==="user"){
                    Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${props.User.id}&status=oncart`)
                    .then((resoncart)=>{
                        if(props.User.isLoggedIn&&resoncart.data[0].transactiondetails.length>0){
                            var totalQtyOnCart=resoncart.data[0].transactiondetails.reduce((a, b)=>({qty:a.qty+b.qty})).qty
                            props.cartCounter(totalQtyOnCart)
                        }
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                }            
            })
            .catch((err)=>{
                console.log(err)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
        
    },[])

    const renderProducts=()=>{
        return searchData.dataToShow.map((val)=>{
            return(
                <>
                    <Fade bottom>
                    <div className="col-md-3" style={{marginTop:"5%"}}>
                        <Card>
                            <CardImg top width="100%" height="100%" src={val.image} alt="Card image cap" />
                            <div className="blackBox d-flex justify-content-center">
                                <Link to={`/productdetail/${val.id}`} className="insideButton">
                                    <button className="buyNowButton px-5 py-2 btn-sm" style={{marginTop:"140%"}}><div style={{color:"white"}}><MDBIcon icon="cart-plus"/></div></button>
                                </Link>
                            </div>
                            <CardBody>
                            <CardTitle>{ val.name }</CardTitle>
                            <CardText>{ val.description }</CardText>
                            <CardSubtitle>{ `Rp.`+ Numeral(val.price).format(0,0)}</CardSubtitle>
                            <Button className="rounded-pill btn-sm" color="brown"><a href={`/productdetail/${val.id}`} style={{color:"white"}}>View Product</a></Button>
                            </CardBody>
                        </Card>
                    </div>
                    </Fade>
                </>
            )
        })
    }

    if(searchData.dataToShow.length>0){
        return (
            <>
                <Container style={{paddingTop:"200px"}}>
                    <Row className="justify-content-center" style={{backgroundColor:"lightgrey", borderRadius:"10px", padding:"40px"}}>
                        <h5>{searchData.dataToShow.length} result(s) for {props.match.params.keyword}</h5>
                    </Row>
                    <div> 
                        <div className="row" style={{paddingBottom:"5%"}}>                      
                            {renderProducts()}
                        </div>
                    </div>
                </Container>            
            </>
        )        
    }
    else{
        return (
            <>
                <Container style={{paddingTop:"200px"}}>
                    <Row className="justify-content-center" style={{backgroundColor:"lightgrey", borderRadius:"10px", padding:"100px"}}>
                        <h4 style={{textAlign:"center"}}>
                            No result for {props.match.params.keyword}
                            <br/>
                            Back to <Link to="/" style={{color:"dimgrey"}}>Home.</Link>
                        </h4>

                    </Row>
                </Container> 
            </>
        )
    }

}


const MapStateToProps=(state)=>{
    return{
        User:state.Auth,
    }
}
export default connect(MapStateToProps, {cartCounter})(SearchProduct);
