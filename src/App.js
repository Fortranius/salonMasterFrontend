import React, {Component} from 'react';
import {MemoryRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Clients from './components/Clients';
import Masters from './components/Masters';
import Timetable from "./components/TimeTable";
import Products from "./components/Products";
import Expenses from "./components/Expenses";
import Incoming from "./components/Incoming";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import {PrivateRoute} from './route/PrivateRoute';
import Calendar from 'react-calendar';
import SideNav, {NavIcon, NavItem, NavText} from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {Title} from "./model/containers";
import 'font-awesome/css/font-awesome.min.css';
import logo from './logo_Lady_Land.png';
import Procedures from "./components/Procedures";
import Directory from "./components/Directory";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedPath: ''
        };
    }

    render() {
        return (
            <Router>
                <Route render={({location, history}) => (
                    <React.Fragment>
                        {localStorage.getItem('user') ? <SideNav defaultExpanded={true}
                            onSelect={(selected) => {
                                if (selected === 'logout') {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                                const to = '/' + selected;
                                if (location.pathname !== to) {
                                    history.push(to);
                                }
                            }}>
                            <SideNav.Nav defaultSelected="">
                                <Title><img src={logo} className='logo-image'/>Укротитель волос</Title>
                                <Calendar onChange={date => history.push("/?date=" + date)}/>
                                <NavItem eventKey="">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-home" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        График
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="masters">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-user" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        Мастера
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="clients">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-users" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        Клиенты
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="products">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-product-hunt" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        Аксессуары
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="incoming">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-plus-circle" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        Приход
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="expenses">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-minus-circle" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        Расход
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="procedures">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-cut" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        Услуги
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="dashboard">
                                    <NavIcon>
                                        <i className="fa fa-bar-chart-o fa-fw" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        Статистика
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="directory">
                                    <NavIcon>
                                        <i className="fa fa-book fa-fw" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        Справочники
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="logout">
                                    <NavIcon>
                                        <i className="fa fa-book fa-fw" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        Выход
                                    </NavText>
                                </NavItem>
                            </SideNav.Nav>
                        </SideNav> : null}
                        <main>
                            <Route path="/login" component={LoginPage}/>
                            <PrivateRoute exact path='/' component={Timetable}/>
                            <PrivateRoute path="/masters" component={Masters}/>
                            <PrivateRoute path="/clients" component={Clients}/>
                            <PrivateRoute path="/products" component={Products}/>
                            <PrivateRoute path="/incoming" component={Incoming}/>
                            <PrivateRoute path="/expenses" component={Expenses}/>
                            <PrivateRoute path="/procedures" component={Procedures}/>
                            <PrivateRoute path="/dashboard" component={Dashboard}/>
                            <PrivateRoute path="/directory" component={Directory}/>
                        </main>
                    </React.Fragment>
                )}
                />
            </Router>
    );
  }
}

export default App;
