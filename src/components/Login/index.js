import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import {Component} from 'react'

import './index.css'

class Login extends Component {
  state = {
    onUserName: '',
    onPassword: '',
    loginError: false,
    errorMsg: '',
  }

  onLoginSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})

    history.replace('/')
  }

  onLoginError = errorMsg => {
    this.setState({loginError: true, errorMsg})
  }

  onUserNameInput = event => {
    this.setState({onUserName: event.target.value})
  }

  onPasswordInput = event => {
    this.setState({onPassword: event.target.value})
  }

  onSubmitDetails = async event => {
    event.preventDefault()
    const {onUserName, onPassword} = this.state

    const userDetails = {username: onUserName, password: onPassword}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginError(data.error_msg)
    }
  }

  render() {
    const {loginError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="container">
        <form className="form-container" onSubmit={this.onSubmitDetails}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-imag"
          />
          <div className="input-container">
            <label className="lable" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              className="inputss"
              id="username"
              onChange={this.onUserNameInput}
              placeholder="Username"
            />
          </div>
          <div className="input-container">
            <label className="lable" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              className="inputss"
              id="password"
              onChange={this.onPasswordInput}
              placeholder="Password"
            />
          </div>
          <button type="submit" className="button">
            Login
          </button>
          {loginError && <p className="error">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
