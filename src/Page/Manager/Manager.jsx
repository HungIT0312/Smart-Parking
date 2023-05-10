import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import Color from "../../constants/colors";
import Auth from "../../helper/Auth";
import { routeConf } from "../../routes/route";
import { useEffect } from "react";
import { useState } from "react";
const Manager = () => {
  const [Clients, setClients] = useState();
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = new WebSocket("ws://192.168.5.147:8000/ws/test_channel/");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);
  useEffect(() => {
    if (!socket) return;

    socket.onopen = () => {
      console.log("Socket on Manager is connected !");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.message);
      event && setClients(data.message);
    };

    socket.onclose = () => {
      console.log("Kết nối WebSocket đã đóng.");
    };

    socket.onerror = (error) => {
      console.log("Lỗi kết nối WebSocket: " + error);
    };

    return () => {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;
    };
  }, [socket]);
  return (
    <Auth
      className=""
      style={{
        backgroundColor: Color.backgroundColor,
        minHeight: "100vh",
      }}
    >
      <NavBar route={routeConf} />
      <Outlet context={Clients} />
    </Auth>
  );
};

export default Manager;
