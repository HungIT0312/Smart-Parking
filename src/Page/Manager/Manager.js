import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import Color from "../../constants/colors";
const Manager = () => {
  return (
    <div
      className=""
      style={{
        backgroundColor: Color.backgroundColor,
        minHeight: "100vh",
      }}
    >
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Manager;
