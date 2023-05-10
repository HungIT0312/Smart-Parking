import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AuthClient(props) {
  const [token, setToken] = useState(sessionStorage.getItem("tokenClient"));
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      // navigate("/Client/Login/");
      toast.warning("Please login first!", { autoClose: 1000 });
    }
  }, []);
  return (
    <Container fluid style={{ padding: 0 }}>
      {props.children}
    </Container>
  );
}
