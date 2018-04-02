import React from 'react';
import { render } from 'react-dom';
import ReactTable from 'react-table';
import axios from 'axios';
import 'react-table/react-table.css'

export default class Table extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            contacts: []
        };

    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = "Bearer " + this.props.token;
        axios.get(
            'https://people.googleapis.com/v1/people/me/connections?personFields=names,birthdays,genders'
        )
        .then((res) => {
            this.setState({contacts: res.data});
        });
    }

    render() {
        let data = [];
        if (this.state.contacts.connections) {

            this.state.contacts.connections.map( (c) => {
                let pplObject = {
                    id: '',
                    name: '',
                    gender: '',
                    birthdate: ''
                };
                if(c.resourceName){
                    pplObject.id = c.resourceName;
                }
                if(c.names) {
                    if(c.names[0].displayName) {
                        pplObject.name = c.names[0].displayName;
                    }
                    if(c.names[0].givenName) {
                        pplObject.name = c.names[0].givenName;
                    }
                }
                if(c.genders) {
                    pplObject.gender = c.genders[0].value;
                }
                if(c.birthdays) {
                    pplObject.birthdate = c.birthdays[0].text;
                }
            data.push(pplObject);
            
            })
        }
        const columns = [
            {
                Header: 'Name',
                accessor: 'name' 
            }, 
            {
                Header: 'Birthday',
                accessor: 'birthdate',
                Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
            }, 
            {
                Header: 'Gender',
                accessor: 'gender'
            }
        ]


        return(
            <div>
                <ReactTable
                    data={data}
                    columns={columns}
                    defaultPageSize={5}

                    getTdProps = { (state, rowInfo, column, instance) => {
                        return {
                            onClick: (e, handleOriginal) => {
                                console.log('A Td Element was clicked!')
                                console.log('it produced this event:', e)
                                console.log('It was in this column:', column)
                                console.log('It was in this row:', rowInfo)
                                console.log('It was in this table instance:', instance)
                            }
                        }
                        }
                    }
                />
            </div>
        )
    }    
}