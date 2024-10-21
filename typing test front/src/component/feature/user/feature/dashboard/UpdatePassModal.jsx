import { useFormik } from 'formik'
import React, { useEffect, useRef } from 'react'
import { passwordUpdateSchema } from '../../../../../schemas/UserUpdateSchema'
import { useDispatch, useSelector } from 'react-redux'
import { handleUpdatePassword, resetState } from '../../../../../redux/UserDataSlice'

const UpdatePassModal = () => {

    const dispatch = useDispatch();
    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
    const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
    const clsModal = useRef();
    const clrModal = useRef();

    const passwordForm = useFormik({
        validationSchema : passwordUpdateSchema,
        initialValues : {
            currentpassword : '',
            newpassword : '',
            repassword : ''
        },
        onSubmit : (formData) => {
            console.log(formData)
            dispatch(handleUpdatePassword(formData))
        }   
    })

    useEffect(()=>{
        if(isFullfilled){
            clrModal.current.click();
            setTimeout(()=>{
                clsModal.current.click();
                dispatch(resetState())
            },10)
        }
    }, [isFullfilled])

  return (
    <>
        <div
        className="modal fade"
        id="updatepassword"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="updatepassword"
        aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-popup">
                    <div className="modal-body">
                        <div className='pass-modal'>
                            <div className='pass-header'>
                                <h4 className='font-active'>Update Password</h4>
                            </div>
                            <form onSubmit={passwordForm.handleSubmit}>
                                <button style={{display : 'none'}} type='reset' ref={clrModal}></button>
                                <div className="pass-body my-4">
                                    <div className='profile-input my-3'>
                                        <label htmlFor="password">Enter Password :</label>
                                        <input name='currentpassword' onChange={passwordForm.handleChange} className='bg-input' type='password' placeholder='Current Password' />
                                    </div>
                                    <div className='profile-input my-3'>
                                        <label htmlFor="password">Enter New Password :</label>
                                        <input name='newpassword' onChange={passwordForm.handleChange} className='bg-input' type='password' placeholder='Enter New Password' />
                                    </div>
                                    <div className='profile-input my-3'>
                                        <label htmlFor="password">Confirm Password :</label>
                                        <input name='repassword' onChange={passwordForm.handleChange} className='bg-input' type='password' placeholder='Confirm Password' />
                                    </div>
                                </div>
                                <div className="pass-footer">
                                    <button
                                    type="button"
                                    className="theme-btn sm bg-idle"
                                    data-bs-dismiss="modal"
                                    ref={clsModal}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="theme-btn sm">
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>
  )
}

export default UpdatePassModal