import React, { useRef } from "react";
import { useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { getAccountById } from "../../api/Client/Profile";
import { useState } from "react";
import { getTimeLog, updateAccount } from "../../api/Manager/Account.api";
import { useContext } from "react";
import { IdClientContext } from "../../store/client-context/ClientContext";

const Vehicle = (props) => {
  const [client, setClient] = useState({});
  const [vehicle, setVehicle] = useState({});
  const [timeLogs, setTimeLogs] = useState([]);
  const IDCtx = useContext(IdClientContext);
  const [isUpdate, setIsUpdate] = useState(false);
  const [parkingFee, setParkingFee] = useState(0);
  useEffect(() => {
    const id = sessionStorage.getItem("idClient");
    const _getProfile = async () => {
      const res = await getAccountById(id);
      setClient(res.user[0]);
      setVehicle(res.vehicle[0]);
    };
    _getProfile();
    const _getTimeLog = async () => {
      const res = await getTimeLog();
      setTimeLogs(res);
    };
    _getTimeLog();
    // TÍnh phí đỗ xe

    calculateParkingFee();
    const interval = setInterval(() => {
      calculateParkingFee();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  const calculateParkingFee = () => {
    // const currentTime = new Date(); // Thời gian hiện tại
    // // const timeDifference = currentTime.getTime() - time.getTime();
    // const timeDifference = currentTime.getTime() - timeLogs?.time_in.getTime();
    // // const fee = Math.floor(timeDifference) * 1000;
    // const fee = Math.floor(timeDifference / (5 * 60 * 1000)) * 1000;
    // setParkingFee(fee);
  };
  const handleEditClick = (e) => {
    e.preventDefault();
    setIsUpdate((prevState) => !prevState);
    if (isUpdate) {
      try {
        // const _updateClient = async () => {
        //   const res = await updateAccount(client);
        //   setClient(res);
        // };
        // _updateClient();
      } catch (error) {}
    }
  };
  const logVehicle = timeLogs.filter((log) => {
    return log.vehicle === vehicle.license_plate;
  });
  return (
    <Card
      className="m-5"
      style={{
        backgroundColor: "#fffff",
        borderRadius: 8,
        zIndex: 1000,
      }}
    >
      <Card.Title
        className="text-center p-3"
        style={{ fontWeight: 600, textAlign: "center" }}
      >
        License: {logVehicle?.vehicle}
      </Card.Title>
      <Card.Body className="p-3">
        <Form className="p-5">
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label
              column
              className=""
              style={{ fontWeight: 600, textAlign: "center" }}
            >
              Time In:
            </Form.Label>
            <Col xs={8}>
              <Form.Text> {logVehicle?.time_in}</Form.Text>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formHorizontalPassword"
          >
            <Form.Label column style={{ fontWeight: 600, textAlign: "center" }}>
              Date Join:
            </Form.Label>
            <Col xs={8}>
              <Form.Text>{client?.date_joined}</Form.Text>
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formHorizontalPassword"
          >
            <Form.Label column style={{ fontWeight: 600, textAlign: "center" }}>
              Money in Account:
            </Form.Label>
            <Col xs={8}>
              <Form.Text>{client?.parking_fee}</Form.Text>
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formHorizontalPassword"
          >
            <Form.Label column style={{ fontWeight: 600, textAlign: "center" }}>
              Parking Fee:
            </Form.Label>
            <Col xs={8}>
              <Form.Text>{parkingFee}</Form.Text>
            </Col>
          </Form.Group>
          {isUpdate && (
            <Form.Group
              as={Row}
              className="mb-3 pt-3 border-top"
              controlId="formHorizontalPassword"
            >
              <Form.Label
                column
                style={{ fontWeight: 600, textAlign: "center" }}
              >
                Money:
              </Form.Label>
              <Col xs={8}>
                <Form.Control
                  type="number"
                  min={10000}
                  step={5000}
                  defaultValue={5000}
                  placeholder="Your Money in Account"
                  onChange={(e) =>
                    setClient({
                      ...client,
                      parking_fee: (client.parking_fee += e.target.value),
                    })
                  }
                />
              </Col>
            </Form.Group>
          )}
          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }}>
              <Button onClick={handleEditClick}>Recharge</Button>
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Vehicle;
