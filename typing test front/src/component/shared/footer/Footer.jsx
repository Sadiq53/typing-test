import { useMemo } from 'react';
import { NavLink } from 'react-router-dom'

const Footer = () => {

    const checkUserToken = useMemo(() => !!localStorage.getItem('userToken'), []);

  return (
    <>
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="footer-layout">
                            <div className='footer'>
                                <ul>
                                    <li><NavLink to=''>Copyright 2024 &nbsp; |</NavLink></li>
                                    <li><NavLink to='/'>Live Typing Test &nbsp; |</NavLink></li>
                                    <li><NavLink to=''>All Rights Reserved.</NavLink></li>
                                </ul>
                                <p>Design and Developed By <span>Aerozef Creations</span></p>
                            </div>
                            <div className="footer">
                                <ul>
                                    <li><NavLink to={checkUserToken ? '/user/contact' : '/contact'}>Contact Us &nbsp; |</NavLink></li>
                                    <li><NavLink to={checkUserToken ? '/user/about' : '/about'}>About &nbsp; |</NavLink></li>
                                    <li><NavLink to={checkUserToken ? '/user/privacy' : '/privacy'}>Privacy Policy &nbsp; |</NavLink></li>
                                    <li><NavLink to={checkUserToken ? '/user/term-condition' : '/term-condition'}>Terms & Condition</NavLink></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </>
  )
}

export default Footer