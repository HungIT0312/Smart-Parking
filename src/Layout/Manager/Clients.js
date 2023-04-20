import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { deleteClientsById, getClient } from "../../api/Clients.api";
import "../../assets/styles/ButtonRounded.scss";
import { FaInfo, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import "../../assets/styles/BoxShadow.scss";
import { toast, ToastContainer } from "react-toastify";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const _getClients = async () => {
      const res = await getClient();
      setClients(res);
    };
    _getClients();
  }, []);
  const handleDelete = async (clientId) => {
    toast.success("Delete client successfully !");
    console.log(clientId);
    try {
      await deleteClientsById(clientId);
      const newClients = clients.filter((client) => client.id !== clientId);
      setClients(newClients);
    } catch (error) {
      console.log(error);
    }
  };
  const handleInfor = (clientId) => {
    console.log(clientId);
    navigate(`/Manager/Clients/${clientId}`);
  };
  return (
    <Container>
      <Col className="h-100">
        <Row className="h-100" xs={12}>
          <Card className="h-100 mt-5 cardShadow">
            <Card.Header className="text-center"> </Card.Header>
            <Card.Body>
              <Table striped responsive sm={12}>
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
                          <td className="fw-bold">{++index}</td>
                          <td>{client.name}</td>
                          <td className="d-sm-table-cell">{client.address}</td>
                          <td className="d-sm-table-cell">
                            {client.LicensePlate}
                          </td>
                          <td className="d-sm-table-cell">{client.contact}</td>
                          <td className="d-sm-table-cell d-flex">
                            <Button
                              value={client.id}
                              onClick={() => {
                                handleInfor(client.id);
                              }}
                            >
                              <FaInfo />
                            </Button>
                            <Button
                              variant="danger"
                              className="ms-1"
                              value={client.id}
                              onClick={() => {
                                handleDelete(client.id);
                              }}
                            >
                              <FaTrashAlt />
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
        <Button
          className="btnCss"
          xs={3}
          md={3}
          onClick={() => navigate("/Manager/Clients/new")}
        >
          <FaPlus />
        </Button>
        <ToastContainer position="bottom-left" />
      </Col>
      <Outlet context={[clients, setClients]} />
    </Container>
  );
}
