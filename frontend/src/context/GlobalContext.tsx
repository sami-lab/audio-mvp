"use client";
import React, { createContext, useReducer } from "react";

import * as actionTypes from "./actions";
import reducer from "./reducer";

interface AppState {
  user: AuthState | null;
  setAuth: (user: AuthState) => void;
}
const initialState: AppState = {
  user: null,
  setAuth: () => {}, // Placeholder function, will be overridden by the actual implementation
};
export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  function setAuth(user: AuthState) {
    dispatch({
      type: actionTypes.SET_USER,
      payload: user,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        user: state.user,
        setAuth,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
