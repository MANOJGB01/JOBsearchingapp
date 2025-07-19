import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => (
  <div>
    <Header />
    <div className="home-container">
      <div className="content-container">
        <h1 className="heading">
          Find The Job That <br />
          Fits Your Life
        </h1>
        <p className="texts">Millions of people are searching for jobs</p>
        <Link to="/jobs">
          <button type="button" className="find-button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </div>
)
export default Home
