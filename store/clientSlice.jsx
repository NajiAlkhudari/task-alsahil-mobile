import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import axios from "axios";

export const fetchClient = createAsyncThunk(
  "clients/fetchClient",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get('https://tasklog.premiumasp.net/api/Client', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error("Failed to fetch data");
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data.message : error.message);
    }
  }
);


const clientSlice = createSlice({
  name: "clients",
  initialState: {
    clients: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })       
  },
});

export default clientSlice.reducer;
