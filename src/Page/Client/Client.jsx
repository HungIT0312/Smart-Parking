import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import AuthClient from "../../helper/AuthClient";
import { clientRoute } from "../../routes/route";
import { useState } from "react";
import { useEffect } from "react";
const ClientPage = () => {
  const [Clients, setClients] = useState();
  const [Lots, setLots] = useState();
  const [socketParking, setSocketParking] = useState(null);
  const data = {
    Lots: Lots,
  };
  useEffect(() => {
    const newSocket = new WebSocket("ws://172.20.10.7:8000/ws/test_channel/");
    const parkingSocket = new WebSocket(
      "ws://172.20.10.7:8000/ws/slot_channel/"
    );
    setSocketParking(parkingSocket);

    return () => {
      newSocket.close();
    };
  }, []);
  useEffect(() => {
    if (!socketParking) return;

    socketParking.onopen = () => {
      console.log("socketParking on Manager is connected !");
    };

    socketParking.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.message);
      event && setClients(data.message);
    };
    socketParking.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.message);
      event && setLots(data.message);
    };

    socketParking.onclose = () => {
      console.log("Kết nối WebSocket đã đóng.");
    };

    socketParking.onerror = (error) => {
      console.log("Lỗi kết nối WebSocket: " + error);
    };

    return () => {
      socketParking.onopen = null;
      socketParking.onmessage = null;
      socketParking.onclose = null;
      socketParking.onerror = null;
    };
  }, [socketParking]);
  return (
    <AuthClient>
      <NavBar role={0} route={clientRoute} />
      <Outlet context={data} />
    </AuthClient>
  );
};

export default ClientPage;
