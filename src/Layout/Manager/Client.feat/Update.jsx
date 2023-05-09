import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateAccount , getAccount} from "../../../api/Manager/Account.api";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  // Image,
  Row,
} from "react-bootstrap";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/styles/BoxShadow.scss";
export default function ClientInfo() {
  const [client, setClient] = useState({});
  const [vehicle, setVehicle] = useState({});
  const { clientId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const _getClient = async () => {
      const res = await getAccount(clientId);
      console.log(res.user[0]);
      setClient(res.user[0]);
      setVehicle(res.vehicle[0]);
    };
    _getClient();

  }, []);
  const handleEditClick = () => {
    setIsEditing((prevState) => !prevState);
    if (isEditing) {
      try {
        const _updateClient = async () => {
          console.log(client);
          const res = await updateAccount( client);
          setClient(res);
          toast.success("Client information updated successfully!");
          navigate(-1)
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
                    readOnly
                    value={client.id}
                  />
                </Form.Group>
                <Form.Group controlId="formName">
                 <Row>

                 
                    <Col>
                    <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Client's first name"
                    readOnly={!isEditing}
                    value={client.first_name}
                    onChange={(e) =>
                      setClient({ ...client, first_name: e.target.value })
                    }
                  />
                    </Col>
                    <Col>
                    <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Client's last name"
                    readOnly={!isEditing}
                    value={client.last_name}
                    onChange={(e) =>
                      setClient({ ...client, last_name: e.target.value })
                    }
                  />
                  </Col>
                 </Row>
                </Form.Group>

                <Form.Group controlId="formAddress">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Client's email"
                    readOnly
                    value={client.email}
                    onChange={(e) =>
                      setClient({ ...client, email: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formLicense">
                  <Form.Label>Date Joined</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Client's date joined"
                    readOnly
                    value={client?.date_joined}
                  />
                </Form.Group>
                <Form.Group controlId="formContact">
                  <Form.Label>License Plate</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="License Plate"
                    readOnly
                    value={vehicle?.license_plate}
                    onChange={(e) =>
                      setClient({ ...client, contact: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formContact">
                  <Form.Label>Parking Fee</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Parking Fee"
                    readOnly
                    value={client?.parking_fee}
                    onChange={(e) =>
                      setClient({ ...client, contact: e.target.value })
                    }
                  />
                </Form.Group>
                
                <Form.Group
                  className="d-flex justify-content-center"
                  controlId="formLogo"
                >
                  <Button
                  className="mt-3"
                    onClick={() => {
                      handleEditClick();
                    }}
                    
                  >
                    {isEditing ? "Submit" : "Edit"}
                  </Button>
                  <Button
                    variant="danger"
                    className="mt-3 mx-2"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
            {/* <ToastContainer position="top-right" /> */}
          </Card>
        </Row>
      </Col>
    </Container>
  );
}