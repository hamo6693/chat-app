import React from 'react';
import {Route , Redirect} from "react-router-dom";


//في حال فشل عدم التحقق يتم توجيه الى redirect


const AppRoute = ({component:Component,can = () => true,redirect,...rest}) => (
    <Route {...rest}render = {(props) => {
       return can() ? <Component {...props}/> : <Redirect to = {redirect}/>
        

    }}/>
);

export default AppRoute;