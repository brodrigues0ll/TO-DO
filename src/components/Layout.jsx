import React from "react";
import { Navbar } from "./Navbar";
import { Bottom } from "./Bottom";

export const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Bottom />
    </>
  );
};
