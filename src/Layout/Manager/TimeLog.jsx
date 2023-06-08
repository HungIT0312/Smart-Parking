import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { getTimeLog } from "../../api/Manager/Account.api";
import "../../assets/styles/BoxShadow.scss";
import "../../assets/styles/ButtonRounded.scss";
import { AiOutlineCar } from "react-icons/ai";
import { FaRegMoneyBillAlt } from "react-icons/fa";
export default function TimeLog() {
  const [timeLogs, setTimeLogs] = useState([]);
  const [filterKey, setFilterKey] = useState("");
  const [totalDay, setTotalDay] = useState(0);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const _getTimeLog = async () => {
      const res = await getTimeLog();
      setTimeLogs(res);
    };
    _getTimeLog();
  }, []);
  const selectFilterHandler = (e) => {
    e.preventDefault();
    const key = e.target.value;
    setFilterKey(key);
  };
  const filterLogs = timeLogs.filter((log) => {
    const date = new Date(log.time_in);
    if (filterKey === "day") {
      const today = new Date();
      return date.getDate() === today.getDate();
    } else if (filterKey === "month") {
      const month = new Date();
      return date.getMonth() === month.getMonth();
    } else return true;
  });
  const fee = filterLogs.reduce((prev, crr) => {
    return prev + crr.parking_fee;
  }, 0);
  const feeToday = timeLogs
    .filter((log) => {
      const date = new Date(log.time_in);
      const today = new Date();
      return date.getDate() === today.getDate();
    })
    .reduce((prev, crr) => {
      return prev + crr.parking_fee;
    }, 0);
  return (
    <Container>
      <Row className="mx-4 mt-5">
        <Col sm={4}>
          <Card className="">
            <Card.Header className="d-flex align-items-center">
              <AiOutlineCar size={20} className="me-2" />
              <span>Total car:</span>
            </Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Card.Text className="d-flex justify-content-center align-items-center">
                <h2>{filterLogs.length}</h2>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={4}>
          <Card>
            <Card.Header className="d-flex align-items-center">
              <FaRegMoneyBillAlt size={24} className="me-2" />
              <span>Total:</span>
            </Card.Header>
            <Card.Body>
              <Card.Text className="d-flex justify-content-end">
                <h2>{fee} đ</h2>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
          <Card>
            <Card.Header className="d-flex align-items-center bg-primary ">
              <FaRegMoneyBillAlt size={24} color="#00f700" className="me-2" />
              <span className="text-white">Total today:</span>
            </Card.Header>
            <Card.Body>
              <Card.Text className="d-flex justify-content-end">
                <h2>{feeToday} đ</h2>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mx-4">
        <Card className="mt-3 cardShadow " style={{ maxHeight: "70vh" }}>
          <Card.Header className="bg-white">
            <Col sm={2}>
              <Form.Select
                size="sm"
                aria-label="select one"
                onChange={selectFilterHandler}
              >
                <option value="" selected>
                  All
                </option>
                <option value="day">Today</option>
                <option value="month">Month</option>
              </Form.Select>
            </Col>
          </Card.Header>
          <Card.Body className=" overflow-scroll">
            <Table striped responsive>
              <thead>
                <tr className="text-center">
                  <th>#</th>
                  <th>ID</th>
                  <th>License</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Fee</th>
                </tr>
              </thead>
              <tbody>
                {filterLogs &&
                  filterLogs.map((timeLog, index) => {
                    return (
                      <tr className="text-center" key={timeLog.id}>
                        <td className="fw-bold">{++index}</td>
                        <td>{timeLog.id}</td>
                        <td>{timeLog.vehicle}</td>
                        <td>{timeLog.time_in}</td>
                        <td>{timeLog.time_out}</td>
                        <td>{timeLog.parking_fee}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}
