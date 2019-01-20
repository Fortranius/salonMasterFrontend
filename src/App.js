import React, {Component} from 'react';
import {MemoryRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Clients from './components/Clients';
import Masters from './components/Masters';
import Timetable from "./components/TimeTable";
import Products from "./components/Products";
import Expenses from "./components/Expenses";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import {PrivateRoute} from './route/PrivateRoute';
import Calendar from 'react-calendar';
import SideNav, {Nav, NavIcon, NavItem, NavText, Toggle} from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {getAllMastersAction} from "./actions/masterActions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Title} from "./model/containers";
import 'font-awesome/css/font-awesome.min.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedPath: ''
        };
        this.props.masterActions();
    }

    render() {
        return (
            <Router>
                <Route render={({location, history}) => (
                    <React.Fragment>
                        <SideNav defaultExpanded={true}
                            onSelect={(selected) => {
                                const to = '/' + selected;
                                if (location.pathname !== to) {
                                    history.push(to);
                                }
                            }}>
                            <SideNav.Nav defaultSelected="">
                                <Title>Укротитель волос</Title>
                                <Calendar/>
                                <NavItem eventKey="">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-home" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        График
                                    </NavText>
                                </NavItem>
                                {this.props.masters ? <NavItem eventKey="masters">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-user" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        Мастера
                                    </NavText>
                                    {this.props.masters.map((master) => {
                                        return <NavItem key={master.id} eventKey="masters/1" >
                                            <NavText>
                                                {master.person.name}
                                            </NavText>
                                        </NavItem>;
                                    })}
                                </NavItem>: null}
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
                                        Товары
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="expenses">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-minus-circle" style={{fontSize: '1.75em'}}/>
                                    </NavIcon>
                                    <NavText>
                                        Расходы
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
                            </SideNav.Nav>
                        </SideNav>
                        <main>
                            <Route path="/login" component={LoginPage}/>
                            <PrivateRoute exact path='/' component={Timetable}/>
                            <PrivateRoute path="/masters" component={Masters}/>
                            <PrivateRoute path="/clients" component={Clients}/>
                            <PrivateRoute path="/products" component={Products}/>
                            <PrivateRoute path="/expenses" component={Expenses}/>
                            <PrivateRoute path="/dashboard" component={Dashboard}/>
                        </main>
                    </React.Fragment>
                )}
                />
            </Router>
    );
  }
}

const mapStateToProps = state => ({
    masters: state.masterReducer.allMasters
});

function mapDispatchToProps(dispatch) {
    return {
        masterActions: bindActionCreators(getAllMastersAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
