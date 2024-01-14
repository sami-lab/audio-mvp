"use client";
import React from "react";
import ReduxPersistProvider from "@/redux/redux-persist-provider";

export default function Main({ children }: { children: React.ReactNode }) {
  return <ReduxPersistProvider>{children}</ReduxPersistProvider>;
}
