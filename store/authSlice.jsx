import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
  

      const response = await axios.post(
        'https://tasklog.premiumasp.net/api/Auth/login',
        { email, password },
        {
          headers: {
             'Content-Type': 'application/json' 
            },
        
        }
      );

      const responseData = response?.data;
      if (!responseData || !responseData.token) {
        throw new Error("Invalid response from server");
      }

      const { token, role } = responseData;

      if (token) {
        await AsyncStorage.setItem("token", token);
      }
      if (role !== undefined) {
        await AsyncStorage.setItem("role", JSON.stringify(role));
      }

      return { token, role };
    } catch (error) {

 
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    success: false,
    loading: false,
    error: null,
    token: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;

