import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { handleDeleteUserAccount } from '../../../../../redux/UserDataSlice';
import { useNavigate } from 'react-router-dom';

const DeleteUserModal = () => {

    const clsModal = useRef();
    const dispatch = useDispatch();
    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled) 
    const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg) 
    const navigate = useNavigate();

    const deleteConfirmation = () =>{
        dispatch(handleDeleteUserAccount())
    }

    useEffect(()=>{
        if(isFullfilled) {
            if(fullFillMsg?.type === 'delete') {
                setTimeout(()=>{
                    navigate(`/user/signout/${'accountDelete'}`)
                },10)
                clsModal.current.click();
            }
        }
    }, [isFullfilled, fullFillMsg])




    return (
    <>
        <div
        className="modal fade"
        id="deleteaccount"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="deleteaccount"
        aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-popup">
                    <div className="modal-body p-30">
                        <div className='pass-modal'>
                            <div className='pass-header'>
                                <h4 className='font-active'>Are You Sure You Want to Delete Your Account ?</h4>
                            </div>
                                {/* <div className="pass-body my-4">
                                    
                                </div> */}
                                <div className="pass-footer mt-4">
                                    <button
                                    type="button"
                                    className="theme-btn sm bg-idle"
                                    data-bs-dismiss="modal"
                                    ref={clsModal}
                                    >
                                        Close
                                    </button>
                                    <button  onClick={deleteConfirmation} className="theme-btn-danger sm">
                                        Delete
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default DeleteUserModal