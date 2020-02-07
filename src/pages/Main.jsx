import React from 'react';
import { BrowserRouter as Router , Route} from 'react-router-dom';
import Login from './Login'
import AdminIndex from './AdminIndex'
import Registered from './Registered'

const Main =()=>{
    return (
        <Router>
            <Route path='/' exact component={Login} />
            <Route path='/registered' exact component={Registered} />
            <Route path='/index/'  component={AdminIndex} />
        </Router>
    )
}
export default Main;