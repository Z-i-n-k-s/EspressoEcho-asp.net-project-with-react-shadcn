// userSlice.js
import { createSlice } from '@reduxjs/toolkit'

// Get initial state from localStorage if available
const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    return null;
  }
};

const initialState = {
  user: getUserFromLocalStorage(),
  role: localStorage.getItem('role') || null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload;
      state.role = action.payload?.roles?.[0]?.toLowerCase() || null;
      
      // Also store in localStorage for persistence
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('role', state.role);
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.role = null;
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUserDetails, clearUser } = userSlice.actions

export default userSlice.reducer