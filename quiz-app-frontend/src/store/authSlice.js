import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// --- Thunks (Xử lý bất đồng bộ) ---

// Đăng nhập
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/login', { username, password });
      // Lấy user data từ token (giả định) hoặc cần 1 API /users/me
      // Ở đây chúng ta sẽ lưu token và username
      const data = {
        token: response.data.token,
        username: username, // Lấy username từ input
      };
      
      // Lấy thông tin chi tiết user (để kiểm tra admin)
      // Cần đăng nhập với quyền admin để gọi /users
      // Giải pháp tốt hơn: API login nên trả về cả user.admin
      // Tạm thời: Chúng ta sẽ thử gọi /users, nếu thành công -> admin
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

// Đăng ký
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

// --- Lấy state ban đầu từ localStorage ---
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
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  };
};


const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    // Đăng xuất
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
      // Xử lý Login
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