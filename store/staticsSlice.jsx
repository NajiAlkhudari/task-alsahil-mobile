import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

export const fetchDataStatics = createAsyncThunk("statics/fetchDataStatics", async (id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  
  const token = await AsyncStorage.getItem("token");
      
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await axios.get(`https://tasklog.premiumasp.net/api/Visit/GetEmployeeVisitStats/${id}`, {
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

const staticsSlice = createSlice({
  name: "statics",
  initialState: {
    success: false,
    statics: [],
    loading: false,  
    error: null,    
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataStatics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataStatics.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.statics = action.payload; 
      })
      .addCase(fetchDataStatics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  
      });
  },
});

export default staticsSlice.reducer;
