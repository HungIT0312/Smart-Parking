import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import "../assets/styles/Nav.scss";
import routeConf from "../routes/route.js";

export default function SideMenu() {
  const [routes, setRoutes] = useState(routeConf);
  const showMenu =
    routes &&
    routes.map((route, index) => {
      return (
        <Nav.Item key={index}>
          <Nav.Link to={route.to}>{route.name}</Nav.Link>
        </Nav.Item>
      );
    });
  return <Nav className="flex-column">{showMenu}</Nav>;
}
