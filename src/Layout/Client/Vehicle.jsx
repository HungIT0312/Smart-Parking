import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { getAccountById } from "../../api/Client/Profile";
import { getTimeLog, updateAccount } from "../../api/Manager/Account.api";
import { IdClientContext } from "../../store/client-context/ClientContext";

const Vehicle = (props) => {
  const [client, setClient] = useState({});
  const [vehicle, setVehicle] = useState({});
  const [timeLogs, setTimeLogs] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [parkingFee, setParkingFee] = useState(0);
  const [moneyAdded, setMoneyAdded] = useState(0);
  const [messAlert, setMessAlert] = useState("Vui lòng nhập số tiền cần nạp");
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
    if (logVehicle.time_in) {
      calculateParkingFee();
      const interval = setInterval(() => {
        calculateParkingFee();
      }, 10000);
    }
  }, []);
  const calculateParkingFee = () => {
    const currentTime = new Date(); // Thời gian hiện tại
    const timeIn = new Date(timeLogs.time_in);
    console.log(timeIn);
    const timeParked =
      Math.floor(currentTime.getTime() - timeIn.getTime()) / (24 * 60 * 60);
    if (timeParked < 1) {
      setParkingFee(10000);
    } else {
      const fee = timeParked * 10000;
      setParkingFee(fee);
    }
  };
  const handleEditClick = (e) => {
    e.preventDefault();
    setIsUpdate((prevState) => !prevState);
    if (isUpdate && !messAlert) {
      try {
        const _updateClient = async () => {
          const res = await updateAccount({
            ...client,
            balance: moneyAdded,
          });
          setClient(res);
        };
        _updateClient();
      } catch (error) {}
    }
  };

  const handleAddMoney = (e) => {
    const prevMoney = parseInt(client?.balance);
    const money = parseInt(e.target.value);
    if (money >= 5000 && money % 1000 === 0) {
      setMoneyAdded("" + (prevMoney + money));
      setMessAlert(null);
    } else {
      setMessAlert("Vui lòng nhập đúng số tiền cần nạp!");
      return;
    }
  };
  const logVehicle = timeLogs.filter((log) => {
    return log.vehicle === vehicle.license_plate;
  });
  const time = new Date(client.date_joined);
  return (
    <Card
      className="m-5"
      style={{
        backgroundColor: "#fffff",
        borderRadius: 8,
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
              <Form.Text> {logVehicle?.time_in || "none"}</Form.Text>
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
              <Form.Text>{time.toString()}</Form.Text>
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
              <Form.Text>{client?.balance}</Form.Text>
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
                  min={0}
                  step={5000}
                  defaultValue={0}
                  placeholder="Your Money in Account"
                  onChange={handleAddMoney}
                />
                <Form.Text style={{ color: "#ff3838", marginLeft: 12 }}>
                  {messAlert}
                </Form.Text>
              </Col>
            </Form.Group>
          )}
          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 5, offset: 5 }}>
              {isUpdate ? (
                <>
                  <Button
                    variant="success"
                    onClick={handleEditClick}
                    disabled={messAlert ? true : false}
                    className="me-2"
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="light"
                    onClick={() => setIsUpdate((prevState) => !prevState)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsUpdate((prevState) => !prevState)}>
                  Recharge
                </Button>
              )}
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Vehicle;
