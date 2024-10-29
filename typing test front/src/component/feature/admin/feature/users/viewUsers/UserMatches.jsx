import { useParams } from "react-router-dom"
import Header from "../../../../../shared/header/Header";
import Footer from "../../../../../shared/footer/Footer";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";


const UserMatches = () => {

    const param = useParams();
    const {level} = param;
    const rawUserData = useSelector(state => state.AdminDataSlice.userData)
    const [matchData, setMatchData] = useState({match1 : [], match3 : [], match5 : []})
    const [displayData, setDisplayData] = useState([])
    const [timeFilter, setTimeFilter] = useState('1')

    useEffect(()=>{
        setMatchData({
            match1 : rawUserData?.match_1?.filter(value => value.level === level),
            match3 : rawUserData?.match_3?.filter(value => value.level === level),
            match5 : rawUserData?.match_5?.filter(value => value.level === level)
        })
    }, [rawUserData])


    useEffect(()=>{
        const findProp = {
            '1' : 'match1',
            '3' : 'match3',
            '5' : 'match5',
        }
        const getProp = findProp[timeFilter]
        setDisplayData(matchData[getProp])
    }, [timeFilter])

    const handleFilterTime = (time) => {
        setTimeFilter(time)
    }



  return (
    <>
        <Header />
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="leaderboard-head">
                            {/* <h1>All-Time Leaderboards  </h1> */}
                            <div className="filter">
                                <div className="filter-btn">
                                    <button onClick={()=>handleFilterTime('1')} className={timeFilter === '1' ? 'active' : ''}>01 Min</button>
                                    <button onClick={()=>handleFilterTime('3')} className={timeFilter === '3' ? 'active' : ''}>03 Min</button>
                                    <button onClick={()=>handleFilterTime('5')} className={timeFilter === '5' ? 'active' : ''}>05 Min</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                        <div className="leaderboard-table my-3">
                                <table className="table-equal">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Played On</th>
                                            <th>Download Certificate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            displayData ? displayData?.map((value, index) => {
                                                const rawDate = value.matchdate
                                                // Check if the rawDate is valid and then parse it
                                                    const parsedDate = new Date(rawDate);
                                                    let formatDate
                                                    if (!isNaN(parsedDate)) {
                                                    // Format the valid date to '04 Oct 2024' format
                                                    formatDate = new Intl.DateTimeFormat('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        }).format(parsedDate)
                                                    } else {
                                                    console.error('Invalid date format:', rawDate);
                                                    }
                                                return(
                                                <tr key={index}>
                                                    <td>{index+1}</td>
                                                    <td>{formatDate}</td>
                                                    <td><button><i class="fa-solid fa-download fa-xl"></i></button></td>
                                                </tr>
                                            )}) : null
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </>
  )
}

export default UserMatches