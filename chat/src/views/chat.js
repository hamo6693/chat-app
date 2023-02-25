import React from 'react';
import {Row,Spinner} from 'reactstrap';
import {ContactHeader,Contacts,ChatHeader,Messages,MessageForm,UserProfile,EditProfile} from "components";
import socketIo from "socket.io-client";
import Auth from 'Auth';


class chat extends React.Component{

    state = {
        contacts:[],
        contact:{},
        userProfile:false,
        profile:false,
    };

    componentDidMount(){
        
        this.initSocketConnection();
    }

    initSocketConnection = () => {
        let socket = socketIo(process.env.React_APP_SOCKET,{
            //نمرير الرمز للخادم
            query: "token=" + Auth.getToken()
        });
        socket.on("connect", () => this.setState({connected:true}));
        socket.on("disconnect", () => this.setState({connected:false}));
        // تعريف الحدث المسؤول عن جلب البيانات
        socket.on("data",(user,contacts,messages,users) => {
            let contact = contacts[0] || {};
            this.setState({messages,contacts,user,contact}, () => {
                this.updateUserState(users);
            });
        });

        //تعريف الحدث
        socket.on("new_user",this.onNewUser);
        //استعلام معلومات الحساب الجديد
        socket.on("update_user",this.onUpdateUser);
        socket.on("message",this.onNewMessage);
        //استقبال حالات المتصلين بشكل مستمر
        socket.on("user_status",this.updateUserState);
        //استقبال حدث الكتابة من الخادم
        socket.on("typing",this.onTypingMessage);

        socket.on("error",err => {
            //فشل الاتصال
            if(err === "auth_error"){
                //تسجيل الخروج
                Auth.logout();
                //اعادة توجيه
                this.props.history.push("/login");
                //window.location.reload();

            }
        });
        //التخزين في الحالة
        this.setState({socket})
    }

    //اضافة بيانات المستخدم الى جهات الاتصال
    onNewUser = user => {
        let contacts = this.state.contacts.concat(user);
        this.setState({contacts})
    }

    onUpdateUser = user => {
        //عند تحديث البيانات المستخدم حاليا
        if(this.state.user.id === user.id) {
            //نحدث متغير الحالة
            this.setState({user});
            //تحديث في ذاكرة المتصفح
            Auth.setUser(user);
            return;
        }
        let contacts = this.state.contacts;
        //البحث عن المستخدم وتحديثه
        contacts.forEach((element,index) => {
            if(element.id === user.id) {
                contacts[index] = user;
                contacts[index].status = element.status;
            }
        });
        this.setState({contacts});

        if(this.state.contact.id === user.id) this.setState({contact:user});
    }

    //حدث ارسال الرسالة
    onNewMessage = message => {
        if(message.sender === this.state.contact.id) {
            this.setState({typing:false});
            this.state.socket.emit("seen",this.state.contact.id);
            message.seen = true;
        }
        let messages = this.state.messages.concat(message);
        this.setState({messages});
    }

    onTypingMessage = sender => {
        if(this.state.contact.id !== sender) return;
        this.setState({typing:sender});
        //hide typing state
        clearTimeout(this.state.timeout);
        const timeout = setTimeout(this.typingTimeout,3000);
        this.setState({timeout});
    }
    typingTimeout = () => this.setState({typing:false});
    //اعداد عملية ارسال الرسالة
    sendMessage = message => {
        if(!this.state.contact.id) return;
        message.receiver = this.state.contact.id;
        let messages = this.state.messages.concat(message);
        this.setState({messages});
        this.state.socket.emit("message",message);


    }

    //send to server

    sendType = () => this.state.socket.emit("typing",this.state.contact.id);


    //تحديث حالة المتستخدم
    updateUserState = users => {
        let contacts = this.state.contacts;
        //للمرور على جهات الاتصال
        contacts.forEach((element, index) => {
            if(users[element.id]) contacts[index].status = users[element.id];
        });
        this.setState({contacts});
        let contact = this.state.contact;
        if(users[contact.id]) contact.status = users[contact.id];
        this.setState({contact});
    }



//فتح قائمة الاتصال
    onChatNavigate = contact => {
        this.setState({contact});
        //تحديث الرسائل المقروءة
        this.state.socket.emit("seen",contact.id);
        //تحديث الرسالة لتصبح مقروءة
        let messages = this.state.messages;
        messages.forEach((element,index) => {
            if(element.sender === contact.id) messages[index].seen = true;

        })
        this.setState({messages});
    }

    userProfileToggle = () => this.setState({userProfile: !this.state.userProfile});
    //updated status
    profileToggle = () => this.setState({profile: !this.state.profile});

    render() {
        if(!this.state.connected || !this.state.contacts || !this.state.messages) {
            return <Spinner id='loader' color='success' />
        }

        return(
            <Row className='h-100'>
            
            <div id='contacts-section' className='col-6 col-md-4'>
              <ContactHeader user={this.state.user} toggle={this.profileToggle}/>
            
              <Contacts 
              contacts={this.state.contacts} 
              messages={this.state.messages}
              onChatNavigate={this.onChatNavigate}
              />
              
              <UserProfile 
              contact={this.state.contact} 
              toggle={this.userProfileToggle}
              open={this.state.userProfile}/>

              <EditProfile 
              user={this.state.user} 
              toggle={this.profileToggle}
              open={this.state.profile}/>
            </div>
            
            <div id='messages-section' className='col-6 col-md-8'>
              <ChatHeader 
              contact={this.state.contact} 
              typing={this.state.typing}
              toggle={this.userProfileToggle}
              />
              {this.renderChat()}
              <MessageForm sender={this.sendMessage} sendType={this.sendType}/>
            </div>
            </Row>

           
        );
    }
    renderChat = () => {
        const{contact,user} = this.state;
        
        if(!contact) return;
        let messages = this.state.messages.filter(e => e.sender === contact.id || e.receiver === contact.id);
        return <Messages user={user} messages={messages}/>
    }

}

export default chat;