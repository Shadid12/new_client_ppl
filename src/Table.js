import React from 'react';
import { render } from 'react-dom';
import ReactTable from 'react-table';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import 'react-table/react-table.css'

export default class Table extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            contacts: [],
            current: {},
            open: false
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

        const actions = [
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleClose}
            />,
            <FlatButton
              label="Delete"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleClose}
            />,
        ];

        return(
            <div>
                <ReactTable
                    data={data}
                    columns={columns}
                    defaultPageSize={5}

                    getTdProps = { (state, rowInfo, column, instance) => {
                        return {
                            onClick: (e, handleOriginal) => {
                               if(rowInfo.original) {
                                   this.setState({current: rowInfo.original,  open: true});
                               }
                            }
                        }
                        }
                    }
                />
                <Dialog
                    title="Delete this contact"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        floatingLabelText="Name"
                        value={this.state.current.name}
                    /><br />
                    <TextField
                        floatingLabelText="Gender"
                        value={this.state.current.gender}
                    /><br />
                    <TextField
                        floatingLabelText="Birthday"
                        value={this.state.current.birthdate}
                    /><br />
                </Dialog>
            </div>
        )
    }
    
    handleOpen = () => {
        this.setState({open: true});
      };
    
    handleClose = () => {
        this.setState({open: false});
    };
}