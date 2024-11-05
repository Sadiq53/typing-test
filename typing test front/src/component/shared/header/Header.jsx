import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import GoogleADs from '../googleAds/GoogleADs';


const Header = () => {
    const checkUserToken = useMemo(() => !!localStorage.getItem('userToken'), []);
    const checkAdminToken = useMemo(() => !!localStorage.getItem('adminToken'), []);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <div className="container p-custom">
                <div className="row align-items-center">
                    <div className="col-md-6 col-12">
                        <div className="custom-header">
                            <div className="header">
                                <img src="/assets/images/logo.svg" alt="Logo" />
                            </div>
                            <button className="menu-toggle mob-show" onClick={toggleMenu}>
                                <i className={`fa-solid ${isOpen ? 'fa-xmark' :'fa-bars'} fa-xl`} style={{ color: "#71cac7" }} />
                            </button>
                        </div>
                    </div>
                    <div className="col-md-6 col-12">
                        <div className="header desk-show">
                            <ul className="menu">
                                {checkUserToken ? (
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
                                )}
                            </ul>
                        </div>
                        {/* Mobile Menu Toggle */}
                        
                        <div className={`menu-slider mob-show ${isOpen ? 'open' : ''}`}>
                            <ul className="menu">
                                {checkUserToken ? (
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
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-12 col-12"><GoogleADs /></div>
                </div>
            </div>
        </>
    );
};

export default Header;
