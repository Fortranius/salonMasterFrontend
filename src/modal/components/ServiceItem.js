import React, {Component} from 'react';
import '../../App.css';

class ServiceItem extends Component {

    constructor(props) {
        super(props);
        this.onClickDelete = this.onClickDelete.bind(this);
    }
    onClickDelete() {
        let index = parseInt(this.props.index);
        this.props.removeService(index);
    }

    render() {
        return (
            <li className="list-group-item ">
                <div>
                    {this.props.item.description}: {this.props.item.minPrice} руб.
                    {this.props.item.maxPrice?<span> - {this.props.item.maxPrice} руб.</span>: null}
                    { this.props.isRemove ? <button type="button" className="close" onClick={this.onClickDelete}>&times;</button>: null}
                </div>
            </li>
        );
    }
}

class ServiceList extends React.Component {
    render () {
        let items = this.props.services.map((item, index) => {
            return (
                <ServiceItem key={index} item={item} index={index} isRemove={this.props.isRemove} removeService={this.props.removeService} />
            );
        });
        return (
            <ul className="list-group"> {items} </ul>
        );
    }
}

export default ServiceList;
