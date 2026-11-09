import { createSlice } from "@reduxjs/toolkit"

type AuthState = {
  signedOut: boolean
}

const initialState: AuthState = {
  signedOut: false,
}

// Keep a small auth flag so failed refresh requests can clear the client session state.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => ({ signedOut: true }),
    sessionRestored: () => ({ signedOut: false }),
  },
})

export const { logout, sessionRestored } = authSlice.actions
export default authSlice.reducer
