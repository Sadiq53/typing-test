import React, { useEffect, useState } from 'react'
import Header from '../../../../shared/header/Header'
import Footer from '../../../../shared/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { handleGetLeaderboardData, resetState } from '../../../../../redux/UserDataSlice'

const LeaderBoard = () => {

    const dispatch = useDispatch();
    const [onLoadLimit, setOnLoadLimit] = useState(50)
    const rawAllUserData = useSelector(state => state.UserDataSlice.allUserData)
    const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
    const [displayData, setDisplayData] = useState([])
    const [timeFilter, setTimeFilter] = useState('1')
    const [levelFilter, setLevelFilter] = useState('all')

    useEffect(() => {
        if (rawAllUserData) {
            setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.all?.match1Data?.avgAcc1, avgWpm : value?.all?.match1Data?.avgWpm1, avgConsis : value?.all?.match1Data?.avgConsis1}}))
            console.log(rawAllUserData)
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

    useEffect(()=>{
        switch (levelFilter) {
            case 'all' :
                switch (timeFilter) {
                    case '1' :
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.all?.match1Data?.avgAcc1, avgWpm : value?.all?.match1Data?.avgWpm1, avgConsis : value?.all?.match1Data?.avgConsis1}}))
                        break;
                    case '3' : 
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.all?.match3Data?.avgAcc3, avgWpm : value?.all?.match3Data?.avgWpm3, avgConsis : value?.all?.match1Data?.avgConsis3}}))
                        break;
                    case '5' :
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.all?.match5Data?.avgAcc5, avgWpm : value?.all?.match5Data?.avgWpm5, avgConsis : value?.all?.match1Data?.avgConsis5}}))
                        break;
                    default:
                        console.warn(`Unhandled match type: ${match}`);
                }
                break;
            case 'easy' :
                switch (timeFilter) {
                    case '1' :
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.easy1?.avgAcc, avgWpm : value?.easy1?.avgWpm, avgConsis : value?.easy1?.avgConsis}}))
                        break;
                    case '3' : 
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.easy3?.avgAcc, avgWpm : value?.easy3?.avgWpm, avgConsis : value?.easy3?.avgConsis}}))
                        break;
                    case '5' :
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.easy5?.avgAcc, avgWpm : value?.easy5?.avgWpm, avgConsis : value?.easy5?.avgConsis}}))
                        break;
                    default:
                        console.warn(`Unhandled match type: ${match}`);
                }
                break;
            case 'medium' :
                switch (timeFilter) {
                    case '1' :
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.medium1?.avgAcc, avgWpm : value?.medium1?.avgWpm, avgConsis : value?.medium1?.avgConsis}}))
                        break;
                    case '3' : 
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.medium3?.avgAcc, avgWpm : value?.medium3?.avgWpm, avgConsis : value?.medium3?.avgConsis}}))
                        break;
                    case '5' :
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.medium5?.avgAcc, avgWpm : value?.medium5?.avgWpm, avgConsis : value?.medium5?.avgConsis}}))
                        break;
                    default:
                        console.warn(`Unhandled match type: ${match}`);
                }
                break;
            case 'hard' :
                switch (timeFilter) {
                    case '1' :
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.hard1?.avgAcc, avgWpm : value?.hard1?.avgWpm, avgConsis : value?.hard1?.avgConsis}}))
                        break;
                    case '3' : 
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.hard3?.avgAcc, avgWpm : value?.hard3?.avgWpm, avgConsis : value?.hard3?.avgConsis}}))
                        break;
                    case '5' :
                        setDisplayData(rawAllUserData?.map(value => {return {username : value.username, avgAcc : value?.hard5?.avgAcc, avgWpm : value?.hard5?.avgWpm, avgConsis : value?.hard5?.avgConsis}}))
                        break;
                    default:
                        console.warn(`Unhandled match type: ${match}`);
                }
                break;
            default:
                console.warn(`Unhandled match type: ${match}`);
        }
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
            dispatch(resetState())
        }
    }, [isFullfilled])

  return (
    <>
        <Header />

        <section>
            <div className="container py-3">
                <div className="row">
                    <div className="col-md-12">
                        <div className="leaderboard-head">
                            <h1>All-Time Leaderboards </h1>
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
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="show-filter py-2">
                            <h1 className='font-active text-left'>0{timeFilter} Min {levelFilter} Mode</h1>
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
                                        displayData?.map((value, index) => (
                                            <tr>
                                                <td>{index+1}</td>
                                                <td><div className='profile'><img src="/assets/images/profile.png" alt="" />{value?.username}</div></td>
                                                <td>{Math.round(value?.avgWpm)}</td>
                                                <td>{Math.round(value?.avgAcc)}</td>
                                                <td>{Math.round(value?.avgConsis)}</td>
                                            </tr>
                                        ))
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