import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'

import {MdLocationOn} from 'react-icons/md'

import {Link} from 'react-router-dom'

import './index.css'

const JobItem = props => {
  const {jobItems} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobItems

  return (
    <Link to={`/jobs/${id}`} className="link">
      <li className="each-job-item-container">
        <div className="content-container">
          <div className="comanylogo-postion-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="logo-company"
            />
            <div className="position-container">
              <h1 className="postion-heading">{title}</h1>
              <div className="ratings-container">
                <BsStarFill className="star-icon" />
                <p className="rating-number">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-type-annum-container">
            <div className="loaction-employmentType-container">
              <div className="loaction-container">
                <MdLocationOn className="loaction-icon" />
                <p className="loaction">{location}</p>
              </div>
              <div className="employmentType-container">
                <BsFillBriefcaseFill className="type-icon" />
                <p className="employmentType">{employmentType}</p>
              </div>
            </div>
            <p className="annum">{packagePerAnnum}</p>
          </div>
          <hr className="line3" />
          <div className="description-container">
            <h1 className="description-heading">Description</h1>
            <p className="description">{jobDescription}</p>
          </div>
        </div>
      </li>
    </Link>
  )
}
export default JobItem
