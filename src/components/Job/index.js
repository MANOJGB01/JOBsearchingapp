import {Component} from 'react'

import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusContants = {
  initieal: 'INITIEAL',
  success: 'SUCCESS',
  isProgress: 'PROGRESS',
  failure: 'FAILURE',
}

const apiJobStatusContants = {
  initieal: 'INITIEAL',
  success: 'SUCCESS',
  isProgress: 'PROGRESS',
  failure: 'FAILURE',
}

class Job extends Component {
  state = {
    apiStatus: apiStatusContants.initieal,
    apiJobsStatus: apiJobStatusContants.initieal,
    profileDetails: '',
    jobsItemData: [],
    radioInput: '',
    searchInput: '',
    onCheckBox: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getJobsData = async () => {
    this.setState({apiJobsStatus: apiJobStatusContants.isProgress})

    const {radioInput, onCheckBox, searchInput} = this.state
    console.log(searchInput)

    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${onCheckBox}&minimum_package=${radioInput}&search=${searchInput}`
    const jwt = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }

    const responsed = await fetch(jobsApiUrl, options)
    if (responsed.ok === true) {
      const jobsData = await responsed.json()
      const formatJobData = jobsData.jobs.map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        employmentType: eachData.employment_type,
        jobDescription: eachData.job_description,
        id: eachData.id,
        location: eachData.location,
        packagePerAnnum: eachData.package_per_annum,
        rating: eachData.rating,
        title: eachData.title,
      }))
      this.setState({
        apiJobsStatus: apiJobStatusContants.success,
        jobsItemData: formatJobData,
      })
    } else {
      this.setState({
        apiJobsStatus: apiJobStatusContants.failure,
      })
    }
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusContants.isProgress})

    const apiProfileUrl = 'https://apis.ccbp.in/profile'
    const jwt = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }

    const responsed = await fetch(apiProfileUrl, options)
    if (responsed.ok === true) {
      const profileData = [await responsed.json()]

      const updateProfile = profileData.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))
      this.setState({
        apiStatus: apiStatusContants.success,
        profileDetails: updateProfile[0],
      })
    } else {
      this.setState({apiStatus: apiStatusContants.failure})
    }
  }

  renderProfile = () => {
    const {profileDetails} = this.state

    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-container">
        <div className="profile-con">
          <img src={profileImageUrl} alt="profile" className="profile-image" />
          <h1 className="name" key="name">
            {name}
          </h1>
        </div>
        <p className="text">{shortBio}</p>
      </div>
    )
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetryProfile = () => {
    this.getProfileData()
  }

  renderFailure = () => (
    <div className="failure-button-container">
      <button
        type="button"
        className="failure-button"
        onClick={this.onRetryProfile}
      >
        retry
      </button>
    </div>
  )

  onRenderProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusContants.success:
        return this.renderProfile()
      case apiStatusContants.isProgress:
        return this.renderLoading()
      case apiStatusContants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.getJobsData)
  }

  onEmpl = event => {
    this.setState({onCheckBox: event.target.id}, this.getJobsData)
  }

  onEmpoyment = () => (
    <ul className="employment-container">
      {employmentTypesList.map(eachemploye => (
        <li key={eachemploye.employmentTypeId} className="list-employe">
          <input
            type="checkbox"
            id={eachemploye.employmentTypeId}
            onChange={this.onEmpl}
          />
          <label htmlFor={eachemploye.employmentTypeId} className="label">
            {eachemploye.label}
          </label>
        </li>
      ))}
    </ul>
  )

  salaryRange = () => (
    <ul className="salarys-container">
      {salaryRangesList.map(eachSalary => (
        <li key={eachSalary.salaryRangeId} className="list-employe">
          <input
            type="radio"
            id={eachSalary.salaryRangeId}
            onChange={this.onGetRadioOption}
            name="option"
          />
          <label htmlFor={eachSalary.salaryRangeId} className="label">
            {eachSalary.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearch = () => {
    this.getJobsData()
  }

  onSubmit = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onSearching = () => {
    const {searchInput} = this.state

    return (
      <div className="search-container">
        <input
          type="search"
          className="inputtext"
          onChange={this.onSearchInput}
          onKeyDown={this.onSubmit}
          value={searchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="icon-container"
          onClick={this.onSearch}
        >
          <BsSearch className="icon" />
        </button>
      </div>
    )
  }

  onRetryJobses = () => {
    this.setState({searchInput: ''}, this.getJobsData)
  }

  onJobsItems = () => {
    const {jobsItemData} = this.state
    const emptyItems = jobsItemData.length === 0
    if (emptyItems) {
      return (
        <div className="empty-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image"
          />
          <h1 className="failure-msg">No Found Job</h1>
          <p className="failure-text">
            We Could not find any jobs.Try other filters.
          </p>
          <div className="failure-button-containers">
            <button
              type="button"
              onClick={this.onRetryJobses}
              className="retry-button"
            >
              retry
            </button>
          </div>
        </div>
      )
    }
    return (
      <ul className="jobs-container-list">
        {jobsItemData.map(eachItem => (
          <JobItem key={eachItem.id} jobItems={eachItem} />
        ))}
      </ul>
    )
  }

  isLoading = () => (
    <div className="loead-container">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  onRetryJobss = () => {
    this.getJobsData()
  }

  onJobsFailureView = () => (
    <div className="empty-container">
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
          onClick={this.onRetryJobss}
          className="retry-button"
        >
          retry
        </button>
      </div>
    </div>
  )

  onJobRenderStatus = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiJobStatusContants.success:
        return this.onJobsItems()
      case apiJobStatusContants.failure:
        return this.onJobsFailureView()
      case apiJobStatusContants.isProgress:
        return this.isLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="job-containers">
          <div className="second-container">
            <div className="profile-selection-container">
              {this.onRenderProfile()}
              <hr className="line" />
              <div className="emploements-container">
                <h1 className="type-emplyoment-heading">Type of Employment</h1>
                {this.onEmpoyment()}
              </div>
              <hr className="line2" />
              <div className="salary-container">
                <h1 className="salary-heading">Salary Range</h1>
                {this.salaryRange()}
              </div>
            </div>
            <div className="third-container">
              {this.onSearching()}
              <div className="job-containerss">{this.onJobRenderStatus()}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Job
