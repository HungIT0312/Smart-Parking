import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import Color from "../../constants/colors";
import Authenticate from "../../Components/Auth";
import { clientRoute } from "../../routes/route";
const ClientPage = () => {
  return (
    <div
      className=""
      style={{
        backgroundColor: Color.backgroundColor,
        minHeight: "100vh",
      }}
    >
      <NavBar route={clientRoute} />
      <Outlet />
    </div>
  );
};

export default ClientPage;
