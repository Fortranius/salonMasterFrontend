import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import Clients from './components/Clients';
import Masters from './components/Masters';
import Calendar from "./components/Calendar";

class App extends Component {
  render() {
    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <ul className="navbar-nav mr-auto">
                        <li><Link to={'/'} className="nav-link"> Home </Link></li>
                        <li><Link to={'/masters'} className="nav-link">Contact</Link></li>
                        <li><Link to={'/clients'} className="nav-link">About</Link></li>
                    </ul>
                </nav>
                <hr />
                <Switch>
                    <Route exact path='/' component={Calendar} />
                    <Route path='/masters' component={Masters} />
                    <Route path='/clients' component={Clients} />
                </Switch>
            </div>
        </Router>
    );
  }
}

export default App;
