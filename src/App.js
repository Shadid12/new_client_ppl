import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';
import './css/app.css';

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            token : ''
        }
    }

    render() {
        const activeState = this.state.token ? (
            <div className='main-container'>
                <GoogleLogout
                    buttonText="Logout"
                    onLogoutSuccess={this.logout}
                />
            </div>
        ) : (
            <div className='main-container'>
                <GoogleLogin
                    clientId="1043178444240-fit0566r45gcbvog4tei1pour1ba436t.apps.googleusercontent.com"
                    buttonText="Authorize"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                />
            </div>
        )
        return(
            <div>
                {activeState}
            </div>
        )
    }

    responseGoogle = (response) => {
        if(response.accessToken) {
            this.setState({token : response.accessToken});
        }
        else{
            console.log('Could not authorize');
        }
    }

    logout = () => {
        this.setState({ token: '' });
    }

}

const responseGoogle = (response) => {
    axios.defaults.headers.common['Authorization'] = "Bearer " + response.accessToken;
    if(response.accessToken) {
        this.setState({token : response.accessToken});
    }
    else{
        console.log('Could not authorize');
    }


    // Get contacts

    // let config = {
    //     headers: {'Authorization': "Bearer " + response.accessToken}
    // }
    // axios.get(
    //     'https://people.googleapis.com/v1/people/me/connections?personFields=names,birthdays,genders',
    //     config
    // )
    //   .then((res) => {
    //       console.log(res);
    // });

    // Create Contacts
    // let body = {
    //     "birthdays": [
    //       {
    //         "date": {
    //           "day": 1,
    //           "month": 7,
    //           "year": 96
    //         }
    //       }
    //     ],
    //     "names": [
    //       {
    //         "displayName": "",
    //         "givenName": "shadid"
    //       }
    //     ],
    //     "genders": [
    //       {
    //         "value": "male"
    //       } 
    //     ]
    // }
    // axios.post(
    //     'https://people.googleapis.com/v1/people:createContact',
    //     body
    // )
    //   .then((res) => {
    //       console.log(res);
    // });

    // Delete Request 
    // let toDel = 'people/c6704325163392934554'
    // axios.delete(
    //     `https://people.googleapis.com/v1/${toDel}:deleteContact`
    // ).then((res) => {
    //     console.log(res);
    // })
}