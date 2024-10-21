import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { ADMIN_API_URL } from '../util/API_URL'

const handleGetAdminData = createAsyncThunk('handleGetAdminData', async(ID) => {
    const response = await axios.get(`${ADMIN_API_URL}/${ID}`);
    if(response.data.status === 200) {
        return response.data.admindata
    }
});



const initialState = {
    isProcessing : false,
    isFulfilled : false,
    isError : false,
    isDataPending : false,
}

const AdminDataSlice = createSlice({
    name : "adminDataSlice",
    initialState,
    extraReducers : builder => {
        builder.addCase(handleGetAdminData.fulfilled, (state, action) => {
            
        });
    }
})

export default AdminDataSlice.reducer;
export {handleGetAdminData};