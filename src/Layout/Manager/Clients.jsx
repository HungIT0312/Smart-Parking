import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";

import { deleteAccount, getAccountById, getAllAcount } from "../../api/Manager/Account.api";
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
      const res = await getAllAcount();
      setClients(res);
    };
    _getClients();
  }, []);
  const handleDelete = async (clientId) => {
    try {
      let ids = {
        "ids" :[clientId],
      }
      
      console.log(ids);
      await deleteAccount(ids);
      const newClients = clients.filter((client) => client.id !== clientId);
      setClients(newClients);
      toast.success("Delete client successfully !", { autoClose: 2000 });
    } catch (error) {
      console.log(error);
    }
  };
  const handleInfor = (clientId) => {
    navigate(`/Manager/Clients/${clientId}`);
  };
  return (
    <Container>
      <Col>
        <Row xs={12}>
          <Card className=" mt-5 cardShadow">
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
                          <td className="d-sm-table-cell">
                            {client.last_name}
                          </td>
                          <td className="d-sm-table-cell">{client.email}</td>
                          <td className="d-sm-table-cell">
                            {client.date_joined}
                          </td>
                          <td className="d-sm-table-cell">
                            {client.parking_fee}
                          </td>
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
