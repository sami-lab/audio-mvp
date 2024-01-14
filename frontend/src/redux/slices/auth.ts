import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import authService from "@/services/auth-service";

export const login = createAsyncThunk(
  "auth/login",
  async (user: { email: string; password: string }, thunkAPI) => {
    try {
      const response: AuthState = await authService.login(
        user.email,
        user.password
      );

      if (response.jwt) {
        return thunkAPI.fulfillWithValue({ ...response });
      } else {
        return thunkAPI.fulfillWithValue({ ...response });
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const externalLogin = createAsyncThunk(
  "auth/externalLogin",
  async (user: { token: string; method: string }, thunkAPI) => {
    try {
      const response: AuthState = await authService.externalLogin(
        user.token,
        user.method
      );

      if (response.jwt) {
        return thunkAPI.fulfillWithValue({ ...response });
      }
      return thunkAPI.rejectWithValue(false);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(false);
    }
  }
);
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (user: { name: string; bio: string }, thunkAPI) => {
    try {
      const response: any = await authService.updateMe(user.name, user.bio);
      const s = thunkAPI.getState() as {
        auth: AuthState;
      };

      if (response.success) {
        return thunkAPI.fulfillWithValue({
          jwt: s.auth.jwt,
          user: {
            ...s.auth.user,
            bio: response.data.doc.bio,
            name: response.data.doc.name,
          },
        });
      } else {
        return thunkAPI.rejectWithValue({ ...response });
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
const initialState = {} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logOut(_state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      login.fulfilled,
      (_state: AuthState, action: PayloadAction<AuthState>) => {
        const user = action.payload;
        return user;
      }
    );
    builder.addCase(
      login.rejected,
      (_state: AuthState, action: PayloadAction<any>) => {
        return initialState;
      }
    );
    builder.addCase(
      externalLogin.fulfilled,
      (_state: AuthState, action: PayloadAction<AuthState>) => {
        const user = action.payload;
        return user;
      }
    );
    builder.addCase(
      externalLogin.rejected,
      (_state: AuthState, action: PayloadAction<any>) => {
        return initialState;
      }
    );
    builder.addCase(
      updateUser.fulfilled,
      (_state: AuthState, action: PayloadAction<AuthState>) => {
        const user = action.payload;
        return user;
      }
    );
    builder.addCase(
      updateUser.rejected,
      (_state: AuthState, action: PayloadAction<any>) => {
        return initialState;
      }
    );
  },
});

const { reducer } = authSlice;

export const { logOut } = authSlice.actions;

export default reducer;
