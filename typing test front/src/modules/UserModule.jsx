import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'
import { handleGetUserData, handleLocalDataCalling, resetState } from '../redux/UserDataSlice';
import PageDataLoader from '../component/shared/loader/PageDataLoader';
import { messaging } from '../firebaseConfig'
import { getToken, onMessage } from "firebase/messaging";
import { USER_API_URL } from '../util/API_URL';
import { dynamicToast } from '../component/shared/Toast/DynamicToast';
import { handleGetAboutData, handleGetPrivacyData, handleGetTermData } from '../redux/DynamicPagesDataSlice';


const UserModule = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageLoader, setPageLoader] = useState(false)
    const userData = useSelector(state => state.UserDataSlice.userData)
    const isDataPending = useSelector(state => state.UserDataSlice.isDataPending)
    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)


    // Request permission to receive notifications
    const requestPermission = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: "BM1DDx1f-tHNs1IMylr8YE-P-jfD-BJIRSldNJE87oKiBnk6xTYs34RM1sosyQbzwa-cIkZBbHQsS_C-LwmRICM" });
        if (token) {
        // Save the token to the server
        await fetch(`${USER_API_URL}/save-token`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, userId: localStorage.getItem('userToken') }) // Replace with dynamic user ID
        });
        console.log("Token saved:", token);
        } else {
        console.log("No registration token available. Request permission to generate one.");
        }
    } catch (error) {
        console.error("An error occurred while retrieving token:", error);
    }
    };


    useEffect(() => {
        requestPermission();
    }, [])

    useEffect(()=>{
        // Handle foreground messages
        onMessage(messaging, (payload) => {
            console.log("Message received. ", payload);
            // Display notification in the app
            dynamicToast({ message: `${payload.notification.title}`, body : `${payload.notification.body}`, timer : 5000, icon: 'info' })
        });

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) => {
                console.log("Service Worker registered with scope:", registration.scope);
            })
            .catch((error) => {
                console.error("Service Worker registration failed:", error);
            });
        }
    }, [])


    useEffect(()=>{
        if(!localStorage.getItem('userToken')) {
            navigate(`/signin`)
        }
    }, [])

    useEffect(()=>{
        dispatch(handleLocalDataCalling())
    }, [])  
    
    useEffect(()=>{
        const ID = localStorage.getItem('userToken')
        dispatch(handleGetUserData(ID))
    }, [])

    useEffect(()=>{
        if(isDataPending) {
            setPageLoader(true)
            dispatch(resetState())
        }
    }, [isDataPending])

    useEffect(()=>{
        if(isFullfilled) {
            setPageLoader(false)
            dispatch(resetState())
        }
    }, [isFullfilled])
    
    useEffect(()=>{
        if(userData?.isblock) {
            navigate(`/user/signout/${'isBlocked'}`)
        }
    }, [userData])

    useEffect(()=>{dispatch(handleGetAboutData())}, [])
    // useEffect(()=>{dispatch(handleGetPrivacyData())}, [])
    useEffect(()=>{dispatch(handleGetTermData())}, [])

    return (
        <>
            <Outlet />
            {
                pageLoader && (<PageDataLoader />) 
            }
        </>
    )
}

export default UserModule