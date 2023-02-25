import React from "react";
import {Link} from "react-router-dom";
import {Card,Form,Input,Button} from "reactstrap";
import { Error } from "components";
import Logo from "assets/logo.png";
import Auth from "Auth";
import axios from "axios";


class Register extends React.Component{

    state = {name:"",username:"",password:"",error:""};

    //لتغيير القيم
    onChange = e => this.setState({
        [e.target.name]:e.target.value,error:null
    })

    //لارسال القيم
    onSubmit = e => {
        e.preventDefault();
        let data = {
            name:this.state.name,
            username:this.state.username,
            password:this.state.password
        }
        axios.post('/api/auth/register',data).then(res => {
            //حفظ البيانات من الخادم
            Auth.login(res.data);
            //اعادة التوجيه الى الصفحة
            window.location.reload()
        })
        .catch(err => {
            this.setState({error:err.response.data.message});
        });
     }

    //لرسم الواجهة
    render() {
        return(
            <Card className="auth col-lg-3 col-sm-6">
            <Form onSubmit={this.onSubmit}>
                <img src={Logo} alt="" width="200" />
                <h5 className="mb-4">إنشاء حساب جديد</h5>
                <Error error={this.state.error}/>
                <Input value={this.state.name} name="name" onChange={this.onChange} placeholder="الاسم" required autoFocus />
                <Input value={this.state.username} name="username" onChange={this.onChange} placeholder="اسم المستخدم" required />
                <Input type="password" value={this.state.password} name="password" onChange={this.onChange} placeholder="كلمة المرور" required />
                <Button color="primary" block className="mb-3"> إنشاء </Button>
                <small><Link to="/login">تسجيل الدخول</Link></small>
                <p className="m-3 text-muted">&copy; { new Date().getFullYear() }</p>
            </Form>
        </Card>
        )
    }

}

export default Register;