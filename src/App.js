import React, {Component} from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import './App.css';
import Clients from './components/Clients';
import Masters from './components/Masters';
import Calendar from "./components/Calendar";
import Services from "./components/Services";
import Products from "./components/Products";
import Expenses from "./components/Expenses";
import Dashboard from "./components/Dashboard";

class App extends Component {
  render() {
    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <ul className="navbar-nav mr-auto">
                        <li><Link to={'/'} className="nav-link">График</Link></li>
                        <li><Link to={'/masters'} className="nav-link">Мастера</Link></li>
                        <li><Link to={'/clients'} className="nav-link">Клиенты</Link></li>
                        <li><Link to={'/services'} className="nav-link">Услуги</Link></li>
                        <li><Link to={'/products'} className="nav-link">Товар</Link></li>
                        <li><Link to={'/expenses'} className="nav-link">Расходы</Link></li>
                        <li><Link to={'/dashboard'} className="nav-link">Статистика</Link></li>
                    </ul>
                </nav>
                <hr />
                <Switch>
                    <Route exact path='/' component={Calendar} />
                    <Route path='/masters' component={Masters} />
                    <Route path='/clients' component={Clients} />
                    <Route path='/services' component={Services} />
                    <Route path='/products' component={Products} />
                    <Route path='/expenses' component={Expenses} />
                    <Route path='/dashboard' component={Dashboard} />
                </Switch>
            </div>
        </Router>
    );
  }
}

export default App;
