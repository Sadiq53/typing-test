import React, { useEffect, useState } from 'react'
import Header from '../../../../shared/header/Header'
import Footer from '../../../../shared/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import UpdatePassModal from './UpdatePassModal'
import { resetState } from '../../../../../redux/UserDataSlice'
import { hitToast } from '../../../../shared/Toast/LoginToast'
import { dynamicToast } from '../../../../shared/Toast/DynamicToast'

const UserDashBoard = () => {

  const rawUserData = useSelector(state => state.UserDataSlice.userData) 
  const matches1Min = useSelector(state => state.UserDataSlice.match1) 
  const matches3Min = useSelector(state => state.UserDataSlice.match3) 
  const matches5Min = useSelector(state => state.UserDataSlice.match5) 
  const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled) 
  const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg) 
  const [formattedDate, setFormattedDate] = useState();
  const dispatch = useDispatch();
  const [totalMatchesCompleted, setTotalMatchesCompleted] = useState(0);
  const [totalTimeOfMatches, setTotalTimeOfMatches] = useState(0);
  const [match1MinData, setMatch1MinData] = useState([])
  const [match3MinData, setMatch3MinData] = useState([])
  const [match5MinData, setMatch5MinData] = useState([])

// for finding the total matches----------------------------------------------------
useEffect(()=>{

  setTotalMatchesCompleted(matches1Min?.length + matches3Min?.length + matches5Min?.length)

  // calculate total time of all mathes played----------------------------------------------

const convertSecondsToFormattedTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600); // Get the number of hours
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Get the number of minutes
  const seconds = totalSeconds % 60; // Get the remaining seconds

  // Format minutes and seconds to always be two digits
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  // Return the formatted time
  return `${hours}:${formattedMinutes}:${formattedSeconds}`;
};

const calculateTotalTime = (matches1Min?.length * 60) + (matches3Min?.length * 180) + (matches5Min?.length * 300)
setTotalTimeOfMatches(convertSecondsToFormattedTime(calculateTotalTime))

// calculate total time of all mathes played--------------------------------------------------------

},[matches1Min, matches3Min, matches5Min])
// for finding the total matches----------------------------------------------------

