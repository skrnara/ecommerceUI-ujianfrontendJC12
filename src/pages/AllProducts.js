import React, { Component } from 'react';
import Axios from 'axios'
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import { MDBCarousel, MDBCarouselCaption, MDBCarouselInner, MDBCarouselItem, MDBView, MDBMask } from "mdbreact";
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import { API_URL } from './../supports/ApiURL';
import Numeral from 'numeral';
import { FaCartPlus } from 'react-icons/fa';
import Fade from 'react-reveal/Fade';
import { cartCounter } from './../redux/actions';

class AllProducts extends Component {
    state = { 
        products:[]
    }

    renderProducts=()=>{
        return this.state.products.map((val)=>{
            return(
                <>
                    <Fade bottom>
                    <div className="col-md-3" style={{marginTop:"5%"}}>
                        <Card>
                            <CardImg top width="100%" height="100%" src={val.image} alt="Card image cap" />
                            <div className="blackBox d-flex justify-content-center">
                                <Link to={`/productdetail/${val.id}`} className="insideButton">
                                    <button className="buyNowButton px-5 py-2 btn-sm" style={{marginTop:"140%"}}><div style={{color:"white"}}><FaCartPlus/></div></button>
                                </Link>
                            </div>
                            <CardBody>
                            <CardTitle>{ val.name }</CardTitle>
                            <CardText>{ val.description }</CardText>
                            <CardSubtitle>{ `Rp.`+ Numeral(val.price).format(0,0)}</CardSubtitle>
                            <Button className="rounded-pill btn-sm" color="brown"><a href={`/productdetail/${val.id}`} style={{color:"white"}}>View Products</a></Button>
                            </CardBody>
                        </Card>
                    </div>
                    </Fade>
                </>
            )
        })
    }

    componentDidMount=()=>{
        Axios.get(`${API_URL}/products?_expand=category`)
        .then((res)=>{
            console.log(res.data)
            this.setState({products:res.data})
            Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${this.props.User.id}&status=oncart`)
            .then((resoncart)=>{
                if(this.props.User.isLoggedIn){
                    // console.log(resoncart.data[0].transactiondetails.length)
                    this.props.cartCounter(resoncart.data[0].transactiondetails.length)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }


    render() { 
        return (
            <>
                <div style={{marginTop:"150px"}}> 
                    <div className="row" style={{paddingBottom:"5%"}}>                      
                        {this.renderProducts()}
                    </div>
                </div>
            </>
        )
    }
}


const MapStateToProps=(state)=>{
    return{
        User:state.Auth,
    }
}
export default connect(MapStateToProps, {cartCounter})(AllProducts);