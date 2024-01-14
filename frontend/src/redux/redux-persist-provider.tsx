"use client";

import store from "@/redux/store";
import { CircularProgress, Grid } from "@mui/material";
import React, { useState } from "react";
import { Provider } from "react-redux";
//import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export default function ReduxPersistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const persistor = persistStore(store);
  persistor.subscribe(() => {
    // This callback will be called whenever rehydration is complete
    if (persistor.getState().bootstrapped) {
      console.log("Store has been persisted.");
      setLoading(false);
    } else {
      console.log("Store is being hydrated.");
    }
  });

  if (loading) {
    return (
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        sx={{ minHeight: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <Provider store={store}>
      {/* <PersistGate persistor={persistor}>*/}
      {children}
      {/* </PersistGate>  */}
    </Provider>
  );
}
