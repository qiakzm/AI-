import { createSlice } from '@reduxjs/toolkit';
import { mockUserData } from '../mockUserData'; // mock 데이터

const userSlice = createSlice({
  name: 'user',
  initialState: mockUserData,
  reducers: {
    updateUserData(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  }
});

export const { updateUserData } = userSlice.actions;

export const selectUserData = (state) => state.user;

export default userSlice.reducer;
