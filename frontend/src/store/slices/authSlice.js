import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Load persisted auth from localStorage
const savedAuth = (() => {
  try {
    return JSON.parse(localStorage.getItem('animall_auth') || 'null');
  } catch { return null; }
})();

// --- Async thunks ---

export const sendOTP = createAsyncThunk('auth/sendOTP', async (phone, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/send-otp', { phone });
    return { phone, demo_otp: res.data.demo_otp };
  } catch (err) {
    // Mock mode: always succeed
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[MOCK] OTP for ${phone}: ${mockOtp}`);
    return { phone, demo_otp: mockOtp };
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/verify-otp', { phone, otp });
    return res.data;
  } catch {
    // Mock mode: any 6-digit OTP works
    if (/^\d{6}$/.test(otp)) {
      const mockUser = {
        _id: `mock_${phone}`,
        phone,
        name: '',
        location: '',
      };
      return { token: `mock_token_${phone}`, user: mockUser };
    }
    return rejectWithValue('Invalid OTP');
  }
});

/**
 * Save profile changes to the backend. Replaces the local-only `updateUser`
 * reducer for any edit flow that should persist server-side. Accepts any subset
 * of: name, location, profilePhoto, whatsapp, dob, occupation, education,
 * experience, livestock.
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (patch, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await api.put('/auth/profile', patch, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // full updated user
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  },
);

/**
 * Upload a profile photo (multipart, field name "photo"). On success the
 * server returns the new URL + the updated user record.
 */
export const uploadProfilePhoto = createAsyncThunk(
  'auth/uploadProfilePhoto',
  async (file, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const fd = new FormData();
      fd.append('photo', file);
      const res = await api.post('/auth/profile-photo', fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Upload failed');
    }
  },
);

// --- Slice ---

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedAuth?.user || null,
    token: savedAuth?.token || null,
    isAuthenticated: !!savedAuth?.token,
    pendingPhone: '',
    demoOtp: '',
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.pendingPhone = '';
      state.demoOtp = '';
      localStorage.removeItem('animall_auth');
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('animall_auth', JSON.stringify({ user: state.user, token: state.token }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingPhone = action.payload.phone;
        state.demoOtp = action.payload.demo_otp;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send OTP';
      })
      .addCase(verifyOTP.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.pendingPhone = '';
        state.demoOtp = '';
        localStorage.setItem('animall_auth', JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
        }));
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'OTP verification failed';
      })
      // Profile updates merge into the existing user; also persist to
      // localStorage so a page refresh keeps the new values until next API read.
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('animall_auth', JSON.stringify({ user: state.user, token: state.token }));
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('animall_auth', JSON.stringify({ user: state.user, token: state.token }));
      });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
