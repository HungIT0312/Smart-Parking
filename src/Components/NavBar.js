import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/iconParking.png";

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
                        className={`nav-link ${activeLink === "/Manager/" + menuItem.name ? "active" : ""}`}
                        to={menuItem.to}
                        onClick={handleClick}
                    >
                        {menuItem.name}
                    </Link>
                </li>
            );
        });
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ borderBottom: "1px solid #ccc" }}>
            <a className="navbar-brand" href="/Manager/Home">
                <img
                    src={logo}
                    width="40"
                    height="40"
                    className="d-inline-block align-top"
                    alt="logo"
                />
            </a>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    {showMenu}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
