import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'
import { handleGetUserData, resetState } from '../redux/UserDataSlice';
import PageDataLoader from '../component/shared/loader/PageDataLoader';

const UserModule = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageLoader, setPageLoader] = useState(false)
    const userData = useSelector(state => state.UserDataSlice.userData)
    const isDataPending = useSelector(state => state.UserDataSlice.isDataPending)
    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)

    useEffect(()=>{
        if(!localStorage.getItem('userToken')) {
            navigate(`/signin`)
        }
    }, [])

    
    useEffect(()=>{
        const ID = localStorage.getItem('userToken')
        dispatch(handleGetUserData(ID))
    }, [])

    useEffect(()=>{
        if(isDataPending) {
            setPageLoader(true)
            dispatch(resetState())
        }
    }, [isDataPending])

    useEffect(()=>{
        if(isFullfilled) {
            setPageLoader(false)
            dispatch(resetState())
        }
    }, [isFullfilled])
    
    useEffect(()=>{
        if(userData?.isblock) {
            navigate(`/user/signout/${'isBlocked'}`)
        }
    }, [userData])

    return (
        <>
            <Outlet />
            {
                pageLoader && (<PageDataLoader />) 
            }
        </>
    )
}

export default UserModule