import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const postVisit = createAsyncThunk(
  "visits/postVisit",
  async (postData, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Token not found");
    }
    try {
      const response = await axios.post(
        "http://tasklog.runasp.net/api/Visit",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

const visitSlice = createSlice({
  name: "visits",
  initialState: {
    visits: [],
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postVisit.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(postVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.visits.push(action.payload);
      })
      .addCase(postVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default visitSlice.reducer;
