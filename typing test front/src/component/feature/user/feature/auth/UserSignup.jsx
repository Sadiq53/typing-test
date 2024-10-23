import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import UserSignupSchema from '../../../../../schemas/UserSignupSchema'
import { useDispatch, useSelector } from 'react-redux'
import { handleCreateUser, resetState } from '../../../../../redux/UserDataSlice'
import { useNavigate } from 'react-router-dom'
import GoogleAuth from './GoogleAuth'

const UserSignup = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
  const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
  const isError = useSelector(state => state.UserDataSlice.isError)
  const errorMsg = useSelector(state => state.UserDataSlice.errorMsg)
  const [eye, setEye] = useState({pass : false, repass : false})
  const [loader, setLoader] = useState(false)
  const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg)

  const signupForm = useFormik({
    validationSchema : UserSignupSchema,
    initialValues : {
      username : '',
      email : '',
      password : '',
      repassword : '',
      createdate : null
    },
    onSubmit : async(formData) => {
      formData.createdate = new Date();
      // console.log(formData)
      dispatch(handleCreateUser(formData))
    }
  })

  const togglePasswordVisibility = (field) => {
    setEye(prevState => ({ ...prevState, [field]: !prevState[field] }));
  };

  useEffect(() => {
    if(isProcessing) {
      setLoader(true)
      dispatch(resetState())
    } else setLoader(false)
  }, [isProcessing])


  useEffect(() => {
    if(isError) {
      setTimeout(()=>{
        dispatch(resetState())
      }, 4000)
    }
  }, [isError])

  useEffect(() => {
    if(isFullfilled) {
      if(fullFillMsg?.type === 'signup'){
        navigate(`/user`)
        dispatch(resetState())
      }
    }
  }, [isFullfilled, fullFillMsg])


  return (
    <>
      <form onSubmit={signupForm.handleSubmit}>
        <h4 className='font-active text-left'>Create an Account</h4>
        {
          errorMsg?.type === 'signup' ? (<small className='text-danger'>{errorMsg?.message}</small>) : null
        }
        <div className='auth-input my-4'>
          <div className="auth">
          <input  type="text" name='username' onChange={signupForm.handleChange} placeholder='User Name' />
          <i className="fa-solid fa-user fa-sm" style={{ color: "#8c8c8c" }} />
          </div>
          <div className="auth">
          <input  type="email" name='email' onChange={signupForm.handleChange} placeholder='Email Address' />
          <i class="fa-solid fa-envelope fa-sm" style={{color : '#8c8c8c'}}></i>
          </div>
          <div className="auth">
            <input
              type={eye.pass ? "text" : "password"}
              name='password'
              onChange={signupForm.handleChange}
              placeholder='Password'
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('pass')}
            >
              {eye.pass ? (
                <i className="fa-solid fa-eye fa-sm" style={{ color: "#8c8c8c" }} />
              ) : (
                <i className="fa-solid fa-eye-slash fa-sm" style={{ color: "#8c8c8c" }} />
              )}
            </button>
          </div>

          <div className="auth">
            <input
              type={eye.repass ? "text" : "password"}
              name='repassword'
              onChange={signupForm.handleChange}
              placeholder='Confirm Password'
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('repass')}
            >
              {eye.repass ? (
                <i className="fa-solid fa-eye fa-sm" style={{ color: "#8c8c8c" }} />
              ) : (
                <i className="fa-solid fa-eye-slash fa-sm" style={{ color: "#8c8c8c" }} />
              )}
            </button>
          </div>
          <button type='submit' className='theme-btn lg width-90'>Sign Up { loader ? <i className="fa-solid fa-circle-notch fa-spin" style={{ color: "#15131a" }} /> : null }</button>
          <div className='width-90'><p className='font-idle text-center'>or</p></div>
          <div className='d-flex justify-content-center width-90'>
            <GoogleAuth props={'Sign Up'} />
          </div>
        </div>
      </form>
    </>
  )
}

export default UserSignup