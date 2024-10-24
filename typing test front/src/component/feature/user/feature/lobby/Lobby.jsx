import { useEffect, useRef, useState } from 'react'
import Header from '../../../../shared/header/Header'
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleTest, resetState } from '../../../../../redux/UserDataSlice';
import { dynamicToast } from '../../../../shared/Toast/DynamicToast'
import { easyWords, generateParagraph, hardWords, mediumWords } from './ParagraphGenerater';


const generateRandomParagraph = (difficulty) => {
  const easy = "This is an easy sample sentence. Just relax and type.";
  const medium = "Typing this medium-length text requires moderate attention.";
  const hard = "The quick brown fox jumps over the lazy dog. Typing hard texts tests patience.";

  switch (difficulty) {
    case "easy":
      return easy;
    case "medium":
      return medium;
    case "hard":
      return hard;
    default:
      return easy;
  }
};

const Lobby = () => {

  const [time, setTime] = useState(60);
  const [userInput, setUserInput] = useState("");
  const typingAreaRef = useRef(null);
  const [hasFocus, setHasFocus] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [timeLimit, setTimeLimit] = useState(60); // Default 30 seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState();
  const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
  const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg)
  const isError = useSelector(state => state.UserDataSlice.isError)
  const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
  const [stats, setStats] = useState({
    wpm: [],
    accuracy: [],
    consistency: [],
    correctChars: 0,
    incorrectChars: 0,
    extraChars: 0,
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
    // missedChars : 0,
    time: 0,
    level : ''
  })

  // Function to generate paragraph based on duration and difficulty
  const generateTypingTestParagraph = () => {
    const wordsPerMinute = 70; // Average typing speed (can be adjusted)
    const totalWords = wordsPerMinute * (timeLimit/60); // Total words to match the duration
    
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
  }

  useEffect(()=>{
    generateTypingTestParagraph()
  }, [difficulty, timeLimit, time])
  

  // Focus input on load--------------------------------------------------------------------------
  useEffect(() => {
    if(typingAreaRef.current){
      typingAreaRef.current.focus();
      setHasFocus(true)
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

  setStats((prevStats) => ({
    ...prevStats,
    wpm: [...prevStats.wpm, parseFloat(wpm)], // Append the new WPM value
    accuracy: [...prevStats.accuracy, parseFloat(accuracy)], // Append the new Accuracy value
    consistency: [...prevStats.consistency, parseFloat(consistency)], // Append the new Consistency value
    correctChars,
    incorrectChars,
    extraChars,
    // missedChars
  }));
};
  // Calculate and update statistics-------------------------------------------------------------------
  
  
  // updation of finalStats-------------------------------------------------------------------
  useEffect(()=>{
    setFinalStats(stats)
    console.log(stats)
  },[stats])
  // updation of finalStats-------------------------------------------------------------------
  
  // updation Difficulty in stats-------------------------------------------------------------------
  useEffect(()=>{
    setStats((prevStats) => ({
      ...prevStats,   // Spread the previous stats object
      level: difficulty,  // Update the 'level' property
      time: time         // Update the 'time' property
    }));
  }, [difficulty, time])
  // updation Difficulty in stats-------------------------------------------------------------------
  
  // After test Done-------------------------------------------------------------------
  useEffect(()=>{
    if(showModal) {
      const result = {
        data : finalStats,
        date : new Date()
      }
      localStorage.setItem('stats', JSON.stringify(result))
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
      time: 0,
      level : ''
    });
    typingAreaRef.current.focus();
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
  }
  // set the selected time in stats-----------------------------------------------------------------------------

  useEffect(()=>{
    if(localStorage.getItem('isSignout')) {
      dynamicToast({ message: 'Logged out Successfully!', icon: 'info' })
      setTimeout(()=>{
        localStorage.removeItem('isSignout')
      }, 3500)
    }
  }, [])

  useEffect(()=>{
    if(localStorage.getItem('accountDelete')) {
      dynamicToast({ message: 'Account Deleted Successfully', icon: 'info' })
      setTimeout(()=>{
        localStorage.removeItem('accountDelete')
      }, 3500)
    }
  }, [])

  return (
    <>
      <Header />
      <section className='lobby-area'>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className='lobby-menu'>
                <ul>
                  <li>Time :</li>
                  <li>
                    <button
                      onClick={() => handleTime(60)}
                      className={time === 60 ? 'active' : ''}
                    >
                      01 Min
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleTime(180)}
                      className={time === 180 ? 'active' : ''}
                    >
                      03 Min
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleTime(300)}
                      className={time === 300 ? 'active' : ''}
                    >
                      05 Min
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="lobby-menu text-center">
                <h4 className={`${timerRunning ? 'text-active' : 'text-idle'}`}>{timeLimit - elapsedTime > 0 ? convertSecondsToFormattedTime(timeLimit - elapsedTime) : 0}</h4>
              </div>
            </div>
            <div className="col-md-4">
              <div className='lobby-menu'>
                <ul>
                  <li>Level :</li>
                  <li>
                    <button
                      onClick={() => handleDifficultyChange('easy')}
                      className={difficulty === 'easy' ? 'active' : ''}
                    >
                      Easy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleDifficultyChange('medium')}
                      className={difficulty === 'medium' ? 'active' : ''}
                    >
                      Medium
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleDifficultyChange('hard')}
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
                  {currentParagraph?.split("").map((char, index) => (
                    <span
                      key={index}
                      className={`${userInput[index] === undefined ? 'text-light' : userInput[index] === char ? 'text-active' : 'text-wrong'} ${hasFocus && index === userInput?.length ? 'underline' : ''}`}
                    >
                      {char}
                    </span>
                  ))}
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
            <div className="row align-end">
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
              <div className="col-md-5 d-flex justify-content-end">
                <div className='width-80'>
                  <div className="footer">
                    <ul>
                      <li><NavLink to=''>Contact Us &nbsp; |</NavLink></li>
                      <li><NavLink to=''>About &nbsp; |</NavLink></li>
                      <li><NavLink to=''>Privacy Policy &nbsp; |</NavLink></li>
                      <li><NavLink to=''>Terms & Condition</NavLink></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="sweet-alert">
        <div className="alert-content">
          <h1>hello</h1>
        </div>
      </div> */}
      {/* {
        !hasFocus && (
          <div className="blur-overlay" onClick={()=>{handleFocusContainer, setHasFocus(true), typingContainerRef.current.focus()}}>
          <div className="overlay-message">
            Click anywhere to focus on the typing container
          </div>
          </div>
        )
      } */}
    </>
  )
}

export default Lobby