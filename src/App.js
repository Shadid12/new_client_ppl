import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Table from './Table';

import data from './data.json';
import './css/app.css';

export default class App extends React.Component {
    constructor(props){
        super(props);

        /**
         * Create a date object
         * this will be default date in the birthday picker
         */

        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 1);
        minDate.setHours(0, 0, 0, 0);

        this.state = {
            token : '',
            open: false,
            name: '',
            gender: '',
            date: minDate,
            tableVisible: true
        }
    }

    render() {

        /**
         * Array of button component
         * We put them in our create contact modal
         */

        const actions = [
            // fire up the create new contact action
            <FlatButton
              label="Submit"
              secondary={true}
              disabled={!this.state.name || !this.state.gender || !this.state.date}
              onClick={this.handleSubmit}
            />,
            // exits out of the modal
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleClose}
            />,
        ];

        /**
         * table component
         * can be toggled by clicking the table button
         **/
        const table = this.state.tableVisible ? (
            <div className='table-container'>
                <Table token={this.state.token} reload={this.reloadTable}/>
            </div>
        ) : 
        <h3>Click on Table Button to view Table</h3>;

        /**
         * if user is not signed in show them authorize button
         * else show them the main view
         */

        const activeState = this.state.token ? (
            <div>
                <div className='main-container'>
                    <GoogleLogout
                        buttonText="Logout"
                        onLogoutSuccess={this.logout}
                    />
                </div>
                <div className='three-button--container'>
                    <div className='item'>
                        <RaisedButton label="Table" primary={true} onClick={this.showTable}/>
                    </div>
                    <div className='item'>
                        <RaisedButton label="Create" primary={true} onClick={this.openCreate} />
                    </div>
                </div>
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                >
                    <div>
                        <div>Create a new Contact</div>
                        <TextField
                            hintText="Name"
                            floatingLabelText="Name"
                            value={this.state.name}
                            onChange={this.onNameChange}
                        /><br />
                        <TextField
                            hintText="Gender"
                            floatingLabelText="Gender"
                            value={this.state.gender}
                            onChange={this.onGenderChange}
                        /><br />
                        <DatePicker 
                            hintText="Birthday"
                            defaultDate={this.state.date}
                            onChange={this.onDateChange}
                        />
                    </div>
                </Dialog>
                {table}
            </div>
        ) : (
            // shows the login button when not logged in 
            <div className='main-container'>
                <GoogleLogin
                    clientId={data.key}
                    buttonText="Authorize"
                    scope="https://www.googleapis.com/auth/contacts"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                />
            </div>
        )
        
        // main div section
        return(
            <div>
                <MuiThemeProvider>
                    {activeState}
                </MuiThemeProvider>
            </div>
        )
    }

    /**
     * Gets response from google and sets the auth token
     * 
     */
    responseGoogle = (response) => {
        if(response.accessToken) {
            this.setState({token : response.accessToken});
            axios.defaults.headers.common['Authorization'] = "Bearer " + response.accessToken;
            // TODO
            // save and retrive from local storage
        }
        else {
            console.log('Could not authorize');
        }
    }

    /**
     * Logs out user
     */
    logout = () => {
        this.setState({ token: '' });
        axios.defaults.headers.common['Authorization'] = '';
        // TODO detroy local storage auth token  
    }

    /**
     * Open the create modal
     */
    openCreate = () => {
        this.setState({open: true});
    }

    /**
     * close the modal
     */
    handleClose = () => {
        this.setState({open: false});
    }

    /**
     * helpers to count for state change 
     */
    onNameChange = (event) => {
        this.setState({name: event.target.value});
    }

    onGenderChange = (event) => {
        this.setState({gender: event.target.value});
    }

    onDateChange = (event, date) => {
        console.log(date);
        this.setState({date: date});
    }

    showTable = () => {
        this.setState({tableVisible: !this.state.tableVisible});
    }

    /**
     * Handle Submit
     */
    handleSubmit = () => {
        // create a contact
        // payload
        let body = {
            "birthdays": [
                {
                    "text": ""
                }
            ],
            "names": [
                {
                    "displayName": "",
                    "givenName": ""
                }
            ],
            "genders": [
                {
                    "value": ""
                } 
            ]
        }

        // populate the payload object
        body.birthdays[0].text = this.state.date;
        body.names[0].displayName = this.state.name;
        body.names[0].givenName = this.state.name;
        body.genders[0].value = this.state.gender;

        // make the post request
        axios.post(
            'https://people.googleapis.com/v1/people:createContact',
            body
        )
        .then((res) => {

            const minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - 1);
            minDate.setHours(0, 0, 0, 0);

            this.setState({tableVisible: false});
            this.setState({
                tableVisible: true,
                open: false,
                name: '',
                gender: '',
                date: minDate
            });
            console.log(res);
        });
    }

    reloadTable = () => {
        this.setState({tableVisible: !this.state.tableVisible});
        this.setState({tableVisible: !this.state.tableVisible});
    }

}

const responseGoogle = (response) => {
    axios.defaults.headers.common['Authorization'] = "Bearer " + response.accessToken;
    if(response.accessToken) {
        this.setState({token : response.accessToken});
    }
    else {
        console.log('Could not authorize');
    }
}