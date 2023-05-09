import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import Color from "../../constants/colors";
import { clientRoute } from "../../routes/route";
import AuthClient from "../../helper/AuthClient";
const ClientPage = () => {
  return (
    <AuthClient
      className=""
      style={{
        backgroundColor: Color.backgroundColor,
        minHeight: "100vh",
      }}
    >
      <NavBar role={0} route={clientRoute} />
      <Outlet />
    </AuthClient>
  );
};

export default ClientPage;
