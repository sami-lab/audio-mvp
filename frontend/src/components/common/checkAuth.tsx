"use client";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/";
import { useRouter } from "next/navigation";

export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (!auth.jwt) {
      router.push(`/login`);
    }
  }, [auth]);

  if (auth.jwt) {
    return children;
  }
  return (
    <div style={{ fontSize: "58px", textAlign: "center", marginTop: "50px" }}>
      Authorizing
    </div>
  );
}
