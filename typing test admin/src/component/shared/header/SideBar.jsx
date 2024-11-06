import {NavLink} from 'react-router-dom'

const SideBar = () => {
  return (
    <>
    <aside className="left-sidebar">
        {/* Sidebar scroll*/}
        <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
            <NavLink to='/admin' className="text-nowrap logo-img">
            <img src="/assets/images/logo 2.svg" width={180} alt="" />
            </NavLink>
            <div
            className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
            id="sidebarCollapse"
            >
            <i className="ti ti-x fs-8" />
            </div>
        </div>
        {/* Sidebar navigation*/}
        <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
            <ul id="sidebarnav">
            <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4" />
                <span className="hide-menu">Home</span>
            </li>
            <li className="sidebar-item">
                <NavLink
                className="sidebar-link"
                to='/admin'
                aria-expanded="false"
                >
                <span>
                    <i className="ti ti-layout-dashboard" />
                </span>
                <span className="hide-menu">Dashboard</span>
                </NavLink>
            </li>
            {/* USER PART */}
            <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4" />
                <span className="hide-menu">Users</span>
            </li>
            <li className="sidebar-item">
                <NavLink
                className="sidebar-link"
                to='/admin/users/add'
                aria-expanded="false"
                >
                <span>
                    <i class="fa-solid fa-user-plus"></i>
                </span>
                <span className="hide-menu"> Add</span>
                </NavLink>
            </li>
            <li className="sidebar-item">
                <NavLink
                className="sidebar-link"
                to='/admin/users'
                aria-expanded="false"
                >
                <span>
                    <i class="fa-solid fa-eye"></i>
                </span>
                <span className="hide-menu">View All</span>
                </NavLink>
            </li>
            {/* USER PART */}

            {/* PARAGRAPH PART */}
            <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4" />
                <span className="hide-menu">Paragrpah</span>
            </li>
            <li className="sidebar-item">
                <NavLink
                className="sidebar-link"
                to='/admin/paragraphs'
                aria-expanded="false"
                >
                <span>
                    <i class="fa-regular fa-list-check"></i>
                </span>
                <span className="hide-menu">Manage Paragraphs</span>
                </NavLink>
            </li>
            {/* PARAGRAPH PART */}

            {/* Blogs PART */}
            <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4" />
                <span className="hide-menu">Blogs</span>
            </li>
            <li className="sidebar-item">
                <NavLink
                className="sidebar-link"
                to='/admin/blog'
                aria-expanded="false"
                >
                <span>
                    <i class="fa-solid fa-folder-grid"></i>
                </span>
                <span className="hide-menu">Manage Blogs</span>
                </NavLink>
            </li>
            {/* Blogs PART */}

            {/* LEADERBOARD PART */}
            <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4" />
                <span className="hide-menu">Leaderboard</span>
            </li>
            <li className="sidebar-item">
                <NavLink
                className="sidebar-link"
                to='/admin/leaderboard'
                aria-expanded="false"
                >
                <span>
                    <i class="fa-solid fa-trophy"></i>
                </span>
                <span className="hide-menu">Leaderboard</span>
                </NavLink>
            </li>
            {/* LEADERBOARD PART */}

            {/* LEADERBOARD PART */}
            <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4" />
                <span className="hide-menu">Notification</span>
            </li>
            <li className="sidebar-item">
                <NavLink
                className="sidebar-link"
                to='/admin/push-notification'
                aria-expanded="false"
                >
                <span>
                    <i class="fa-duotone fa-solid fa-envelope"></i>
                </span>
                <span className="hide-menu">Push Notification</span>
                </NavLink>
            </li>
            {/* LEADERBOARD PART */}

            {/* AUTH PART */}
            <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4" />
                <span className="hide-menu">AUTH</span>
            </li>
            <li className="sidebar-item">
                <NavLink
                className="sidebar-link"
                to={`/admin/signout/${'isSignout'}`}
                aria-expanded="false"
                >
                <span>
                    <i className="ti ti-login" />
                </span>
                <span className="hide-menu">Logout</span>
                </NavLink>
            </li>
            {/* AUTH PART */}
            </ul>
            
        </nav>
        {/* End Sidebar navigation */}
        </div>
        {/* End Sidebar scroll*/}
    </aside>
    </>
  )
}

export default SideBar