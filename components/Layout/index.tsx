import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import MobileHeader from "../Header/MobileHeader";
import Header from "../Header/index";
import Sidebar from "../Sidebar/Sidebar";
import Router, { useRouter } from "next/router";
import { getAuthToken } from "../../helpers/authHelper";

const Layout = React.forwardRef(
  ({ children }: { children: React.ReactNode }, ref) => {
    const router = useRouter();
    // useEffect(() => {
    //   (async () => {
    //     await getAuthToken().then((res :any) => {
    //       if(!JSON.parse(res))
    //       {
    //         //router.push('/login');
    //       }
    //     })
    //   })();
    // }, []);

    return (
      <>
        <MobileHeader key="MobileHeader" />
        <Sidebar key="Sidebar" open={true} />
        <Header key="Header" />
        <div className="pc-container">
          <div className="pcoded-content">{children}</div>
        </div>
      </>
    );
  }
);
export default Layout;
