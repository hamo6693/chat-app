import React,{Component} from "react";

import{BrowserRouter as Router, Switch} from 'react-router-dom';

import AppRoute from "AppRoute";

import {chat,Login,NotFound, Register,Password} from "views";

import Auth from "./Auth";


class App extends Component{

  constructor(props){
    super(props);
    Auth.init();
  }


  render() {
    return(

      <div id="main-container" className="container-fluid">
      <Router>
        <Switch>
           <AppRoute path="/" exact component={chat} can={Auth.auth} redirect="/login" />
           <AppRoute path="/password" component={Password} can={Auth.auth} redirect="/login" />
           <AppRoute path="/password" component={Password} can={Auth.auth} redirect="/login" />
           <AppRoute path="/Register" component={Register} can={Auth.guset} redirect="/" />
           <AppRoute path="/Login" component={Login} can={Auth.guset} redirect="/"  />
           <AppRoute component={NotFound}/>
        </Switch>
      </Router>
      </div>


    )
  }
}

export default App;
