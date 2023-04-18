import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { deleteClientsById, getClient } from "../../api/Clients.api";
import "../../assets/styles/ButtonRounded.scss";
import { FaInfo, FaPlus, FaTrashAlt } from "react-icons/fa";
export default function Clients() {
  const [clients, setClients] = useState([]);
  useEffect(() => {
    const _getClients = async () => {
      const res = await getClient();
      setClients(res);
    };
    _getClients();
  }, []);
  const handleDelete = (clientId) => {
    console.log(clientId);
    // try {
    //   await deleteClientsById(clientId);
    //   const newClients = clients.filter((client) => client.id !== clientId);
    //   setClients(newClients);
    // } catch (error) {
    //   console.log(error);
    // }
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
                    <th>Name</th>
                    <th>Address</th>
                    <th>LicensePlate</th>
                    <th>Contact</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {clients &&
                    clients.map((client, index) => {
                      return (
                        <tr className="text-center" key={client.id}>
                          <td>{++index}</td>
                          <td>{client.name}</td>
                          <td>{client.LicensePlate}</td>
                          <td>{client.address}</td>
                          <td>{client.contact}</td>
                          <td>
                            <Button value={client.id}>
                              <FaInfo></FaInfo>
                            </Button>
                            <Button
                              variant="danger"
                              className="ms-1"
                              value={client.id}
                              onClick={(e) => {
                                handleDelete(e.target.value);
                              }}
                            >
                              <FaTrashAlt></FaTrashAlt>
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
