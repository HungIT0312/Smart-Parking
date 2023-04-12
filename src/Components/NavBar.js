import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/iconParking.png";
import Color from "../constants/colors";
import { Image, Nav, Navbar } from "react-bootstrap";

const NavBar = () => {
  const [activeLink, setActiveLink] = useState("");

  const handleClick = (event) => {
    setActiveLink(event.target.getAttribute("href"));
  };
  const menu = [
    {
      name: "License",
      to: "/Manager/License",
    },
    {
      name: "Parking",
      to: "/Manager/Parking",
    },
    {
      name: "Client",
      to: "/Manager/Client",
    },
    {
      name: "TimeLog",
      to: "/Manager/TimeLog",
    },
  ];
  const showMenu =
    menu &&
    menu.map((menuItem, index) => {
      return (
        <li className="nav-item" key={index}>
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
        boxShadow: Color.boxShadow,
        backgroundColor: Color.navColor,
      }}
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
      <Navbar.Collapse id="navbarNav">
        <Nav className="mr-auto">{showMenu}</Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
