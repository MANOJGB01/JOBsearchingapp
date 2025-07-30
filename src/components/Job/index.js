import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
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
    selectedLocations: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getJobsData = async () => {
    this.setState({apiJobsStatus: apiJobStatusContants.isProgress})

    const {radioInput, onCheckBox, searchInput, selectedLocations} = this.state
    const employmentQuery = onCheckBox.join(',')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentQuery}&minimum_package=${radioInput}&search=${searchInput}`
    const jwt = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }

    const response = await fetch(jobsApiUrl, options)

    if (response.ok === true) {
      const jobsData = await response.json()
      const allJobs = jobsData.jobs.map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        employmentType: eachData.employment_type,
        jobDescription: eachData.job_description,
        id: eachData.id,
        location: eachData.location,
        packagePerAnnum: eachData.package_per_annum,
        rating: eachData.rating,
        title: eachData.title,
      }))

      const filteredJobs =
        selectedLocations.length > 0
          ? allJobs.filter(job => selectedLocations.includes(job.location))
          : allJobs

      this.setState({
        apiJobsStatus: apiJobStatusContants.success,
        jobsItemData: filteredJobs,
      })
    } else {
      this.setState({apiJobsStatus: apiJobStatusContants.failure})
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

  onEmpl = event => {
    const {id, checked} = event.target
    this.setState(prevState => {
      const updated = checked
        ? [...prevState.onCheckBox, id]
        : prevState.onCheckBox.filter(eachId => eachId !== id)
      return {onCheckBox: updated}
    }, this.getJobsData)
  }

  onLocationChange = event => {
    const {value, checked} = event.target
    this.setState(prevState => {
      const updatedLocations = checked
        ? [...prevState.selectedLocations, value]
        : prevState.selectedLocations.filter(loc => loc !== value)
      return {selectedLocations: updatedLocations}
    }, this.getJobsData)
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.getJobsData)
  }

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

  render() {
    const {
      apiStatus,
      apiJobsStatus,
      profileDetails,
      jobsItemData,
      searchInput,
      selectedLocations,
    } = this.state

    return (
      <div>
        <Header />
        <div className="job-containers">
          <div className="second-container">
            <div className="profile-selection-container">
              {/* Profile Info */}
              {apiStatus === 'SUCCESS' && (
                <div className="profile-container">
                  <div className="profile-con">
                    <img
                      src={profileDetails.profileImageUrl}
                      alt="profile"
                      className="profile-image"
                    />
                    <h1 className="name">{profileDetails.name}</h1>
                  </div>
                  <p className="text">{profileDetails.shortBio}</p>
                </div>
              )}

              {apiStatus === 'FAILURE' && (
                <div className="profile-failure-container">
                  <button type="button" onClick={this.getProfileData}>
                    Retry
                  </button>
                </div>
              )}

              {apiStatus === 'PROGRESS' && (
                <div className="loader-container" data-testid="loader">
                  <Loader
                    type="ThreeDots"
                    color="#ffffff"
                    height="50"
                    width="50"
                  />
                </div>
              )}

              <hr className="line" />
              <h1 className="type-emplyoment-heading">Type of Employment</h1>
              <ul className="employment-container">
                {employmentTypesList.map(eachemploye => (
                  <li
                    key={eachemploye.employmentTypeId}
                    className="list-employe"
                  >
                    <input
                      type="checkbox"
                      id={eachemploye.employmentTypeId}
                      onChange={this.onEmpl}
                    />
                    <label
                      htmlFor={eachemploye.employmentTypeId}
                      className="label"
                    >
                      {eachemploye.label}
                    </label>
                  </li>
                ))}
              </ul>
              <hr className="line2" />
              <h1 className="salary-heading">Salary Range</h1>
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
              <hr className="line2" />
              <div className="location-container">
                <h1 className="location-heading">Location</h1>
                <ul className="location-list">
                  {['Hyderabad', 'Bangalore', 'Chennai', 'Delhi', 'Mumbai'].map(
                    location => (
                      <li key={location}>
                        <input
                          type="checkbox"
                          id={location}
                          value={location}
                          onChange={this.onLocationChange}
                          checked={selectedLocations.includes(location)}
                        />
                        <label htmlFor={location} className="label">
                          {location}
                        </label>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            <div className="third-container">
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

              <div className="job-containerss">
                {jobsItemData.length === 0 ? (
                  <div className="no-jobs-container">
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                      alt="no jobs"
                      className="no-jobs-image"
                    />
                    <h1 className="no-jobs-heading">No Jobs Found</h1>
                    <p className="no-jobs-message">
                      We could not find any jobs. Try other filters
                    </p>
                  </div>
                ) : (
                  <ul className="jobs-container-list">
                    {jobsItemData.map(eachItem => (
                      <JobItem key={eachItem.id} jobItems={eachItem} />
                    ))}
                  </ul>
                )}

                {apiJobsStatus === 'FAILURE' && (
                  <div className="failure-view-container">
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                      alt="failure view"
                      className="failure-image"
                    />
                    <h1 className="failure-heading">
                      Oops! Something Went Wrong
                    </h1>
                    <p className="failure-message">
                      We cannot seem to find the page you are looking for
                    </p>
                    <button
                      type="button"
                      className="retry-button"
                      onClick={this.getJobsData} // This should re-fetch jobs
                    >
                      Retry
                    </button>
                  </div>
                )}

                {apiJobsStatus === 'PROGRESS' && (
                  <div className="loader-container" data-testid="loader">
                    <Loader
                      type="ThreeDots"
                      color="#ffffff"
                      height="50"
                      width="50"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Job
