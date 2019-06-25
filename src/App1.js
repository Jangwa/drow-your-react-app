/* -dc App */
import React from 'react';
import logo from './logo.svg';
import { Cookies } from 'react-cookie';
import MyComponent from './MyComponent';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: ''
        };
    }
    logIn = () => {
        const frm = window.location.search.split('?redApp=')[1];
        const { username, password } = this.state;
        fetch('http://localhost:8000/o-auth/', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ username, password })
        }
        ).then(res => res.json()).then(resp => {
            if(resp.dToken) {
                console.log(resp.dToken)
                window.location = frm + '/?dToken='+resp.dToken;
            } else {
               console.log(resp.dToken); 
            }
        });
    }
    render () {
        return (
            <div className="App">
                {/* -dc The App Body */}
                This is your SSO
                <input
                    name="username"
                    onChange={(e) => this.setState({
                            username: e.target.value,
                        })
                    }
                />
                <MyComponent 
                    /* -dc -desc- Save user id in session */
                    /* -dc -desc- Save user name session */
                    /* -dc -call- MyComponent When user hover on register*/
                />
                <MyComponent 
                    /* -dc -call- RegisterComponent When User click on register */
                />
                {/* -dc The App Body */}
                {/* -dc The App Footer */}
                {/* -dc -call- AppFooter for all the pages */}
                <input
                    type="password"
                    name="password"
                    onChange={(e) => this.setState({
                        password: e.target.value,
                    })
                    }
                />
                {/* -dc The App Footer */}
                <button onClick={() => this.logIn()}>Login</button>
            </div>
        );
    }
}
/* -dc App */
export default App;
