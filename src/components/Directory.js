import React, {Component} from 'react';
import '../App.css';
import {getAllHairCategories, getAllHairs} from "../service/hairService";
import BootstrapTable from 'react-bootstrap-table-next';
import colHair from "../data/colHair";
import colHairCategory from "../data/colHairCategory";

class Directory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hairsCategory: [],
            hairs: []
        };
        getAllHairCategories().then(data => {
            this.setState({
                hairsCategory: data
            })
        });
        getAllHairs().then(data => {
            this.setState({
                hairs: data
            })
        });
    }

    render() {
        return (
            <div className="main-div">
                <h4>
                    Прайс стоимсоти услуг мастеров:
                </h4>
                <BootstrapTable
                    keyField="price"
                    data={this.state.hairsCategory}
                    columns={colHairCategory}
                />
                <hr/>
                <h4>
                    Прайс стоимости волос:
                </h4>
                <BootstrapTable
                    keyField="minLength"
                    data={this.state.hairs}
                    columns={colHair}
                />
            </div>
        );
    }
}

export default Directory;
