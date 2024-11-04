import React from 'react'
import Header from '../shared/header/Header'
import SideBar from '../shared/header/SideBar'

const Testing = () => {
  return (
    <>
      <div
            className="page-wrapper"
            id="main-wrapper"
            data-layout="vertical"
            data-navbarbg="skin6"
            data-sidebartype="full"
            data-sidebar-position="fixed"
            data-header-position="fixed"
        >
            {/* Sidebar Start */}
            <SideBar />
            {/*  Sidebar End */}
            {/*  Main wrapper */}
            <div className="body-wrapper">
                {/*  Header Start */}
                
                <Header />
                {/*  Header End */}
                
                {/* <Outlet /> */}
                
            </div>
        </div> 

    </>
  )
}

export default Testing