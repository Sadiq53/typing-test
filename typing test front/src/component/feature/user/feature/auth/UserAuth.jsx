import React from 'react'
import Header from '../../../../shared/header/Header'
import Footer from '../../../../shared/footer/Footer'
import { NavLink } from 'react-router-dom'
import UserSignin from './UserSignin'
import UserSignup from './UserSignup'
import { GoogleOAuthProvider } from '@react-oauth/google'

const UserAuth = () => {
  return (
    <>
        <Header />
        <GoogleOAuthProvider clientId="817929072053-bkhte3f6rubnvt3f5g26t4qpa094fcjl.apps.googleusercontent.com">
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
        </GoogleOAuthProvider>

        <Footer />
    </>
  )
}

export default UserAuth