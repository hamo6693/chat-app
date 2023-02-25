import React from "react";
import Message from "./Message";

class Messages extends React.Component{
    render() {

        return(
            <div id="messges">
               {this.props.messages.map(this.renderMessage)}
            </div>
        );
    }

    renderMessage = (message,index) => {
        //اذا لم يكن مستقبل الرسالة نفس المستخدم اذا الرسالة صادرة
        message.outgoing = message.receiver !== this.props.user.id;
        return <Message key={index} message={message}/>
    };
}
export default Messages;