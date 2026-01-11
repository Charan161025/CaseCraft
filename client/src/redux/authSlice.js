import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// 1. General Auth (Login/Register)
export const authUser = createAsyncThunk(
  'auth/authUser',
  async ({ data, endpoint }, { rejectWithValue }) => {
    try {
      const response = await API.post(endpoint, data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Something went wrong");
    }
  }
);

// 2. Forgot Password (OTP Request)
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/forgot-password", { email });
      return response.data; // Expected: { message: "OTP sent to your email!" }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "User not found");
    }
  }
);

// 3. Reset Password (OTP Verification)
export const resetPasswordOTP = createAsyncThunk(
  "auth/resetPasswordOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/reset-password-otp", data);
      return response.data; // Expected: { message: "Password updated successfully!" }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Invalid or expired OTP");
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.message = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Login/Register
      .addCase(authUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(authUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Forgot Password (Step 1)
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Reset Password (Step 2)
      .addCase(resetPasswordOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPasswordOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;