import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import AuthClient from "../../helper/AuthClient";
import { clientRoute } from "../../routes/route";
const ClientPage = () => {
  return (
    <AuthClient>
      <NavBar role={0} route={clientRoute} />
      <Outlet />
    </AuthClient>
  );
};

export default ClientPage;
