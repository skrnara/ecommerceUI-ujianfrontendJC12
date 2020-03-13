import React, {Component} from 'react';
import Axios from 'axios'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { MDBCarousel, MDBCarouselCaption, MDBCarouselInner, MDBCarouselItem, MDBView, MDBMask, MDBContainer } from
"mdbreact";
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
  } from 'reactstrap';
import { API_URL } from './../supports/ApiURL';
import Numeral from 'numeral';
import {FaCartPlus} from 'react-icons/fa';

class Home extends Component {
    state = { 
        images:[
            "./images/ui_img1.jpeg",
            "./images/ui_img2.jpeg",
            "./images/ui_img3.jpg"
        ],

        products:[]
    }

    renderProducts=()=>{
        return this.state.products.map((val, index)=>{
            return(
                <>
                <div className="col-md-3">
                    <Card>
                        <CardImg top width="100%" height="100%" src={val.image} alt="Card image cap" />
                        <div className="blackBox d-flex justify-content-center">
                            <Link to={`/productdetail/${val.id}`} className="insideButton">
                                <button className="buyNowButton px-3 py-2 btn-sm"><FaCartPlus/></button>
                            </Link>
                        </div>
                        <CardBody>
                        <CardTitle>{ val.name }</CardTitle>
                        <CardText>{ val.description }</CardText>
                        <CardSubtitle>{ `Rp.`+ Numeral(val.price).format(0,0)}</CardSubtitle>
                        <Button className="rounded-pill btn-sm" color="brown">View Products</Button>
                        </CardBody>
                    </Card>
                </div>
                </>
            )
        })
    }

    componentDidMount=()=>{
        Axios.get(`${API_URL}/products?_expand=category`)
        .then((res)=>{
            console.log(res.data)
            this.setState({products:res.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    renderImages=()=>{
        return this.state.images.map((val, index)=>{
            return (
                <>
                    <MDBCarouselItem itemId={index+1}>
                        <MDBView>
                            <img
                            className="d-block w-100"
                            src={val}
                            alt="slide-images"
                            />
                            <MDBMask overlay="black-light" />
                        </MDBView>
                        <MDBCarouselCaption>
                            <h3 className="h3-responsive">Light mask</h3>
                            <p>First text</p>
                        </MDBCarouselCaption>
                    </MDBCarouselItem>
                </>                
            )
        })
    }

    render() { 

        return ( 
            <>
                <div>                        
                <MDBCarousel
                activeItem={1}
                length={this.state.images.length}
                showControls={true}
                showIndicators={false}
                className="z-depth-1"
                >
                <MDBCarouselInner>
                    {this.renderImages()}
                </MDBCarouselInner>
                </MDBCarousel>                    
                </div>
                <br/><br/><br/><br/>

                <div className="row">
                    
                    {this.renderProducts()}
                </div>
            </>
        )
    }
}

//alternative way:
// const MapStateToProps=({Auth})=>{
//     return{
//         username:Auth.username
//     }
// }

const MapStateToProps=(state)=>{
    return{
        isLoggedIn:state.Auth.isLoggedIn
    }
}
export default connect(MapStateToProps)(Home);
