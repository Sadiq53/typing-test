import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {

    const [checkToken, setCheckToken] = useState(false);

    useEffect(()=> {
        if(localStorage.getItem('userToken')) {
            setCheckToken(true)
        } else {
            setCheckToken(false)
        }
    }, [])

  return (
    <>
        <div className="container py-5">
            <div className="row align-items-center">
                <div className="col-md-6">
                <div className="header">
                    <img src="/assets/images/logo.svg" alt="" />
                </div>
                </div>
                <div className="col-md-6">
                <div className="header">
                    <ul className="menu">
                    {
                        checkToken ? (
                            <>
                            <NavLink to='/user/lobby'><li>Start Live Test</li></NavLink>
                            <NavLink to='/user/leaderboard'><li>Leaderboard</li></NavLink>
                            <NavLink to='/'><li>Blogs</li></NavLink>
                            <li className="dropdown">
                                <NavLink to='/user'><i className="fa-solid fa-user"></i> &nbsp; User</NavLink>
                                <ul className="dropdown-menu">
                                    <NavLink to='/user'><li>Profile</li></NavLink>
                                    <NavLink to='/settings'><li>Settings</li></NavLink>
                                    <NavLink to='/user/signout'><li>Logout</li></NavLink>
                                </ul>
                            </li>
                            </>
                        ) : (
                            <>
                            <NavLink to='/'><li>Start Live Test</li></NavLink>
                            <NavLink to='/leaderboard'><li>Leaderboard</li></NavLink>
                            <NavLink to='/'><li>Blogs</li></NavLink>
                            <NavLink to='/signup'><li><i className="fa-solid fa-user"></i> &nbsp; Login/Signup</li></NavLink>
                            </>
                        )
                    }
                    </ul>
                </div>
                </div>
            </div>
        </div>

    </>
  )
}

export default Header