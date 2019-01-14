import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.css';
import Clients from './components/Clients';
import Masters from './components/Masters';
import Timetable from "./components/TimeTable";
import Services from "./components/Services";
import Products from "./components/Products";
import Expenses from "./components/Expenses";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import {PrivateRoute} from './route/PrivateRoute';
import AppNavigation from "./route/AppNavigation";
import {AppContainer, Body, Navigation, Title} from "./model/containers";
import Calendar from 'react-calendar';

class App extends Component {
  render() {
    return (
        <AppContainer>
            <Navigation>
                <Title>Укротитель волос</Title>
                <Calendar />
                <AppNavigation />
            </Navigation>
            <Body>
            <Switch>
                <Route path="/login" component={LoginPage} />
                <PrivateRoute exact path='/' component={Timetable} />
                <PrivateRoute path="/masters" component={Masters} />
                <PrivateRoute path="/clients" component={Clients} />
                <PrivateRoute path="/services" component={Services} />
                <PrivateRoute path="/products" component={Products} />
                <PrivateRoute path="/expenses" component={Expenses} />
                <PrivateRoute path="/dashboard" component={Dashboard} />
            </Switch>
            </Body>
        </AppContainer>
    );
  }
}

export default App;
