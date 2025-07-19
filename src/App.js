import {Component} from 'react'

import {Route, Switch, Redirect} from 'react-router-dom'

import Home from './components/Home'

import Login from './components/Login'

import Job from './components/Job'

import ProtectedRoute from './components/ProtectedRoute'

import JobItemDetails from './components/JobItemDetails'

import NotFound from './components/NotFound'

import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/jobs" component={Job} />
        <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="not-found" />
      </Switch>
    )
  }
}

export default App
