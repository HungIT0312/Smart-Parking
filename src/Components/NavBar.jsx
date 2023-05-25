import React, { useState } from "react";
import { Container, Image, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/iconParking.png";
import "../assets/styles/Nav.scss";
import Color from "../constants/colors";
import "../assets/styles/LeftAlign.scss";
import { logoutManager } from "../api/Manager/LogOut.api";
// import { IconBase } from "react-icons";
import { FiLogOut } from "react-icons/fi";
import { useEffect } from "react";
const NavBar = (props) => {
  const [route, setRoute] = useState(props.route);
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();
  const handleClick = (event) => {
    setActiveLink(event.target.getAttribute("href"));
  };
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
  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

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
  const menu = route;
  const showMenu =
    menu &&
    menu.map((menuItem, index) => {
      return (
        <li
          className={`nav-item  ${menuItem.name === "Log Out" ? "lef" : ""}`}
          key={index}
        >
          <Link
            className={`nav-link ${
              activeLink === "/Client/" + menuItem.name ? "active" : ""
            }`}
            to={menuItem.to}
            onClick={handleClick}
            style={{ color: Color.navParagraph }}
          >
            {menuItem.name}
          </Link>
        </li>
      );
    });
  return (
    <Navbar
      bg={Color.navColor}
      expand="lg"
      style={{
        backgroundColor: Color.navColor,
      }}
      sticky="top"
    >
      <Navbar.Brand href="/Manager/Home">
        <Image
          src={logo}
          width="40"
          height="40"
          className="d-inline-block align-top"
          alt="logo"
          style={{ marginLeft: 20 }}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav responsive-navbar-nav">
        <Nav className="me-auto">{showMenu}</Nav>
        {
          <Nav className="me-2">
            <Nav.Link
              style={{ color: Color.navParagraph }}
              onClick={
                props.role === 0 ? handleLogoutClient : handleLogoutAdmin
              }
            >
              LogOut
              <FiLogOut size={18} className="ms-2"></FiLogOut>
            </Nav.Link>
          </Nav>
        }
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