// for setting time or converting it----------------------------------------------------
useEffect(() => {
  updateMatchesData('match1')
  if (rawUserData?.createdate) {
    // Try converting the date string to a JavaScript Date object
    const rawDate = rawUserData.createdate;
    
    // Check if the rawDate is valid and then parse it
      const parsedDate = new Date(rawDate);
      
      if (!isNaN(parsedDate)) {
        // Format the valid date to '04 Oct 2024' format
        setFormattedDate(
          new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).format(parsedDate)
        );
      } else {
        console.error('Invalid date format:', rawDate);
      }
    }
  }, [rawUserData]);
  // for setting time or converting it----------------------------------------------------
  
  // update the matches data based on time seperation----------------------------------------------------
  
  const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0; // Avoid division by zero
    const sum = numbers.reduce((acc, num) => acc + num, 0); // Sum the numbers
    return sum / numbers.length; // Return the average
  };
  
  const updateMatchesData = (match) => {
    const splitFncName = {
      match1: matches1Min,
      match3: matches3Min,
      match5: matches5Min,
    };
  
    const functName = splitFncName[match];
  
    // Check if functName is valid
    if (!functName) {
      console.error(`Invalid match type: ${match}`);
      return;
    }
  
    // Create a structure to hold difficulty data
    const difficultyData = {
      easy: [],
      medium: [],
      hard: [],
    };
  
    // Populate difficulty data
    functName.forEach((value) => {
      if (difficultyData[value.level]) {
        difficultyData[value.level].push(value);
      }
    });
  
    // Prepare final data object
    const finalData = {};
  
    Object.keys(difficultyData).forEach((level) => {
      const matches = difficultyData[level];
      finalData[`${level}Matches`] = matches.length;
      finalData[`avgAcc${capitalizeFirstLetter(level)}`] = Math.round(calculateAverage(matches.map(m => Math.floor(m.accuracy?.slice(-1)[0] || 0))));
      finalData[`avgConsis${capitalizeFirstLetter(level)}`] = Math.round(calculateAverage(matches.map(m => Math.floor(m.consistency?.slice(-1)[0] || 0))));
      finalData[`avgWpm${capitalizeFirstLetter(level)}`] = Math.round(calculateAverage(matches.map(m => Math.floor(m.wpm?.slice(-1)[0] || 0))));
    });
  
    // Update state based on match type
    switch (match) {
      case 'match1':
        setMatch1MinData(finalData);
        break;
      case 'match3':
        setMatch3MinData(finalData);
        break;
      case 'match5':
        setMatch5MinData(finalData);
        break;
      default:
        console.warn(`Unhandled match type: ${match}`);
    }
  };
  
  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // update the matches data based on time seperation----------------------------------------------------
  
  useEffect(()=>{
    if(isFullfilled) {
      dispatch(resetState())
    }
  }, [ isFullfilled ])

  useEffect(()=>{
    if(localStorage.getItem('isSignin')) {
      dynamicToast({ message: 'Logged in Successfully!', icon: 'success' });
      setTimeout(()=>{
        localStorage.removeItem('isSignin')
      }, 3500)
    }
  },[])

  return (
    <>
      <Header />
      <section className='user-profile py-5'>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="profile-layout">
                <div className="profile-sec1">
                  <div><img src="/assets/images/profile.png" alt="" /></div>
                  <div className='text-center mt-68'>
                    <h4 className='font-active'>{rawUserData?.username}</h4>
                    <hp className='font-idle'>Joined {formattedDate ? formattedDate : null}</hp>
                  </div>
                </div>
                  <div className="profile-sec2">
                    {/* Name Input Section */}
                    <div className="profile-input my-3">
                      <div>
                        <label htmlFor="Name">Name :</label>
                        <button
                        type="submit"
                        >
                          <i className="fa-regular text-idle fa-pen-to-square"></i>
                        </button>
                      </div>
                      <input
                        name="username"
                        readOnly
                        value={rawUserData?.username}
                        type="text"
                        placeholder="User Name"
                      />
                    </div>

                    {/* Email Input Section */}
                    <div className="profile-input my-3">
                      <div>
                        <label htmlFor="email">Current Email :</label>
                        <button
                        type="button"
                        >
                            <i className="fa-regular text-idle fa-pen-to-square"></i>
                        </button>
                      </div>
                      <input
                        name="email"
                        readOnly
                        value={rawUserData?.email}
                        type="email"
                        placeholder="Email ID"
                      />
                    </div>

                    {/* Password Section */}
                    <div className="profile-input my-3">
                      <div>
                        <label htmlFor="password">Current Password :</label>
                        <button type="button" data-bs-toggle="modal" data-bs-target="#updatepassword">
                          <i className="fa-regular text-idle fa-pen-to-square"></i>
                        </button>
                      </div>
                      <input
                        name="password"
                        readOnly
                        value={rawUserData?.password}
                        type="password"
                        placeholder="Current Password"
                      />
                    </div>
                  </div>
                <div className="profile-sec3">
                  <NavLink to="/user/signout" className="theme-btn width-100">Logout</NavLink>
                  <button className="delete-btn">Delete Account</button>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="profile-stacs">
                <div className="stacs">
                  <div>
                    <h4>Test Started</h4>
                    <h2>{totalMatchesCompleted}</h2>
                  </div>
                  <div>
                    <h4>Test Completed</h4>
                    <h2>26</h2>
                  </div>
                  <div>
                    <h4>Time Typing</h4>
                    <h2>{totalTimeOfMatches}</h2>
                  </div>
                </div>
                <div className="stacs">
                  <div>
                    <h4>Easy Level</h4>
                    <p>Total Test</p>
                    <p>Average WPM</p>
                    <p>Average Accuracy</p>
                    <p>Average Consistency</p>
                  </div>
                  <div>
                    <h4>1 Min</h4>
                    <p>{match1MinData?.easyMatches || 0}</p>
                    <p>{match1MinData?.avgWpmEasy || 0} Per Min</p>
                    <p>{match1MinData?.avgAccEasy || 0}%</p>
                    <p>{match1MinData?.avgConsisEasy || 0}%</p>
                  </div>
                  <div>
                    <h4>3 Min</h4>
                    <p>{match3MinData?.easyMatches || 0}</p>
                    <p>{match3MinData?.avgWpmEasy || 0} Per Min</p>
                    <p>{match3MinData?.avgAccEasy || 0}%</p>
                    <p>{match3MinData?.avgConsisEasy || 0}%</p>
                  </div>
                  <div>
                    <h4>5 Min</h4>
                    <p>{match5MinData?.easyMatches || 0}</p>
                    <p>{match5MinData?.avgWpmEasy || 0} Per Min</p>
                    <p>{match5MinData?.avgAccEasy || 0}%</p>
                    <p>{match5MinData?.avgConsisEasy || 0}%</p>
                  </div>
                </div>
                <div className="stacs">
                  <div>
                    <h4>Medium Level</h4>
                    <p>Total Test</p>
                    <p>Average WPM</p>
                    <p>Average Accuracy</p>
                    <p>Average Consistency</p>
                  </div>
                  <div>
                    <h4>1 Min</h4>
                    <p>{match1MinData?.mediumMatches || 0}</p>
                    <p>{match1MinData?.avgWpmMedium || 0} Per Min</p>
                    <p>{match1MinData?.avgAccMedium || 0}%</p>
                    <p>{match1MinData?.avgConsisMedium || 0}%</p>
                  </div>
                  <div>
                    <h4>3 Min</h4>
                    <p>{match3MinData?.mediumMatches || 0}</p>
                    <p>{match3MinData?.avgWpmMedium || 0} Per Min</p>
                    <p>{match3MinData?.avgAccMedium || 0}%</p>
                    <p>{match3MinData?.avgConsisMedium || 0}%</p>
                  </div>
                  <div>
                    <h4>5 Min</h4>
                    <p>{match5MinData?.mediumMatches || 0}</p>
                    <p>{match5MinData?.avgWpmMedium || 0} Per Min</p>
                    <p>{match5MinData?.avgAccMedium || 0}%</p>
                    <p>{match5MinData?.avgConsisMedium || 0}%</p>
                  </div>
                </div>
                <div className="stacs">
                  <div>
                    <h4>Hard Level</h4>
                    <p>Total Test</p>
                    <p>Average WPM</p>
                    <p>Average Accuracy</p>
                    <p>Average Consistency</p>
                  </div>
                  <div>
                    <h4>1 Min</h4>
                    <p>{match1MinData?.hardMatches || 0}</p>
                    <p>{match1MinData?.avgWpmHard || 0} Per Min</p>
                    <p>{match1MinData?.avgAccHard || 0}%</p>
                    <p>{match1MinData?.avgConsisHard || 0}%</p>
                  </div>
                  <div>
                    <h4>3 Min</h4>
                    <p>{match3MinData?.hardMatches || 0}</p>
                    <p>{match3MinData?.avgWpmHard || 0} Per Min</p>
                    <p>{match3MinData?.avgAccHard || 0}%</p>
                    <p>{match3MinData?.avgConsisHard || 0}%</p>
                  </div>
                  <div>
                    <h4>5 Min</h4>
                    <p>{match5MinData?.hardMatches || 0}</p>
                    <p>{match5MinData?.avgWpmHard || 0} Per Min</p>
                    <p>{match5MinData?.avgAccHard || 0}%</p>
                    <p>{match5MinData?.avgConsisHard || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <UpdatePassModal />
    </>
  )
}

export default UserDashBoard