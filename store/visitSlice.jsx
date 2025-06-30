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
        "https://tasklog.premiumasp.net/api/Visit",
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


export const completeDate = createAsyncThunk(
  "visits/completeDate",
  async ({id, amountReceived},  { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Token not found");
    }

    try {
      const response = await axios.patch(
        `https://tasklog.premiumasp.net/api/Visit/complete/${id}`,
        amountReceived,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return { id, success: response?.data?.success };
    } catch (error) {
      console.log("COMPLETE ERROR", error.response?.data || error.message, error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);


export const fetchComplete = createAsyncThunk("visits/fetchComplete", async (id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await axios.get(`https://tasklog.premiumasp.net/api/Visit/allUserComplete?id=${id}`, {
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


export const fetchProgres = createAsyncThunk("visits/fetchProgres", async (id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await axios.get(`https://tasklog.premiumasp.net/api/Visit/allUserProgres?id=${id}`, {
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




const visitSlice = createSlice({
  name: "visits",
  initialState: {
    visits: [],
    error: null,
    loading: false,
      success: false,

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
      })
      .addCase(fetchComplete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplete.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload;
      })
      .addCase(fetchComplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
          .addCase(fetchProgres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgres.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload;
      })
      .addCase(fetchProgres.rejected, (state, action) => {
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

        const index = state.visits.findIndex(date => date.id === action.payload.id);
        if (index !== -1) {
          state.visits[index].status = 1; 
        }
      })
      .addCase(completeDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default visitSlice.reducer;
