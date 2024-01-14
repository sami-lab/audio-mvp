import React from "react";
import Sidebar from "@/components/common/sidebar";
import CheckAuth from "@/components/common/checkAuth";
import Account from "./account";
export default function Page() {
  return (
    <CheckAuth>
      <Sidebar>
        <Account />
      </Sidebar>
    </CheckAuth>
  );
}
