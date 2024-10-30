import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { handleLocalDataCalling } from '../redux/UserDataSlice';

const RootModule = () => {

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(handleLocalDataCalling())
    }, [])  

    return (
        <Outlet />
    )
}

export default RootModule