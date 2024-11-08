import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleGetLeaderboardData, resetState } from '../../../redux/UserDataSlice';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { BASE_API_URL } from '../../../util/API_URL';


const LeaderBoard = () => {

    const dispatch = useDispatch();
    const [onLoadLimit, setOnLoadLimit] = useState(50)
    const rawAllUserData = useSelector(state => state.UserDataSlice.allUserData)
    const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
    const processingMsg = useSelector(state => state.UserDataSlice.processingMsg)
    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
    const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg)
    const [isLoading, setIsLoading] = useState(false)
    const [displayData, setDisplayData] = useState([])
    const [timeFilter, setTimeFilter] = useState('1')
    const [levelFilter, setLevelFilter] = useState('all')

    useEffect(() => {
        if (rawAllUserData) {
            setDisplayData(rawAllUserData?.map(value => {return {username : value.username, profile : value.profile.s3url, avgAcc : value?.overall?.avgAcc, avgWpm : value?.overall?.avgWpm, avgConsis : value?.overall?.avgConsis}}))
            // console.log(rawAllUserData)  
        }
    }, [rawAllUserData]);
    
    useEffect(()=>{
        // console.log(displayData)
        
    }, [displayData])
    
    const handleFilterTime = (time) =>{
        setTimeFilter(time)
        const obj = {
            onLoadLimit : onLoadLimit,
            timeFilter : time
        }
        dispatch(handleGetLeaderboardData(obj))
    }

    const updateDataOnLevels = () => {
        switch(levelFilter) {
            case 'all' :
                setDisplayData(rawAllUserData?.map(value => {return {username : value.username, profile : value.profile.newname, avgAcc : value?.overall?.avgAcc, avgWpm : value?.overall?.avgWpm, avgConsis : value?.overall?.avgConsis}}))
                break;
            
            case 'easy' :
                setDisplayData(rawAllUserData?.map(value => {return {username : value.username, profile : value.profile.newname, avgAcc : value?.levels?.easy?.avgAcc, avgWpm : value?.levels?.easy?.avgWpm, avgConsis : value?.levels?.easy?.avgConsis}}))
                break;
            
            case 'medium' :
                setDisplayData(rawAllUserData?.map(value => {return {username : value.username, profile : value.profile.newname, avgAcc : value?.levels?.medium?.avgAcc, avgWpm : value?.levels?.medium?.avgWpm, avgConsis : value?.levels?.medium?.avgConsis}}))
                break;
            
            case 'hard' :
                setDisplayData(rawAllUserData?.map(value => {return {username : value.username, profile : value.profile.newname, avgAcc : value?.levels?.hard?.avgAcc, avgWpm : value?.levels?.hard?.avgWpm, avgConsis : value?.levels?.hard?.avgConsis}}))
                break;
            default:
                console.warn(`Unhandled match type: ${match}`);
        }
    }

    useEffect(()=>{
        updateDataOnLevels()
    }, [timeFilter, levelFilter])

    const handleFilterLevel = (level) =>{
        setLevelFilter(level)
    }

    useEffect(()=>{
        const obj = {
            onLoadLimit : onLoadLimit,
            timeFilter : timeFilter
        }
        dispatch(handleGetLeaderboardData(obj))
    }, [])

    useEffect(()=>{
        if(isFullfilled) {
            if(fullFillMsg?.type === 'leaderboard'){
                setIsLoading(false)
                dispatch(resetState())
            }
        }
    }, [isFullfilled, fullFillMsg])

    useEffect(()=>{
        if(isProcessing) {
            if(processingMsg?.type === 'leaderboard') {
                setIsLoading(true)
                dispatch(resetState())
            }
        }
    }, [isProcessing, processingMsg])

  return (
    <>
        <Header />

        <section>
            <div className="container py-3">
                <div className="row">
                    <div className="col-md-12">
                        <div className="leaderboard-head">
                            <h1>All-Time Leaderboards  </h1>
                            <div className="filter">
                                <div className="filter-btn">
                                    <button onClick={()=>handleFilterTime('1')} className={timeFilter === '1' ? 'active' : ''}>01 Min</button>
                                    <button onClick={()=>handleFilterTime('3')} className={timeFilter === '3' ? 'active' : ''}>03 Min</button>
                                    <button onClick={()=>handleFilterTime('5')} className={timeFilter === '5' ? 'active' : ''}>05 Min</button>
                                </div>
                                <div className="filter-btn">
                                    <button onClick={()=>handleFilterLevel('all')} className={levelFilter === 'all' ? 'active' : ''}>All</button>
                                    <button onClick={()=>handleFilterLevel('easy')} className={levelFilter === 'easy' ? 'active' : ''}>Easy</button>
                                    <button onClick={()=>handleFilterLevel('medium')} className={levelFilter === 'medium' ? 'active' : ''}>Medium</button>
                                    <button onClick={()=>handleFilterLevel('hard')} className={levelFilter === 'hard' ? 'active' : ''}>Hard</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div className="container p-custom">
                <div className="row">
                    <div className="col-md-12">
                        <div className="show-filter py-2">
                            <h1 className='font-active text-left'>0{timeFilter} Min {levelFilter} Mode</h1>
                            {
                                isLoading && (<div class="rl-loading-container">
                                    <div class="rl-loading-thumb rl-loading-thumb-1"></div>
                                    <div class="rl-loading-thumb rl-loading-thumb-2"></div>
                                    <div class="rl-loading-thumb rl-loading-thumb-3"></div>
                                </div>)
                            }
                        </div>
                        <div className="leaderboard-table my-3">
                            <table className="">
                                <thead>
                                    <tr>
                                    <th>#</th>
                                    <th>name</th>
                                    <th>wpm</th>
                                    <th>accuracy</th>
                                    <th>consistency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        displayData?.length !== 0 ? displayData?.map((value, index) => (
                                            <tr>
                                                <td>{index+1}</td>
                                                <td><div className='profile'><img src={value?.profile ? `${value?.profile}` : "/assets/images/profile.png"}  alt="" />{value?.username}</div></td>
                                                <td>{Math.round(value?.avgWpm)}</td>
                                                <td>{Math.round(value?.avgAcc)}</td>
                                                <td>{Math.round(value?.avgConsis)}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td>No Match Played</td>
                                                <td>No Match Played</td>
                                                <td>No Match Played</td>
                                                <td>No Match Played</td>
                                                <td>No Match Played</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer />
    </>
  )
}

export default LeaderBoard