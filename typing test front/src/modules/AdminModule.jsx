import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const AdminModule = () => {

    const navigate = useNavigate();

    useEffect(()=>{
        if(!localStorage.getItem('adminToken')) {
            navigate(`/`)
        }
    }, [])

    return (
        <Outlet />
    )
}

export default AdminModule