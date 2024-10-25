import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'
import { handleGetAdminData } from '../redux/AdminDataSlice';


const AdminModule = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        if(!localStorage.getItem('adminToken')) {
            navigate(`/`)
        }
    }, [])

    
    useEffect(()=>{
        const ID = localStorage.getItem('adminToken')
        dispatch(handleGetAdminData(ID))
    }, [])

    return (
        <Outlet />
    )
}

export default AdminModule