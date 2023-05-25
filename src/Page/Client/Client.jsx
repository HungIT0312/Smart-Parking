import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import AuthClient from "../../helper/AuthClient";
import { clientRoute } from "../../routes/route";
import { IdClientContext } from "../../store/client-context/ClientContext";
import { URL_SERVER } from "../../utils/path";
const ClientPage = () => {
  const [Clients, setClients] = useState();
  const [Lots, setLots] = useState();
  const [socketParking, setSocketParking] = useState(null);
  const data = {
    Lots: Lots,
  };
  const IDCtx = useContext(IdClientContext);
  useEffect(() => {
    const newSocket = new WebSocket(`ws://${URL_SERVER}/ws/test_channel/`);
    const parkingSocket = new WebSocket(`ws://${URL_SERVER}/ws/slot_channel/`);
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
