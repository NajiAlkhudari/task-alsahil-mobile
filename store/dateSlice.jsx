import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const postDate = createAsyncThunk(
  "dates/postDate",
  async (postData, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Token not found");
    }
    try {
      const response = await axios.post(
        "https://tasklog.premiumasp.net/api/Date",
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



export const fetchDatesUser = createAsyncThunk("dates/fetchDatesUser", async (id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  
  const token = await AsyncStorage.getItem("token");
      
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await axios.get(`https://tasklog.premiumasp.net/api/Date/allByUser?id=${id}`, {
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



export const completeDate = createAsyncThunk(
  "dates/completeDate",
  async (id, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Token not found");
    }

    try {
      const response = await axios.patch(
        `https://tasklog.premiumasp.net/api/Date/complete/${id}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return { id, success: response?.data?.success };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);


const dateSlice = createSlice({
  name: "dates",
  initialState: {
    dates: [],
    error: null,
    loading: false,
      success: false, 

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postDate.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(postDate.fulfilled, (state, action) => {
        state.loading = false;
        state.dates.push(action.payload);
      })
      .addCase(postDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(fetchDatesUser.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchDatesUser.fulfilled, (state, action) => {
              state.loading = false;
              state.success = true;
              state.dates = action.payload; 
            })
            .addCase(fetchDatesUser.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;  
            })
                  .addCase(completeDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeDate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // نحدث حالة الموعد داخليًا لو كنت تعرضها في جدول مثلاً
        const index = state.dates.findIndex(date => date.id === action.payload.id);
        if (index !== -1) {
          state.dates[index].status = 1; // أو "Completed" حسب ما تعرضه
        }
      })
      .addCase(completeDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default dateSlice.reducer;
