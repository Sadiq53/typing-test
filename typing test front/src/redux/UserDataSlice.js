import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { USER_API_URL } from '../util/API_URL'

const handleGetUserData = createAsyncThunk('handleGetUserData', async(ID) => {
    const response = await axios.get(`${USER_API_URL}/${ID}`, { headers : { Authorization : ID } });
    // console.log(response.data)
    if(response.data.status === 200) {
        return response.data.userdata
    }
});

const handleSigninUser = createAsyncThunk('handleSigninUser', async(formData) => {
    const response = await axios.post(`${USER_API_URL}/signin`, formData)
    // console.log(response.data)
    if(response.data.status === 200) {
        localStorage.setItem('isSignin', true)
        localStorage.setItem('userToken', response.data.token)
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
})

const handleUpdatePassword = createAsyncThunk('handleUpdatePassword', async(formData) => {
    const ID = localStorage.getItem('userToken')
    const response = await axios.post(`${USER_API_URL}/updatepass/${ID}`, formData, { headers : { Authorization : ID } })
    if(response.data.status === 200) {
        return formData
    } else return 
})


const handleCreateUser = createAsyncThunk('handleCreateUser', async(formData) => {
    const response = await axios.post(`${USER_API_URL}/signup`, formData)
    // console.log(response.data)
    if(response.data.status === 200) {
        localStorage.setItem('userToken', response.data.token)
        let checkMsg = {
            status : true,
            message : '',
            type : ''
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

const handleTest = createAsyncThunk('handleTest', async(stats)=>{
    const ID = localStorage.getItem('userToken')
    console.log(stats)
    const response = await axios.post(`${USER_API_URL}`, stats, { headers : { Authorization : ID } } )
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.stats,
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type,
            data : []
        }
        return checkMsg
    }
});

const handleGetLeaderboardData = createAsyncThunk('handleGetLeaderboardData', async(data)=>{
    const { onLoadLimit, timeFilter } = data
    const response = await axios.get(`${USER_API_URL}/dashdata/${onLoadLimit}/${timeFilter}`)
    // console.log(response.data.userData)
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.userData,
        }
        return checkMsg
    }
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
    userData : [],
    match1 : [],
    match3 : [],
    match5 : [],
    allUserData : []
}

const UserDataSlice = createSlice({
    name : "userDataSlice",
    initialState,
    reducers : {
        resetState : (state) =>{
            state.isError = false;
            state.isFullfilled = false;
            state.errorMsg = {},
            state.fullFillMsg = {}
        },
        handleClearState : (state) => {
            state.userData = [];
            state.match1 = [];
            state.match3 = [];
            state.match5 = [];
        }
    },
    extraReducers : builder => {
        builder.addCase(handleGetUserData.fulfilled, (state, action) => {
            if(action.payload) {
                state.userData = action.payload;
                state.match1 = action.payload.match_1;
                state.match3 = action.payload.match_3;
                state.match5 = action.payload.match_5;
                state.isProcessing = false
                state.isError = false
                state.isFullfilled = true
            } else {    
                state.isError = true
                state.isProcessing = false
            }
        });
        builder.addCase(handleGetUserData.pending, (state, action) => {
            state.isProcessing = true
        });
        builder.addCase(handleSigninUser.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message,
                state.isError = false
                state.isProcessing = false
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleSigninUser.pending, (state, action) => {
            state.isProcessing = true
        });
        builder.addCase(handleCreateUser.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.isError = false
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleCreateUser.pending, (state, action) => {
            state.isProcessing = true
        });
        builder.addCase(handleUpdatePassword.fulfilled, (state, action) => {
            if(action?.payload) {
                state.isFullfilled = true
                state.isProcessing = false
            } else {
                state.isProcessing = false
                state.isError = true
            }
        });
        builder.addCase(handleUpdatePassword.pending, (state, action) => {
            state.isProcessing = true
        });
        builder.addCase(handleTest.fulfilled, (state, action) => {
            console.log("i am payload", action.payload)
            if(action.payload?.status) {
                state.isFullfilled = true,
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message,
                state.isProcessing = false
                const {data} = action.payload
                const {time} = data
                // Create a mapping of time values to match properties
                const matchPropertyMap = {
                    60: 'match1',
                    15: 'match1',
                    180: 'match3',
                    300: 'match5',
                };
                
                const matchProperty = matchPropertyMap[time];
            
                if (matchProperty) {
                    state[matchProperty]?.push(data)
                } 
            } else {
                state.isError = true,
                state.errorMsg.type = action.payload.type
                state.errorMsg.message = action.payload.message
            }
        });
        builder.addCase(handleTest.pending, (state, action) => {
            state.isProcessing = true
        });
        builder.addCase(handleGetLeaderboardData.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message,
                state.allUserData = action.payload.data
                state.isError = false
                state.isProcessing = false
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleGetLeaderboardData.pending, (state, action) => {
            state.isProcessing = true
        });
    }
})

export default UserDataSlice.reducer;
export {handleGetUserData, handleSigninUser, handleCreateUser, handleUpdatePassword, handleTest, handleGetLeaderboardData};
export const{ resetState, handleClearState } = UserDataSlice.actions