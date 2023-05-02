import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AuthClient(props) {
  const [token, setToken] = useState(sessionStorage.getItem("tokenClient"));
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/Manager/Login");
      toast.warning("You don't have enough permission to access !");
    }
  }, []);
  return <div>AuthClient</div>;
}
