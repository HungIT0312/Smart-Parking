import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import "../../assets/styles/ButtonRounded.scss";
import { FaInfo, FaPlus, FaTrashAlt } from "react-icons/fa";
import { getTimeLog } from "../../api/TimeLog.api";
export default function TimeLog() {
  const [timeLogs, setTimeLogs] = useState([]);
  useEffect(() => {
    const _getTimeLog = async () => {
      const res = await getTimeLog();
      setTimeLogs(res);
    };
    _getTimeLog();
  }, []);
  const handleDelete = (clientId) => {
    console.log(clientId);
  };
  return (
    <Container>
      <Col className="h-100">
        <Row className="h-100">
          <Card className="h-100 mt-5">
            <Card.Header className="text-center"> </Card.Header>
            <Card.Body>
              <Table striped>
                <thead>
                  <tr className="text-center">
                    <th>#</th>
                    <th>ID</th>
                    <th>License</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {timeLogs &&
                    timeLogs.map((timeLog, index) => {
                      return (
                        <tr className="text-center" key={timeLog.id}>
                          <td>{++index}</td>
                          <td>{timeLog.id}</td>
                          <td>{timeLog.LicensePlate}</td>
                          <td>{timeLog.TimeIn}</td>
                          <td>{timeLog.TimeOut}</td>
                          <td>
                            <Button
                              value={timeLog.id}
                              className="ms-1"
                              onClick={(e) => {
                                handleDelete(e.target.value);
                              }}
                            >
                              <FaInfo></FaInfo>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Row>
        <Button className="btnCss" xs={3} md={3}>
          <FaPlus />
        </Button>
      </Col>
    </Container>
  );
}
