import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5005';

// Async thunk for login
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, userData);
    localStorage.setItem('token', response.data.token);
    
    // Log the backend response
    console.log('Backend response (login):', response.data);
    
    return response.data; // Ensure the backend returns { user, token }
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Async thunk for registration
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/register`, userData);
    localStorage.setItem('token', response.data.token);
    
    // Log the backend response
    console.log('Backend response (register):', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response ? error.response.data : error.message);
    return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      console.log('User logged out');
    },
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      console.log('Auth state reset');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Login request pending...');
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('Login fulfilled:', action.payload);

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        console.error('Login rejected:', action.payload);
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Registration request pending...');
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log('Registration fulfilled:', action.payload);

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        console.error('Registration rejected:', action.payload);
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
