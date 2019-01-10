import React, {Component} from 'react';
import '../App.css';
import '../style.css';
import {Bar, Pie} from 'react-chartjs-2';
import {getDashboardAll, getDashboardMasters} from "../service/dashboardService";

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            masters: undefined,
            all: undefined
        };
        getDashboardMasters().then(data => {
            let labels = [];
            let incomes = [];
            let costs = [];
            data.forEach(masterPerformance => {
                labels.push(masterPerformance.master.person.surname + " " +
                    masterPerformance.master.person.name + " " +  masterPerformance.master.person.patronymic);
                costs.push(masterPerformance.cost);
                incomes.push(masterPerformance.income);
            });
            this.setState({
                masters: {
                    labels: labels,
                    datasets: [

                        {
                            label: 'Расходы',
                            backgroundColor: 'rgba(255,150,132,0.2)',
                            borderColor: 'rgba(255,150,132,1)',
                            borderWidth: 1,
                            hoverBackgroundColor: 'rgba(255,150,132,0.4)',
                            hoverBorderColor: 'rgba(255,150,132,1)',
                            data: costs
                        },
                        {
                            label: 'Доходы',
                            backgroundColor: 'rgba(255,99,132,0.2)',
                            borderColor: 'rgba(255,99,132,1)',
                            borderWidth: 1,
                            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                            hoverBorderColor: 'rgba(255,99,132,1)',
                            data: incomes
                        }
                    ]
                }
            });
        });
        getDashboardAll().then(data => {
            this.setState({
                all: {
                    labels: [
                        'Доходы',
                        'Расходы',
                    ],
                    datasets: [{
                        data: [data.income,data.cost],
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56'
                        ],
                        hoverBackgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56'
                        ]
                    }]
                }
            });
        });
    }

    render() {
        return (
            <div>
                {this.state.masters ? <div>
                    <h2>Доходы и расходы мастеров</h2>
                    <Bar
                        data={this.state.masters}
                        width={50}
                        height={50}
                        options={{
                            maintainAspectRatio: false
                        }}
                    />
                    <hr/>
                </div> : null}
                {this.state.all ? <div>
                    <h2>Общие доходы и расходы</h2>
                    <Pie data={this.state.all} height={50} />
                    <hr/>
                </div> : null}
            </div>
        );
    }
}

export default Dashboard;
