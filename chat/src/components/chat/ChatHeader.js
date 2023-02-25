import React from "react";
import { withRouter } from "react-router-dom";
import Auth from "Auth";
import Avatar from "components/avatar";
import {Row,DropdownItem,DropdownMenu,DropdownToggle,Nav,UncontrolledDropdown} from "reactstrap";
import moment from "moment";



//ترويسة المحادثة

const ChatHeader = props => {
    
    const logout = () => {
        Auth.logout();
        window.location.reload();
    };
    
    

    const status = () => {
      if(props.typing) return "typing now";
      if(props.contact.status === true) return "online";
      //او عرض اخر ظهور
      if(props.contact.status) return moment(props.contact.status).fromNow()
    }
    return(
        <Row className="heading m-0">
           <div onClick={props.toggle}>
              <Avatar src={props.contact.avatar}/>
            </div>
        <div className="text-right">
          <div>{props.contact ? props.contact.name: ""}</div>
          <small>{status()}</small>
        </div>

        <Nav className="mr-auto" navbar>
          <UncontrolledDropdown>
            <DropdownToggle tag="a" className="Nav-link">
              <i className="fa fa-ellipsis-v"/>
            </DropdownToggle>

            <DropdownMenu>
            <DropdownItem onClick={e => props.history.push("/password")}>تغيير كلمة المرور</DropdownItem>
            <DropdownItem divider />
              <DropdownItem onClick={logout}>تسجيل خروج</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        </Row>
    );
}
export default ChatHeader;