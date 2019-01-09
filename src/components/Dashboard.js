import React, {Component} from 'react';
import '../App.css';
import '../style.css';
import {Bar, Pie} from 'react-chartjs-2';

class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const data = {
            labels: ['January'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
                ,
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        };
        const data2 = {
            labels: [
                'Доходы',
                'Расходы',
            ],
            datasets: [{
                data: [300, 50],
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
        };

        return (
            <div>
                <div>
                    <h2>Доходы мастеров</h2>
                    <Bar
                        data={data}
                        width={50}
                        height={50}
                        options={{
                            maintainAspectRatio: false
                        }}
                    />
                    <hr/>
                </div>
                <div>
                    <h2>Расходы мастеров</h2>
                    <Bar
                        data={data}
                        width={50}
                        height={50}
                        options={{
                            maintainAspectRatio: false
                        }}
                    />
                    <hr/>
                </div>
                <div>
                    <h2>Общие доходы и расходы</h2>
                    <Pie data={data2} height={50} />
                    <hr/>
                </div>
            </div>
        );
    }
}

export default Dashboard;
