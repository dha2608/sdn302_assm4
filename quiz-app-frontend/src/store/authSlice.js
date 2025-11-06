import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/login', { username, password });
      //  lưu token và username ở đây
      const data = {
        token: response.data.token,
        username: username, 
      };
      

      try {
        await api.get('/users');
        data.isAdmin = true;
      } catch (adminError) {
        data.isAdmin = false;
      }
      
      localStorage.setItem('auth', JSON.stringify(data));
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/signup', { username, password });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// --- state ban đầu từ localstorage ---
const getInitialState = () => {
  const authData = localStorage.getItem('auth');
  if (authData) {
    const { token, username, isAdmin } = JSON.parse(authData);
    return {
      token: token,
      username: username,
      isAdmin: isAdmin,
      isAuthenticated: true,
      status: 'succeeded',
      error: null,
    };
  }
  return {
    token: null,
    username: null,
    isAdmin: false,
    isAuthenticated: false,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null,
  };
};


const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logoutUser: (state) => {
      state.token = null;
      state.username = null;
      state.isAdmin = false;
      state.isAuthenticated = false;
      state.status = 'idle';
      localStorage.removeItem('auth');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.isAdmin = action.payload.isAdmin;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Đăng nhập thất bại';
      })
      // Xử lý Register (chỉ đổi status, không tự động login)
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.err.message || 'Đăng ký thất bại';
      });
  },
});

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;