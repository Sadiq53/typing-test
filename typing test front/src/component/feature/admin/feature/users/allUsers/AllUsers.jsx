import { useEffect } from "react"
import Header from "../../../../../shared/header/Header"
import {useDispatch, useSelector} from 'react-redux'
import { handleBlockUnblockUser, handleGetALlUser, resetState } from "../../../../../../redux/AdminDataSlice"
import { BASE_API_URL } from "../../../../../../util/API_URL"
import { NavLink } from "react-router-dom"
import {dynamicToast} from '../../../../../shared/Toast/DynamicToast'

const AllUsers = () => {

    const dispatch = useDispatch()
    const rawUsersData = useSelector(state => state.AdminDataSlice.allUserData);
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled);
    const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg);

    useEffect(()=>{
        dispatch(handleGetALlUser())
    }, [])

    useEffect(()=>{
        if(localStorage.getItem('accountDelete')) {
            dynamicToast({ message: 'Account Deleted Successfully', icon: 'info' })
            setTimeout(()=>{
                localStorage.removeItem('accountDelete')
            }, 3500)
        }
    }, [])

    useEffect(()=>{
        if(isFullfilled) {
            if(fullFillMsg?.type === 'delete') {
                dispatch(resetState())
            }
            dispatch(resetState())
        }
    }, [isFullfilled, fullFillMsg])

    const blockUser = (username) =>{
        dispatch(handleBlockUnblockUser(username))
    }

  return (
    <>
        <Header />
        <section>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-12">
                        {/* <div className="show-filter py-2">
                            <h1 className='font-active text-left'>0{timeFilter} Min {levelFilter} Mode</h1>
                            {
                                isLoading && (<div class="rl-loading-container">
                                    <div class="rl-loading-thumb rl-loading-thumb-1"></div>
                                    <div class="rl-loading-thumb rl-loading-thumb-2"></div>
                                    <div class="rl-loading-thumb rl-loading-thumb-3"></div>
                                </div>)
                            }
                        </div> */}
                        <div className="leaderboard-table my-3">
                            <table className="">
                                <thead>
                                    <tr>
                                    <th>#</th>
                                    <th>name</th>
                                    <th>View</th>
                                    <th>Edit</th>
                                    <th>Block</th>
                                    <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        rawUsersData?.map((value, index) => (
                                            <tr>
                                                <td>{index+1}</td>
                                                <td><NavLink to={`/admin/users/${value?.username}`}><div className='profile'><img src={value?.profile ? `${BASE_API_URL}/uploads/profile/${value?.profile}` : "/assets/images/profile.png"}  alt="" />{value?.username}</div></NavLink></td>
                                                <td><NavLink to={`/admin/users/${value?.username}`}><button><i class="fa-solid fa-eye fa-lg"></i></button></NavLink></td>
                                                <td><NavLink to=''><button><i className="fa-solid fa-user-pen fa-lg"  /></button></NavLink></td>
                                                <td><button onClick={()=>{blockUser(value.username)}}>{!value.isblock ? <i class="fa-solid fa-user-unlock fa-lg"></i> : <i class="fa-solid fa-user-lock fa-lg"></i>}</button></td>
                                                <td><NavLink to=''><button><i class="fa-solid fa-user-xmark fa-lg"></i></button></NavLink></td>
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
    </>
  )
}

export default AllUsers