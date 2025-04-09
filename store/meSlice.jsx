import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

export const detail = createAsyncThunk("me/detail", async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  
  const token = await AsyncStorage.getItem("token");
      
  if (!token) {
    throw new Error("Token not found");
  }


  try {
    const response = await axios.get('http://tasklog.runasp.net/api/Auth/Me', {
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

const meSlice = createSlice({
  name: "me",
  initialState: {
    success: false,
    id: null,
    name: null,
    notes: null,
    role: null,
    loading: false, 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(detail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.id = action.payload.id;
        state.role = action.payload.role;
        state.name = action.payload.name;
      
      })
      .addCase(detail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default meSlice.reducer;
