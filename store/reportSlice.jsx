import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

export const fetchDataUser = createAsyncThunk("report/fetchDataUser", async (id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  
  const token = await AsyncStorage.getItem("token");
      
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await axios.get(`http://tasklog.runasp.net/api/Report?id=${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.data; 
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data.message : error.message);
  }
});

const reportSlice = createSlice({
  name: "report",
  initialState: {
    success: false,
    report: [],
    loading: false,  
    error: null,    
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.report = action.payload; 
      })
      .addCase(fetchDataUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  
      });
  },
});

export default reportSlice.reducer;
