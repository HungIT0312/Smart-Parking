import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import Color from "../../constants/colors";
const Manager = () => {
  return (
    <div
      className=""
      style={{
        backgroundColor: Color.backgroundColor,
        height: "100vh",
      }}
    >
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Manager;
