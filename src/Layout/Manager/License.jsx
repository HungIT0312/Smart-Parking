import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Image,
  Row,
} from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import image from "../../assets/imagePlaceHolder.png";
import Color from "../../constants/colors.js";
import { BsCamera } from "react-icons/bs";
import { GiBarrier } from "react-icons/gi";
import { getCheckAgain, getOpenReq } from "../../api/Manager/Account.api";
import { toast } from "react-toastify";

const License = () => {
  const data = useOutletContext();
  const noti = data.Clients?.notification;
  const resultPlate = data.Clients?.result_detection;
  const resultCheckOut = data.checkOut;
  const [isRegistered, setIsRegistered] = useState(true);

  useEffect(() => {
    if (noti === "Image is not valid") {
      setIsRegistered(true);
    } else if (noti === "This vehicle is not registered") {
      setIsRegistered(false);
    } else {
      setIsRegistered(true);
    }
  });
  useEffect(() => {
    if (resultCheckOut) {
      const check = document.getElementById("checkout");
      check.scrollIntoView({ behavior: "smooth" });
    }
    return () => {};
  }, [resultCheckOut]);

  const handleOpenBarrier = (e) => {
    e.preventDefault();

    const _openBarrier = async (params) => {
      const res = await getOpenReq(params);
      setIsRegistered(true);
    };

    if (data.Clients.result_detection === "") {
      return;
    } else {
      const params = {
        image: data.Clients.image,
        license_plate: data.Clients.result_detection,
      };
      console.log(params);
      _openBarrier(params);
    }
  };

  const captureHandler = (e) => {
    e.preventDefault();

    const _capture = async (params) => {
      const res = await getCheckAgain(params);
    };

    _capture(resultPlate);
  };

  return (
    <Container style={{ color: Color.paragraph, maxHeight: "100vh" }}>
      <Row style={{ height: "100vh" }}>
        <Card
          style={{
            backgroundColor: Color.cardBackgroundColor,
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
        >
          <Card.Header
            className="text-center"
            style={{
              backgroundColor: Color.cardHead,
              color: Color.navParagraph,
            }}
          >
            CheckIn information
          </Card.Header>
          <Card.Body className="p-3">
            <Row>
              <Col
                xs={12}
                md={6}
                className="d-flex flex-column align-items-center justify-content-center"
              >
                <p>
                  License plate:{" "}
                  {data.Clients?.result_detection || noti || "None"}
                </p>
                <Image src={data?.Clients?.image || image} thumbnail fluid />
                <Button
                  className="mt-2 d-flex align-items-center justify-content-center btn-info"
                  onClick={captureHandler}
                  style={{ color: "#0677AC" }}
                >
                  <BsCamera size={24} color="#0677AC" className="me-2" />
                  Capture
                </Button>
              </Col>
              <Col
                xs={12}
                md={6}
                className="d-flex flex-column justify-content-center"
              >
                <Form name="formManage">
                  <Row>
                    <Col>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          readOnly
                          type="text"
                          placeholder="Enter first name"
                          required
                          value={data?.Clients?.first_name || ""}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          readOnly
                          type="text"
                          placeholder="Enter last name"
                          required
                          value={data?.Clients?.last_name || ""}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      readOnly
                      type="text"
                      placeholder="Email"
                      value={data?.Clients?.email || ""}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>License Plate</Form.Label>
                    <Form.Control
                      readOnly
                      type="text"
                      placeholder="Enter license plate"
                      required
                      value={data?.Clients?.license_plate || ""}
                    />
                  </Form.Group>
                  <FormGroup controlId="formDateJoin">
                    <FormLabel>Date Join</FormLabel>
                    <FormControl
                      readOnly
                      type="text"
                      placeholder="address"
                      value={data?.Clients?.date_joined || ""}
                    />
                  </FormGroup>
                  <div className="d-flex justify-content-center mt-3">
                    <Button
                      variant="primary"
                      className="align-items-center"
                      disabled={isRegistered ? true : false}
                      onClick={handleOpenBarrier}
                    >
                      <GiBarrier size={20} className="me-2" />
                      Open
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
      <Row style={{ height: "100vh" }} id="checkout">
        <Card
          style={{
            backgroundColor: Color.cardBackgroundColor,
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
        >
          <Card.Header
            className="text-center"
            style={{
              backgroundColor: Color.cardHead,
              color: Color.navParagraph,
            }}
          >
            CheckOut information
          </Card.Header>
          <Card.Body className="p-3">
            <Row>
              <Col
                xs={12}
                md={6}
                className="d-flex flex-column align-items-center justify-content-center"
              >
                <p>
                  Notice: {resultCheckOut?.result_detection || noti || "None"}
                </p>
                <Image src={resultCheckOut?.image || image} thumbnail fluid />
              </Col>
              <Col xs={12} md={6} className="d-flex flex-column">
                <Form name="formManage">
                  <Row>
                    <Col>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          readOnly
                          type="text"
                          placeholder="Enter first name"
                          required
                          value={resultCheckOut?.first_name || ""}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          readOnly
                          type="text"
                          placeholder="Enter last name"
                          required
                          value={resultCheckOut?.last_name || ""}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      readOnly
                      type="text"
                      placeholder="Email"
                      value={resultCheckOut?.email || ""}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>License Plate</Form.Label>
                    <Form.Control
                      readOnly
                      type="text"
                      placeholder="Enter license plate"
                      required
                      value={resultCheckOut?.license_plate || ""}
                    />
                  </Form.Group>
                  <FormGroup controlId="formDateJoin">
                    <FormLabel>Date Join</FormLabel>
                    <FormControl
                      readOnly
                      type="text"
                      placeholder="address"
                      value={resultCheckOut?.date_joined || ""}
                    />
                  </FormGroup>
                  {/* <div className="d-flex justify-content-center mt-3">
                    <Button
                      variant="primary"
                      className="align-items-center"
                      disabled={isRegistered ? true : false}
                      onClick={handleOpenBarrier}
                    >
                      <GiBarrier size={20} className="me-2" />
                      Open
                    </Button>
                  </div> */}
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default License;
