import React, { useEffect, useState } from "react";
import { getClientById } from "../../api/Clients.api.js";
import {
  Button,
  Card,
  Col,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Form,
  Image,
} from "react-bootstrap";
import Color from "../../constants/colors.js";
import image from "../../assets/imagePlaceHolder.png";
const License = () => {
  const [Clients, setClients] = useState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://192.168.5.234:8000/ws/test_channel/");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);
  useEffect(() => {
    if (!socket) return;

    socket.onopen = () => {
      console.log("Kết nối WebSocket đã được thiết lập.");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.message);
      event && setClients(data.message);
    };

    socket.onclose = () => {
      console.log("Kết nối WebSocket đã đóng.");
    };

    socket.onerror = (error) => {
      console.log("Lỗi kết nối WebSocket: " + error);
    };

    return () => {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;
    };
  }, [socket]);

  return (
    <Container className="" style={{ color: Color.paragraph }}>
      <Row className="flex-column flex-sm-row ">
        <Col className="col-sm-12 col-md-6 mt-5" xs={12} md={6}>
          <Card
            className="h-100"
            style={{
              boxShadow: Color.cardBoxShadow,
              backgroundColor: Color.cardBackgroundColor,
            }}
          >
            <Card.Header
              className="text-center"
              style={{
                backgroundColor: Color.cardHead,
                color: Color.navParagraph,
              }}
            >
              Vehicle information
            </Card.Header>
            <Card.Body className="p-3 d-flex justify-content-center ">
              <Image src={Clients?.image || image} thumbnail fluid />
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-sm-12 col-md-6 mt-5" xs={12} md={6}>
          <Card className="h-100 " style={{ boxShadow: Color.cardBoxShadow }}>
            <Card.Header
              className="text-center"
              style={{
                backgroundColor: Color.cardHead,
                color: Color.navParagraph,
              }}
            >
              Client information
            </Card.Header>
            <Card.Body className="p-5">
              <Form name="formManage">
                <Form.Group controlId="formBasicEmail">
                  <Row>
                    <Col>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        required
                        value={Clients?.first_name}
                      />
                    </Col>
                    <Col>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        required
                        value={Clients?.last_name}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    value={Clients?.email}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>License Plate</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter license plate"
                    required
                    value={Clients?.license_plate}
                  />
                </Form.Group>

                <FormGroup controlId="formDateJoin">
                  <FormLabel>Date Join</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="address"
                    value={Clients?.date_joined}
                  />
                </FormGroup>

                <div className="d-flex justify-content-center mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    className="align-items-center"
                  >
                    Confirm
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default License;
// "https://cms.luatvietnam.vn/uploaded/Images/Original/2019/01/04/bien-so-xe_0401085240.jpg"
