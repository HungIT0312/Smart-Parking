import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";

import {deleteAccount , getAccountById}  from "../../api/Manager/Account.api";
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
      const res = await getAccountById();
      setClients(res);
    };
    _getClients();
  }, []);
  const handleDelete = async (clientId) => {
    toast.success("Delete client successfully !", { autoClose: 100 });
    console.log(clientId);
    try {
      await deleteAccount(clientId);
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
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Date Joined</th>
                    <th>Parking Fee</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {clients &&
                    clients.map((client, index) => {
                      return (
                        <tr className="text-center" key={client.id}>
                          <td>{client.id}</td>
                          <td>{client.first_name}</td>
                          <td className="d-sm-table-cell">{client.last_name}</td>
                          <td className="d-sm-table-cell">
                            {client.email}
                          </td>
                          <td className="d-sm-table-cell">{client.date_joined}</td>
                          <td className="d-sm-table-cell">{client.parking_fee}</td>
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
        <ToastContainer position="bottom-left" autoClose={1000} />
      </Col>
      <Outlet context={[clients, setClients]} />
    </Container>
  );
}
