import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { handleClearState } from '../../../redux/UserDataSlice';

const Signout = () => {

    localStorage.clear();
    const dispatch = useDispatch();

    useEffect(()=>{
      dispatch(handleClearState());
      localStorage.setItem('isSignout', true)
    }, [])

  return (
    <Navigate to='/' />
  )
}

export default Signout