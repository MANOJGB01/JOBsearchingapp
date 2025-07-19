import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'

import {MdLocationOn} from 'react-icons/md'

import './index.css'

const SimilarJobs = props => {
  const {jobsDetailsSimilar} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobsDetailsSimilar

  return (
    <li className="each-job-item-containerr">
      <div className="content-container">
        <div className="comanylogo-postion-container">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="logo-companys"
          />
          <div className="position-container">
            <h1 className="postion-headings">{title}</h1>
            <div className="ratings-container">
              <BsStarFill className="star-icon" />
              <p className="rating-number">{rating}</p>
            </div>
          </div>
        </div>
        <div className="description-container">
          <h1 className="description-heading">Description</h1>
          <p className="description">{jobDescription}</p>
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
      </div>
    </li>
  )
}
export default SimilarJobs
