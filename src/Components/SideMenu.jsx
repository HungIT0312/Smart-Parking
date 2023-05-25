import React, { useState } from "react";
import { Image, Nav, Navbar } from "react-bootstrap";
import "../assets/styles/Nav.scss";
import { Link, useNavigate } from "react-router-dom";
import "./SideMenu.css";
import Color from "../constants/colors";
import { logoutManager } from "../api/Manager/LogOut.api";
import { FiLogOut } from "react-icons/fi";
import { useEffect } from "react";
import logo from "../assets/iconParking.png";

export default function SideMenu(props) {
  const [routes, setRoutes] = useState(props.route);
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();
  const handleClick = (event) => {
    const href = event.currentTarget.getAttribute("href");
    setActiveLink(href);
  };
  useEffect(() => {
    setActiveLink(window.location.pathname);
    return () => {};
  }, []);

  const handleLogoutClient = (event) => {
    const _LogOut = async () => {
      const res = await logoutManager();
      if (res) {
        sessionStorage.removeItem("tokenAdmin");
        navigate("/Client/Login");
      }
    };
    _LogOut();
  };
  const handleLogoutAdmin = (event) => {
    event.preventDefault();
    const _LogOut = async () => {
      const res = await logoutManager();
      if (res) {
        sessionStorage.removeItem("tokenAdmin");
        navigate("/Manager/Login");
      }
    };
    _LogOut();
  };
  const showMenu =
    routes &&
    routes.map((route, index) => {
      return (
        <Nav.Item key={index} className=" d-block nav__item ms-3  ">
          <Link
            to={route.to}
            onClick={handleClick}
            className={`d-flex align-items-center  ms-3 text-decoration-none py-2 ${
              activeLink === "/Manager/" + route.name ? "active_link" : ""
            }`}
          >
            <div className="me-1 w-25 item__icon">{route.icon}</div>
            <div className="item__name">{route.name}</div>
          </Link>
        </Nav.Item>
      );
    });
  return (
    <Nav className="flex-column bg-dark h-100 ">
      <Navbar.Brand
        href="/Manager/Home"
        className="d-flex justify-content-center mt-2"
      >
        <Image src={logo} width="60" height="60" alt="logo" />
      </Navbar.Brand>
      <Nav className="d-block mt-4 ">
        <p className="nav__header">MANAGEMENT</p>

        {showMenu}
      </Nav>
      <Nav className="mt-auto  border-top d-flex align-items-center justify-content-center">
        <Nav.Link
          style={{ color: Color.navParagraph }}
          onClick={props.role === 0 ? handleLogoutClient : handleLogoutAdmin}
        >
          <FiLogOut size={24} className="me-3"></FiLogOut>
          LogOut
        </Nav.Link>
      </Nav>
    </Nav>
  );
}
