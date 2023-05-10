import React, { useState } from "react";
import { Container, Image, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/iconParking.png";
import "../assets/styles/Nav.scss";
import Color from "../constants/colors";
import "../assets/styles/LeftAlign.scss";
const NavBar = (props) => {
  const [route, setRoute] = useState(props.route);
  const [activeLink, setActiveLink] = useState("");

  const handleClick = (event) => {
    setActiveLink(event.target.getAttribute("href"));
  };
  const handleLogout = (event) => {
    event.preventDefault();
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
              activeLink === "/Manager/" + menuItem.name ? "active" : ""
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
        {props.role === 0 && (
          <Nav className="me-2">
            <Nav.Link
              style={{ color: Color.navParagraph }}
              onClick={handleLogout}
            >
              Logout
            </Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
