import React from 'react'
import Header from '../../../../shared/header/Header'
import Footer from '../../../../shared/footer/Footer'
import { NavLink } from 'react-router-dom'
import UserSignin from './UserSignin'
import UserSignup from './UserSignup'

const UserAuth = () => {
  return (
    <>
        <Header />

        <section>
            <div className="container my-4">
                <div className="row align-items-start">
                    <div className="col-md-6">
                        <UserSignup />
                    </div>
                    <div className="col-md-6">
                        <UserSignin />
                    </div>
                </div>
            </div>
        </section>

        <Footer />
    </>
  )
}

export default UserAuth