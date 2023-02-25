import React from "react";
import Avatar from "components/avatar";
import { Row } from "reactstrap";

const ContactHeader = props => (

    <Row className="heading">
    
    <Avatar src={props.user.avatar} />
    
    <div>جهات اتصال</div>
    

    <div className="mr-auto nav-link" onClick={props.toggle}>
       <i className="fa fa-bars"/>
    </div>

    </Row>
);

export default ContactHeader;