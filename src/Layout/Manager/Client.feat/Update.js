import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById, updateClient } from "../../../api/Clients.api";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/styles/BoxShadow.scss";
export default function ClientInfo() {
  const [client, setClient] = useState({});
  const { clientId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const _getClient = async () => {
      const res = await getClientById(clientId);
      setClient(res);
    };
    _getClient();
  }, [clientId]);
  const handleEditClick = () => {
    setIsEditing((prevState) => !prevState);
    if (isEditing) {
      try {
        const _updateClient = async () => {
          const res = await updateClient(clientId, client);
          setClient(res);
          toast.success("Client information updated successfully!");
          console.log(res);
        };
        _updateClient();
      } catch (error) {
        toast.error("An error occurred while updating client information.!");
      }
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center">
      <Col className="my-5" sm={12} md={6}>
        <Row>
          <Card className="cardShadow">
            <Card.Title className="text-black text-center mt-3">
              <h3>Information</h3>
            </Card.Title>
            <Card.Body>
              <Form className="">
                <Form.Group controlId="formName">
                  <Form.Label>ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Client's name"
                    readOnly
                    value={client?.id}
                  />
                </Form.Group>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Client's name"
                    readOnly={!isEditing}
                    value={client?.name}
                    onChange={(e) =>
                      setClient({ ...client, name: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    readOnly={!isEditing}
                    value={client?.address}
                    onChange={(e) =>
                      setClient({ ...client, address: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formLicense">
                  <Form.Label>LicensePlate</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="LicensePlate"
                    readOnly
                    value={client?.LicensePlate}
                  />
                </Form.Group>
                <Form.Group controlId="formContact">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Contact"
                    readOnly={!isEditing}
                    value={client?.contact}
                    onChange={(e) =>
                      setClient({ ...client, contact: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formLogo">
                  <Form.Label>Image</Form.Label>
                </Form.Group>
                <Image
                  width="400"
                  thumbnail
                  fluid
                  src={client?.logo}
                  className="mb-3"
                ></Image>
                <Form.Group
                  className="d-flex justify-content-center"
                  controlId="formLogo"
                >
                  <Button
                    onClick={() => {
                      handleEditClick();
                    }}
                  >
                    {isEditing ? "Submit" : "Edit"}
                  </Button>
                  <Button
                    variant="light"
                    className="ms-2"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
            <ToastContainer position="top-right" />
          </Card>
        </Row>
      </Col>
    </Container>
  );
}
