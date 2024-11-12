import { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../../../../shared/header/Header'
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleTest, resetState } from '../../../../../redux/UserDataSlice';
import { dynamicToast } from '../../../../shared/Toast/DynamicToast'
import { easyWords, generateParagraph, hardWords, mediumWords } from './ParagraphGenerater';
import DynamicAlert from '../../../../shared/Toast/DynamicAlert'



const Lobby = () => {

  const [time, setTime] = useState(60);
  const [userInput, setUserInput] = useState("");
  const typingAreaRef = useRef(null);
  const containerRef = useRef(null);
  const [hasFocus, setHasFocus] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [timeLimit, setTimeLimit] = useState(60); // Default 30 seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState();
  const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
  const paragraphs = useSelector(state => state.UserDataSlice.paragraphs)
  const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg)
  const isError = useSelector(state => state.UserDataSlice.isError)
  const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
  const [timeUp, setTimeUp] = useState(false)
  const [Min1, setMin1] = useState({})
  const [Min3, setMin3] = useState({})
  const [Min5, setMin5] = useState({})
  const [alertDetail, setAlertDetail] = useState({
    title : '',
    message : '',
    type : '',
    navigateTo : '',
    confirmBtn : false
  })
  const [showAlert, setShowAlert] = useState(false)
  const [stats, setStats] = useState({
    wpm: [],
    accuracy: [],
    consistency: [],
    correctChars: 0,
    incorrectChars: 0,
    extraChars: 0,
    isCompleted : false,
    timeOfCompletion : 0,
    // missedChars : 0,
    time: 0,
    level : ''
  });
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Control modal display
  const dispatch = useDispatch();
  const [finalStats, setFinalStats] = useState({
    wpm: [],
    accuracy: [],
    consistency: [],
    correctChars: 0,
    incorrectChars: 0,
    extraChars: 0,
    isCompleted : false,
    timeOfCompletion : 0,
    // missedChars : 0,
    time: 0,
    level : ''
  })
  const checkUserToken = useMemo(() => !!localStorage.getItem('userToken'), []);

  // Function to get a random index based on array length
  function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
  }

  // Function to generate paragraph based on duration and difficulty
  const generateTypingTestParagraph = () => {
    const wordsPerMinute = 70; // Average typing speed (can be adjusted)
    const totalWords = wordsPerMinute * (timeLimit / 60); // Total words to match the duration

    let wordArray;
    if (difficulty === "easy") {
        wordArray = easyWords;
    } else if (difficulty === "medium") {
        wordArray = mediumWords.concat(easyWords); // Mix easy and medium words
    } else if (difficulty === "hard") {
        wordArray = hardWords.concat(mediumWords).concat(easyWords); // Mix all words
    }

    const newParagraph = generateParagraph(wordArray, totalWords);
    setCurrentParagraph(newParagraph);
  };

  useEffect(() => {
    // Update Min1, Min3, and Min5 values if they exist in `paragraphs`
    setMin1(paragraphs?.Min1 || []);
    setMin3(paragraphs?.Min3 || []);
    setMin5(paragraphs?.Min5 || []);

    const changeTime = {
        60: 'Min1',
        180: 'Min3',
        300: 'Min5',
    };
    const timeField = changeTime[time];

    // Check if a paragraph exists for the given time and difficulty
    if (timeField && paragraphs?.[timeField]?.[difficulty]?.length > 0) {
        // Pick a random paragraph from existing ones
        const getIndex = getRandomIndex(paragraphs[timeField][difficulty]);
        setCurrentParagraph(paragraphs[timeField][difficulty][getIndex]?.para);
        // console.log(paragraphs[timeField][difficulty][getIndex]?.para)
    } else {
        // If no paragraph exists, generate a new one
        generateTypingTestParagraph();
    }
  }, [paragraphs, time, difficulty]); // Dependencies: `paragraphs`, `time`, and `difficulty`


  // Focus input on load--------------------------------------------------------------------------
  useEffect(() => {
    if(hasFocus) {
      if(typingAreaRef.current){
        typingAreaRef.current.focus();
        typingAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [hasFocus]);
  // Focus input on load--------------------------------------------------------------------------

  //convert the timeer in proper format---------------------------------------------------------------
  const convertSecondsToFormattedTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60); // Get the number of minutes
    const seconds = totalSeconds % 60; // Get the remaining seconds

    // Format the seconds to always be two digits
    const formattedSeconds = seconds.toString().padStart(2, '0');

    // Return the formatted time
    return `${minutes}:${formattedSeconds}`;
  };
  //convert the timeer in proper format---------------------------------------------------------------

  // Update elapsed time and stop timer if time limit is reached------------------------------------
  useEffect(() => {
    if (timerRunning) {
      const interval = setInterval(() => {
        setElapsedTime((prev) => {
          const newElapsedTime = prev + 1;
          if (newElapsedTime >= timeLimit) {
            setTimerRunning(false);
            setTimeUp(true)
            setShowModal(true)
          }
          return newElapsedTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerRunning, timeLimit]);
  // Update elapsed time and stop timer if time limit is reached------------------------------------

  // Handle paragraph difficulty change----------------------------------------------------------
  const handleDifficultyChange = (e) => {
    const newDifficulty = e;
    // console.log(newDifficulty)
    setDifficulty(newDifficulty);
    typingAreaRef.current.focus();
  };
  // Handle paragraph difficulty change----------------------------------------------------------

  // Handle input change----------------------------------------------------------------------
  const handleInputChange = (e) => {
    const input = e.target.value;

    // Start timer if it's not already running
    if (input.length === 1 && !timerRunning) {
      setTimerRunning(true);
    }

    setUserInput(input);
    calculateStats(input);
  };
  // Handle input change----------------------------------------------------------------------

  // Calculate and update statistics-------------------------------------------------------------------
  const calculateStats = (input) => {
  let correctChars = 0;
  let incorrectChars = 0;
  let extraChars = 0;
  let currentStreak = 0; 
  let longestStreak = 0;
  // let missedChars = 0;
  let isCompleted = false;
  let timeOfCompletion = 0;


  // Track correct, incorrect, and extra characters
  [...currentParagraph].forEach((char, index) => {
    const typedChar = input[index];

    // Check if the character is a space
    if (char === " ") {
      // If the user typed something in a space, count it as an extra character
      if (typedChar !== undefined && typedChar !== " " && typedChar !== "") {
        extraChars++;
      }
    } else {
      // If the character is not a space
      if (typedChar === char) {
        // If the typed character matches the correct character, it's correct
        correctChars++;
        currentStreak++;
      } else if (typedChar !== undefined && typedChar !== "" && typedChar !== " ") {
        // If the typed character doesn't match and it's not a space, count as incorrect
        incorrectChars++;
        longestStreak = Math.max(longestStreak, currentStreak); // Update longest streak
        currentStreak = 0; // Reset the current streak
      } 
      // else if (typedChar === undefined) {
      //   // Character is missing if the user hasn't typed it yet
      //   missedChars++;
      // }
      }
  });

  // Handle the case where the user types extra characters beyond the length of the paragraph
  if (input.length > currentParagraph.length) {
    for (let i = currentParagraph.length; i < input.length; i++) {
      if (input[i] !== " ") {
        extraChars++;
      }
    }
  }

  // Correctly calculate accuracy as the percentage of correct chars out of total chars typed (ignoring extra chars)
  const totalTypedChars = correctChars + incorrectChars; // Total meaningful input
  const accuracy = ((correctChars / totalTypedChars) * 100).toFixed(2);

  // Calculate WPM, ensuring that we don't divide by zero
  let wpm = 0;
  if (elapsedTime > 0) {
    const wordsTyped = input.trim().split(" ").filter(Boolean).length; // Avoid counting empty spaces
    wpm = (wordsTyped / (elapsedTime / 60)).toFixed(2);
  }


  // Update the longest streak after finishing the loop
  longestStreak = Math.max(longestStreak, currentStreak);

  // Consistency based on the longest consecutive correct characters typed
  const consistency = longestStreak > 0
    ? Math.min(((longestStreak / currentParagraph.length) * 100).toFixed(2), 100)
    : 0;

  // // Update missedChars to include characters that were not typed
  // for (let i = 0; i < currentParagraph.length; i++) {
  //   if (i >= input.length) {
  //     if (currentParagraph[i] !== " ") {
  //       missedChars++;
  //     }
  //   }
  // }

  // Count only non-space characters in `currentParagraph`
  const nonSpaceCharCount = currentParagraph.replace(/ /g, "").length;

  // Determine if the paragraph is completed by checking if correct and incorrect characters typed match the non-space characters
  isCompleted = (correctChars + incorrectChars) >= nonSpaceCharCount;
  timeOfCompletion = elapsedTime;


  setStats((prevStats) => ({
    ...prevStats,
    wpm: [...prevStats.wpm, parseFloat(wpm)], // Append the new WPM value
    accuracy: [...prevStats.accuracy, parseFloat(accuracy)], // Append the new Accuracy value
    consistency: [...prevStats.consistency, parseFloat(consistency)], // Append the new Consistency value
    correctChars,
    incorrectChars,
    extraChars,
    isCompleted,
    timeOfCompletion
    // missedChars
  }));
  };
  // Calculate and update statistics-------------------------------------------------------------------
  
  // Eyes on the Completion of test before selected Time-------------------------------------------------
  useEffect(()=>{
    if(stats.isCompleted){
        setTimerRunning(false);
        setTimeUp(true)
        setShowModal(true)
    }
  }, [stats])
  // Eyes on the Completion of test before selected Time-------------------------------------------------

  // updation of finalStats-------------------------------------------------------------------
  useEffect(()=>{
    setFinalStats(stats)
  },[stats])
  // updation of finalStats-------------------------------------------------------------------
  
  // updation Difficulty in stats-------------------------------------------------------------------
  useEffect(()=>{
    setStats((prevStats) => ({
      ...prevStats,   // Spread the previous stats object
      level: difficulty,  // Update the 'level' property
      time: timeLimit         // Update the 'time' property
    }));
  }, [difficulty, timeLimit])
  // updation Difficulty in stats-------------------------------------------------------------------
  
  // After test Done-------------------------------------------------------------------
  useEffect(()=>{
    if(showModal) {
      const result = {
        data : finalStats,
        date : new Date()
      }
      localStorage.setItem('stats', JSON.stringify(result))
      localStorage.setItem('matchHistory', JSON.stringify({time : result.data.time, level : result.data.level}))
      if(localStorage.getItem('userToken')) {
          dispatch(handleTest(result))
      } else {
          navigate(`/stats`)
      }
    }
  },[showModal])
  // After test Done-------------------------------------------------------------------
  
  // Action after the test fullfilled-------------------------------------------------------------------
  useEffect(()=>{
    if(isFullfilled){
      if(fullFillMsg?.message === "test complete"){
        if(localStorage.getItem('userToken')) {
          navigate('/user/stats')
          dispatch(resetState())
        }
      }
    }
  }, [isFullfilled, fullFillMsg])
  // Action after the test fullfilled-------------------------------------------------------------------

  // Reset the typing test-----------------------------------------------------------------------------
  const resetTest = () => {
    setUserInput('');
    setElapsedTime(0);
    setTimerRunning(false);
    setStats({
      wpm: [],
      accuracy: [],
      consistency: [],
      correctChars: 0,
      incorrectChars: 0,
      extraChars: 0,
      // missedChars : 0,
      isCompleted : false,
      timeOfCompletion : 0,
      time: 0,
      level : ''
    });
    typingAreaRef.current.blur();
  };
  // Reset the typing test-----------------------------------------------------------------------------
  
  // set the selected time in stats-----------------------------------------------------------------------------
  const handleTime = (value) => {
    setTime(value)
    // setStats((prevStats) => ({
    //   ...prevStats,   // Spread the previous stats object
    //   time: value     // Update the 'time' property
    // }));    
    setTimeLimit(Number(value))
    typingAreaRef.current.focus();
  }
  // set the selected time in stats-----------------------------------------------------------------------------

  // Click outside handler to set focus off when clicking outside typing area------------------------
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setHasFocus(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Click outside handler to set focus off when clicking outside typing area------------------------

  useEffect(()=>{
    if(localStorage.getItem('isSignout')) {
      dynamicToast({ message: 'Logged out Successfully!', timer: 3000, icon: 'info' })
      setTimeout(()=>{
        localStorage.removeItem('isSignout')
      }, 3500)
    }
  }, [])

  useEffect(()=>{
    if(localStorage.getItem('accountDelete')) {
      dynamicToast({ message: 'Account Deleted Successfully', timer: 3000, icon: 'info' })
      setTimeout(()=>{
        localStorage.removeItem('accountDelete')
      }, 3500)
    }
  }, [])

  useEffect(() => {
    if(localStorage.getItem('isBlocked')) {
      setShowAlert(true)
      setAlertDetail({
        title : 'Account Blocked!',
        type : 'error',
        message : `Your Account has been Blocked! Conatct to Admin`,
        navigateTo : '',
        confirmBtn : true
      })
      setTimeout(()=>{
        localStorage.removeItem('isBlocked')
        setShowAlert(false)
      }, 1000)
    }
}, [])

  useEffect(() => {
    if(localStorage.getItem('matchHistory')) {
      let data = localStorage.getItem('matchHistory')
      data = JSON.parse(data)
      const { time, level } = data
      setTime(time)
      setTimeLimit(time)
      setDifficulty(level)
      setTime(()=>{
        localStorage.removeItem('matchHistory')
      }, 1000)
    }
  }, [])

const handleAlertClose = () => {
  setShowAlert(false); // Set showAlert to false
};

  return (
    <>
      <Header />
      <section className='lobby-area'>
        <div className="container">
          <div 
            className="row custom-align"
            style={{
              transition: 'transform 0.3s ease', 
              transform: window.innerWidth < 767 ? hasFocus ? 'translateY(-40%)' : 'none' : hasFocus ? 'translateY(-50%)' : 'none',
            }}
          >
            <div ref={containerRef} className="cutom-lobby-head">
              <div className='lobby-menu'>
                <ul>
                  <li>Time :</li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleTime(60); }}
                      className={timeLimit === 60 ? 'active' : ''}
                    >
                      01 Min
                    </button>
                  </li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleTime(180); }}
                      className={timeLimit === 180 ? 'active' : ''}
                    >
                      03 Min
                    </button>
                  </li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleTime(300); }}
                      className={timeLimit === 300 ? 'active' : ''}
                    >
                      05 Min
                    </button>
                  </li>
                </ul>
              </div>
              <div className="lobby-menu text-center">
                <h4 className={`${timerRunning ? 'text-active' : 'text-idle'}`}>
                  {timeLimit - elapsedTime > 0 ? convertSecondsToFormattedTime(timeLimit - elapsedTime) : 0}
                </h4>
              </div>
              <div className='lobby-menu'>
                <ul>
                  <li>Level :</li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleDifficultyChange('easy'); }}
                      className={difficulty === 'easy' ? 'active' : ''}
                    >
                      Easy
                    </button>
                  </li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleDifficultyChange('medium'); }}
                      className={difficulty === 'medium' ? 'active' : ''}
                    >
                      Medium
                    </button>
                  </li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleDifficultyChange('hard'); }}
                      className={difficulty === 'hard' ? 'active' : ''}
                    >
                      Hard
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-12">
              <div className="typing-area" 
                    tabIndex={0} // Make the div focusable
                    onClick={() => typingAreaRef.current.focus()} 
                    onFocus={() => setHasFocus(true)} 
                    onBlur={() => setHasFocus(false)}
                    >
                <div style={{ fontSize: "30px" }}>
                  {currentParagraph && typeof currentParagraph === "string" 
                    ? currentParagraph?.split("").map((char, index) => (
                    <span
                      key={index}
                      className={`${userInput[index] === undefined ? 'text-light' : userInput[index] === char ? 'text-active' : 'text-wrong'} ${hasFocus && index === userInput?.length ? 'underline' : ''}`}
                    >
                      {char}
                    </span>
                  )) : null}
                  {hasFocus && userInput?.length < currentParagraph?.length && (
                    <span
                      style={{
                        borderLeft: "2px solid white",
                        animation: "blink 1s infinite",
                        marginLeft: "2px",
                        display: "inline-block",
                      }}
                    />
                  )}
                </div>
                <input
                  ref={typingAreaRef}
                  value={userInput}
                  onChange={handleInputChange}
                  style={{ opacity: 0, position: "absolute", top: 0, left: 0 }}
                />
              </div>
              <div className='reset'><button onClick={resetTest}><i className="fa-solid fa-arrow-rotate-right text-active"></i> <span className='text-idle'>Start Over</span></button></div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-7">
                <div className="status">
                  <div>
                    <h4>WPM</h4>
                    <h1>{stats.wpm[stats?.wpm?.length - 1] || 0}</h1>
                  </div>
                  <div>
                    <h4>Accuracy</h4>
                    <h1>{stats.accuracy[stats?.accuracy?.length - 1] || 0}<span>%</span></h1>
                  </div>
                  <div>
                    <h4>Consistency</h4>
                    <h1>{stats.consistency[stats?.consistency?.length - 1] || 0}<span>%</span></h1>
                  </div>
                </div>
              </div>
              <div className="col-md-5 custom-footer-lobby">
                <div className='width-80'>
                  <div className="footer">
                    <ul>
                      <li><NavLink to={checkUserToken ? '/user/contact' : '/contact'}>Contact Us &nbsp; |</NavLink></li>
                      <li><NavLink to={checkUserToken ? '/user/about' : '/about'}>About &nbsp; |</NavLink></li>
                      <li><NavLink to={checkUserToken ? '/user/privacy' : '/privacy'}>Privacy Policy &nbsp; |</NavLink></li>
                      <li><NavLink to={checkUserToken ? '/user/term-condition' : '/term-condition'}>Terms & Condition</NavLink></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {
        timeUp && (
          <div className="blur-overlay">
          <div className="overlay-message">
            <h1>{stats.isCompleted ? 'Test Completed' : 'Test Over'}.....!</h1>
            <div class="loading">
          <svg class="orange">
            <g fill="none">
              <rect x="2" y="2" width="50" height="50" />
            </g>
          </svg>
          <svg class="grey">
            <g fill="none">
              <rect x="5" y="5" width="44" height="44" stroke="#ccc" stroke-width="2"/>
            </g>
          </svg>
          </div>
          </div>
        </div>
        )
      }

        <DynamicAlert
          type={alertDetail.type}
          title={alertDetail.title}
          message={alertDetail.message}
          trigger={showAlert} // This will trigger the alert
          navigateTo={alertDetail.navigateTo}
          confirmBtn={alertDetail.confirmBtn}
          onClose={handleAlertClose} // Pass the onClose handler
        />
    </>
  )
}

export default Lobby