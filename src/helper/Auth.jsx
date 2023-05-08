import React, { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Auth(props) {
  const [token, setToken] = useState(sessionStorage.getItem("tokenAd"));
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/Manager/Login");
      toast.warning("You don't have enough permission to access !");
    }
  });

  return (
    <Container fluid>
      <ToastContainer position="top-right" />
      {props.children}
    </Container>
  );
}
