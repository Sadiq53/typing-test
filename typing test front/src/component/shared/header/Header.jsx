import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {

    // Memoized token checks
    const checkUserToken = useMemo(() => !!localStorage.getItem('userToken'), []);
    const checkAdminToken = useMemo(() => !!localStorage.getItem('adminToken'), []);

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
                                    checkUserToken ? (
                                        <>
                                            <NavLink to='/user/lobby'><li>Start Live Test</li></NavLink>
                                            <NavLink to='/user/leaderboard'><li>Leaderboard</li></NavLink>
                                            <NavLink to='/user/blog'><li>Blogs</li></NavLink>
                                            <li className="dropdown">
                                                <NavLink to='/user'><i className="fa-solid fa-user"></i> &nbsp; User</NavLink>
                                                <ul className="dropdown-menu">
                                                    <NavLink to='/user'><li>Profile</li></NavLink>
                                                    <NavLink to='/settings'><li>Settings</li></NavLink>
                                                    <NavLink to={`/user/signout/${'isSignout'}`}><li>Logout</li></NavLink>
                                                </ul>
                                            </li>
                                        </>
                                    ) : checkAdminToken ? (
                                        <>
                                            <NavLink to='/admin/leaderboard'><li>Leaderboard</li></NavLink>
                                            <NavLink to='/admin/paragraphs'><li>Paragraphs</li></NavLink>
                                            <NavLink to='/admin/blog'><li>Blogs</li></NavLink>
                                            <li className="dropdown">
                                                <NavLink to='/admin/users'><i className="fa-solid fa-user"></i> &nbsp; User</NavLink>
                                                <ul className="dropdown-menu">
                                                    <NavLink to='/admin/add-user'><li>Add User</li></NavLink>
                                                    <NavLink to='/admin/delete-user'><li>Delete User</li></NavLink>
                                                </ul>
                                            </li>
                                            <NavLink to={`/admin/signout/${'isSignout'}`}><li>Logout</li></NavLink>
                                        </>
                                    ) : (
                                        <>
                                            <NavLink to='/'><li>Start Live Test</li></NavLink>
                                            <NavLink to='/leaderboard'><li>Leaderboard</li></NavLink>
                                            <NavLink to='/blog'><li>Blogs</li></NavLink>
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

export default Header;
