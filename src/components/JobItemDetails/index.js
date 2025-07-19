import {Component} from 'react'

import Cookies from 'js-cookie'

import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'

import {MdLocationOn} from 'react-icons/md'

import Loader from 'react-loader-spinner'

import Skills from '../Skills'

import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiJobDetailStatus = {
  initieal: 'INITIEAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  isProgress: 'PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobsItemDetail: '',
    apiJobDStatus: apiJobDetailStatus.initieal,
    similarDetail: '',
  }

  componentDidMount() {
    this.getJobsDetailss()
  }

  similarFormat = each => ({
    companyLogoUrl: each.company_logo_url,
    employmentType: each.employment_type,
    jobDescription: each.job_description,
    location: each.location,
    id: each.id,
    rating: each.rating,
    title: each.title,
  })

  skills = skill => ({
    imageUrl: skill.image_url,
    name: skill.name,
  })

  company = life => ({
    description: life.description,
    imageUrl: life.image_url,
  })

  format = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
    companyWebsiteUrl: data.company_website_url,
    lifeAtCompany: this.company(data.life_at_company),
    skills: data.skills.map(eachSkill => this.skills(eachSkill)),
  })

  getJobsDetailss = async () => {
    this.setState({apiJobDStatus: apiJobDetailStatus.isProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwttoken = Cookies.get('jwt_token')
    const optionsd = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwttoken}`,
      },
    }

    const responsedd = await fetch(jobDetailsApiUrl, optionsd)
    if (responsedd.ok === true) {
      const jobsDetails = await responsedd.json()
      const jobsDetailee = {
        jobDetails: this.format(jobsDetails.job_details),
        similarDetails: jobsDetails.similar_jobs.map(eachSimilar =>
          this.similarFormat(eachSimilar),
        ),
      }
      this.setState({
        jobsItemDetail: jobsDetailee.jobDetails,
        apiJobDStatus: apiJobDetailStatus.success,
        similarDetail: jobsDetailee.similarDetails,
      })
    } else {
      this.setState({apiJobDStatus: apiJobDetailStatus.failure})
    }
  }

  onCompanyDetails = () => {
    const {jobsItemDetail} = this.state
    const {lifeAtCompany} = jobsItemDetail
    const {description, imageUrl} = lifeAtCompany

    return (
      <div className="company-container">
        <h1 className="company-life">Life at Company</h1>
        <div className="text-image-container">
          <p className="description-text">{description}</p>
          <img src={imageUrl} alt="life at company" className="company-image" />
        </div>
      </div>
    )
  }

  getDetails = () => {
    const {jobsItemDetail, similarDetail} = this.state

    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      companyWebsiteUrl,
      skills,
    } = jobsItemDetail

    return (
      <div className="aboutContainer">
        <div className="each-job-item-containers">
          <div className="content-container">
            <div className="comanylogo-postion-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="logos-company"
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
              <div className="description-visit-container">
                <h1 className="description-headings">Description</h1>
                <a href={companyWebsiteUrl} className="links">
                  Visit
                </a>
              </div>
              <p className="descriptions">{jobDescription}</p>
            </div>
            <div className="skill-container">
              <h1 className="skill-heading">Skills</h1>
              <ul className="list-skill-container">
                {skills.map(eachSkill => (
                  <Skills skills={eachSkill} key={eachSkill.name} />
                ))}
              </ul>
            </div>
            <div>{this.onCompanyDetails()}</div>
          </div>
        </div>
        <div className="similar-container">
          <h1 className="similar-heading">Similar Jobs</h1>
          <ul className="similar-list-container">
            {similarDetail.map(eachSimilars => (
              <SimilarJobs
                key={eachSimilars.id}
                jobsDetailsSimilar={eachSimilars}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  getIsLoading = () => (
    <div className="loader-containers" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetryJobsss = () => {
    this.getJobsDetailss()
  }

  getFailureView = () => (
    <div className="empty-containers">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="no-jobs-image"
      />
      <h1 className="failure-msg">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for
      </p>
      <div className="failure-button-containers">
        <button
          type="button"
          onClick={this.onRetryJobsss}
          className="retry-button"
        >
          retry
        </button>
      </div>
    </div>
  )

  renderDetailsStatus = () => {
    const {apiJobDStatus} = this.state

    switch (apiJobDStatus) {
      case apiJobDetailStatus.success:
        return this.getDetails()
      case apiJobDetailStatus.failure:
        return this.getFailureView()
      case apiJobDetailStatus.isProgress:
        return this.getIsLoading()
      default:
        return null
    }
  }

  render() {
    return <div className="aboutContainer">{this.renderDetailsStatus()}</div>
  }
}
export default JobItemDetails
