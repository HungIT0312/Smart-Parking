import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import Color from "../../constants/colors";
import { clientRoute, routeConf } from "../../routes/route";
import Auth from "../../helper/Auth";
const Manager = () => {
  return (
    <Auth
      className=""
      style={{
        backgroundColor: Color.backgroundColor,
        minHeight: "100vh",
      }}
    >
      <NavBar route={routeConf} />
      <Outlet />
    </Auth>
  );
};

export default Manager;
