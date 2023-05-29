import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Outlet } from "react-router-dom";
import Color from "../../constants/colors";
import Auth from "../../helper/Auth";
import { routeConf } from "../../routes/route";
import { useEffect } from "react";
import { useState } from "react";
import { URL_SERVER } from "../../utils/path";
import SideMenu from "../../Components/SideMenu";
import { Col, Row } from "react-bootstrap";
const Manager = () => {
  const [Clients, setClients] = useState();
  const [Lots, setLots] = useState();
  const [socketClient, setSocketClient] = useState(null);
  const [socketParking, setSocketParking] = useState(null);
  const data = {
    Clients: Clients,
    Lots: Lots,
  };
  useEffect(() => {
    const newSocket = new WebSocket(`ws://${URL_SERVER}/ws/checkin_channel/`);
    const parkingSocket = new WebSocket(`ws://${URL_SERVER}/ws/slot_channel/`);
    setSocketParking(parkingSocket);
    setSocketClient(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);
  useEffect(() => {
    if (!socketClient) return;

    socketClient.onopen = () => {
      console.log("socketClient on Manager is connected !");
    };
    socketParking.onopen = () => {
      console.log("ParkingSocket on Manager is connected !");
    };
    socketClient.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.message);
      event && setClients(data.message);
    };
    socketParking.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.message);
      event && setLots(data.message);
    };

    socketClient.onclose = () => {
      console.log("Kết nối WebSocket đã đóng.");
    };

    socketClient.onerror = (error) => {
      console.log("Lỗi kết nối WebSocket: " + error);
    };

    return () => {
      socketClient.onopen = null;
      socketClient.onmessage = null;
      socketClient.onclose = null;
      socketClient.onerror = null;
    };
  }, [socketClient, socketParking]);

  return (
    <Auth
      style={{
        backgroundColor: Color.backgroundColor,
      }}
    >
      <Row className="h-100 ">
        <Col md={2} className="p-0">
          <SideMenu route={routeConf} />
        </Col>
        <Col className="p-0">
          <Outlet context={data} />
        </Col>
      </Row>
    </Auth>
  );
};

export default Manager;
