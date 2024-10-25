import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { ADMIN_API_URL } from '../util/API_URL'

const handleGetAdminData = createAsyncThunk('handleGetAdminData', async(ID) => {
    const response = await axios.get(`${ADMIN_API_URL}/${ID}`,{ headers : { Authorization : ID } });
    if(response.data.status === 200) {
        localStorage.setItem('isSignin', true)
        localStorage.setItem('adminToken', response.data.token)
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.adminData,
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type,
            data : [],
        }
        // console.log(checkMsg)
        return checkMsg
    }
});

const handleSigninAdmin = createAsyncThunk('handleSigninAdmin', async(formData) => {
    const response = await axios.post(`${ADMIN_API_URL}/signin`, formData);
    if(response.data.status === 200) {
        localStorage.setItem('isSignin', true)
        localStorage.setItem('adminToken', response.data.token)
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type
        }
        // console.log(checkMsg)
        return checkMsg
    }
});

const handleGetALlUser = createAsyncThunk('handleGetALlUser', async() => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.get(`${ADMIN_API_URL}/get-user`, { headers : { Authorization : ID } })
}) 



const initialState = {
    isProcessing : false,
    isFullfilled : false,
    isError : false,
    errorMsg : {
        type : '',
        message : ''
    },
    fullFillMsg : {
        type : '',
        message : ''
    },
    processingMsg : {
        type : '',
        message : ''
    },
    isDataPending : false,
    adminData : {},
}

const AdminDataSlice = createSlice({
    name : "adminDataSlice",
    initialState,
    reducers : {
        resetState : (state) =>{
            state.isError = false;
            state.isFullfilled = false;
            state.errorMsg = {},
            state.fullFillMsg = {}
            state.processingMsg = {}
        },
        handleClearState : (state) => {
            state.adminData = {}
        }
    },
    extraReducers : builder => {
        builder.addCase(handleGetAdminData.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.adminData = action.payload.data
                state.isProcessing = false
                state.isError = false
                state.isFullfilled = true
            } else {    
                state.isError = true
                state.isProcessing = false
            }
        });
        builder.addCase(handleGetAdminData.pending, (state, action) => {
            state.isProcessing = true
        });
        builder.addCase(handleSigninAdmin.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message,
                state.isError = false
                state.isProcessing = false
                state.processingMsg = {}
                state.errorMsg = {}
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleSigninAdmin.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Fetching Data...'
            state.processingMsg.type = 'signin'
        });
    }
})

export default AdminDataSlice.reducer;
export {handleGetAdminData, handleSigninAdmin, handleGetALlUser};
export const {resetState, handleClearState} = AdminDataSlice.actions