import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'

import {BsFillBriefcaseFill} from 'react-icons/bs'

import {FiLogOut} from 'react-icons/fi'

import {Link, withRouter} from 'react-router-dom'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>
          <ul className="nav-bar-mobile-icon-container">
            <li>
              <Link to="/">
                <AiFillHome className="nav-item-mobile-link " />
              </Link>
            </li>
            <li>
              <Link to="/jobs">
                <BsFillBriefcaseFill className="nav-item-mobile-link" />
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="nav-mobile-btn"
                onClick={onClickLogout}
              >
                <FiLogOut />
              </button>
            </li>
          </ul>
        </div>
        <div className="nav-bar-large-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="nav-link">
                Jobs
              </Link>
            </li>
          </ul>

          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
export default withRouter(Header)
