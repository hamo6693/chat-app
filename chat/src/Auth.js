// deal with localStorge
import axios from "axios";

const Auth = {
    login:user => {
        localStorage.setItem("user",JSON.stringify(user));
        axios.defaults.headers.common['authorization'] = user.token;
    },

    init:() => {
        let user = JSON.parse(localStorage.getItem("user"));
        axios.defaults.headers.common['authorization'] = user !== null ? user.token:"";
    },

    //  توابع التحقق للتوجيه
    auth:() => localStorage.getItem("user") !== null,
    guset:() => localStorage.getItem("user") === null,
    logout:() => {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('user');
    },

    //جلب رمز التحقق
    getToken:()=>{
        let user = JSON.parse(localStorage.getItem("user"));
        return user !== null ? user.token: "";
    },
    //وحدة التحقق
    setUser:(newProfile) => {
        let user = JSON.parse(localStorage.getItem('user'));
        newProfile.token = user.token;
        localStorage.setItem('user',JSON.stringify(newProfile));
    },
};

export default Auth;