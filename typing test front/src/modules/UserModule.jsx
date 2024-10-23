import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'
import { handleGetUserData } from '../redux/UserDataSlice';

const UserModule = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        if(!localStorage.getItem('userToken')) {
            navigate(`/signin`)
        }
    }, [])

    useEffect(()=>{
        const ID = localStorage.getItem('userToken')
        dispatch(handleGetUserData(ID))
    }, [])

    return (
        <Outlet />
    )
}

export default UserModule