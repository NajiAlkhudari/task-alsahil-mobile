import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import axios from "axios";

export const fetchTask = createAsyncThunk(
  "tasks/fetchTask",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get('https://tasklog.premiumasp.net/api/Task', {
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


const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })       
  },
});

export default taskSlice.reducer;
