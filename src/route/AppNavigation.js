import React from "react";
import styled from "styled-components";
import {Nav, NavIcon, SideNav} from 'react-sidenav'
import {Icon} from "react-icons-kit";
import {ic_home as home} from "react-icons-kit/md/ic_home";
import {ic_reorder as simple} from "react-icons-kit/md/ic_reorder";
import {ic_donut_large as render} from "react-icons-kit/md/ic_donut_large";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getAllMastersAction} from "../actions/masterActions";

const Text = styled.div`
  padding-left: 8px;
`;

const theme = {
    hoverBgColor: "#f5f5f5",
    selectionBgColor: "#f5f5f5",
    selectionIconColor: "#03A9F4"
};

export class AppNavigation extends React.Component {

    constructor(props) {
        super(props);
        this.props.masterActions();
    }

    render() {
        return (
            <div className="div-side-nav">
            <SideNav theme={theme} defaultSelectedPath={"timetable"}>
                <Nav id="timetable">
                    <NavIcon>
                        <Icon icon={simple} />
                    </NavIcon>
                    <Text>График</Text>
                </Nav>
                {this.props.masters ? <Nav id="masters">
                    <NavIcon>
                        <Icon icon={home} />
                    </NavIcon>
                    {this.props.masters.map((master) => {
                        return <Nav key={master.id} id={master.id}>{master.person.surname + master.person.name}</Nav>;
                    })}
                    <Text>Сотрдники</Text>
                </Nav> : null}
                <Nav id="clients">
                    <NavIcon>
                        <Icon icon={simple} />
                    </NavIcon>
                    <Text>Клиенты</Text>
                </Nav>
                <Nav id="dashboard">
                    <NavIcon>
                        <Icon icon={render} />
                    </NavIcon>
                    <Text>Статистика</Text>
                </Nav>
                <Nav id="expenses">
                    <NavIcon>
                        <Icon icon={render} />
                    </NavIcon>
                    <Text>Расходы</Text>
                </Nav>
                <Nav id="products">
                    <NavIcon>
                        <Icon icon={render} />
                    </NavIcon>
                    <Text>Товары</Text>
                </Nav>
            </SideNav>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);
