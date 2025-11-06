import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Thunks cho Admin
export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async () => {
    const response = await api.get('/question');
    return response.data;
  }
);

export const addQuestion = createAsyncThunk(
  'questions/addQuestion',
  async (questionData) => {
    const response = await api.post('/question', questionData);
    return response.data;
  }
);

export const updateQuestion = createAsyncThunk(
  'questions/updateQuestion',
  async ({ id, data }) => {
    const response = await api.put(`/question/${id}`, data);
    return response.data;
  }
);

export const deleteQuestion = createAsyncThunk(
  'questions/deleteQuestion',
  async (id) => {
    await api.delete(`/question/${id}`);
    return id; // Trả về ID để xóa khỏi state
  }
);

const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.items.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter(q => q._id !== action.payload);
      });
  },
});

export default questionSlice.reducer;