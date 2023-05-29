import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Color from "../constants/colors";

export default function AuthClient(props) {
  const [token, setToken] = useState(sessionStorage.getItem("tokenAdmin"));
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/Client/Login/");
      toast.warning("Please login first!", { autoClose: 1000 });
    }
  }, []);
  return (
    <Container fluid style={{ padding: 0, background: Color.backgroundColor }}>
      {props.children}
    </Container>
  );
}
