import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter, MDBIcon } from "mdbreact";

const FooterPage = () => {
  return (  
    <div style={{marginTop:"100px"}} className="footer">
        <MDBFooter color="black" className="font-small p-4 mt-4">
        <MDBContainer fluid className="text-center text-md-left">
            <MDBRow>
            <MDBCol md="4">
                <h5 className="title" style={{color:"white"}}>Minimalés</h5>
                <p style={{color:"white"}}>
                Fashion born in Asia. <br/>
                On trend. Online. On the go.
                </p>
            </MDBCol>
            <MDBCol md="4">
                <h5 className="title" style={{color:"white"}}>Info</h5>
                <p style={{color:"white"}}>
                Contact<br/>
                Career<br/>
                Press<br/>
                </p>
            </MDBCol>
            <MDBCol md="4">
                <h5 className="title" style={{color:"white"}}>Socials</h5>
                <ul>
                <li className="list-unstyled">
                    <a href="#!"><MDBIcon fab icon="instagram" style={{color:"white"}}/> Instagram</a>
                </li>
                <li className="list-unstyled">
                    <a href="#!"><MDBIcon fab icon="twitter" style={{color:"white"}}/> Twitter</a>
                </li>
                <li className="list-unstyled">
                    <a href="#!"><MDBIcon fab icon="facebook-f" style={{color:"white"}}/> Facebook</a>
                </li>
                <li className="list-unstyled">
                    <a href="#!"><MDBIcon fab icon="pinterest-p" style={{color:"white"}}/> Pinterest</a>
                </li>
                </ul>
            </MDBCol>
            </MDBRow>
        </MDBContainer>
        <div className="footer-copyright text-center py-3">
            <MDBContainer fluid style={{color:"white"}}>
            &copy; {new Date().getFullYear()} Copyright: Minimalés 
            </MDBContainer>
        </div>
        </MDBFooter>
    </div>
  )
}

export default FooterPage;