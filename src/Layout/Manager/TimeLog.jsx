import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import "../../assets/styles/ButtonRounded.scss";
import { FaInfo, FaPlus } from "react-icons/fa";
import { getTimeLog } from "../../api/Manager/Account.api";
import "../../assets/styles/BoxShadow.scss";

export default function TimeLog() {
  const [timeLogs, setTimeLogs] = useState([]);
  useEffect(() => {
    const _getTimeLog = async () => {
      const res = await getTimeLog();
      setTimeLogs(res);
    };
    _getTimeLog();
  }, []);

  return (
    <Container>
      <Card
        className="mt-5 cardShadow mx-4 overflow-scroll"
        style={{ maxHeight: "90vh" }}
      >
        <Card.Header className="text-center"> </Card.Header>
        <Card.Body>
          <Table striped responsive>
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>ID</th>
                <th>License</th>
                <th>Time In</th>
                <th>Time Out</th>
              </tr>
            </thead>
            <tbody>
              {timeLogs &&
                timeLogs.map((timeLog, index) => {
                  return (
                    <tr className="text-center" key={timeLog.id}>
                      <td className="fw-bold">{++index}</td>
                      <td>{timeLog.id}</td>
                      <td>{timeLog.vehicle}</td>
                      <td>{timeLog.time_in}</td>
                      <td>{timeLog.time_out}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
