import React from "react";
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
import { useState } from "react";
const License = () => {
  const data = useOutletContext();
  return (
    <Container className="" style={{ color: Color.paragraph }}>
      <Row className="flex-column flex-sm-row ">
        <Col className="col-sm-12 col-md-6 mt-5" xs={12} md={6}>
          <Card
            className="h-100"
            style={{
              backgroundColor: Color.cardBackgroundColor,
              boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
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
              <Image src={data?.Clients?.image || image} thumbnail fluid />
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-sm-12 col-md-6 mt-5 " xs={12} md={6}>
          <Card
            className="h-100 me-3"
            style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
          >
            <Card.Header
              className="text-center"
              style={{
                backgroundColor: Color.cardHead,
                color: Color.navParagraph,
              }}
            >
              Client information
            </Card.Header>
            <Card.Body className="py-5">
              <Form name="formManage">
                <Form.Group controlId="formBasicEmail">
                  <Row>
                    <Col>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        readOnly
                        type="text"
                        placeholder="Enter first name"
                        required
                        value={data?.Clients?.first_name}
                      />
                    </Col>
                    <Col>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        readOnly
                        type="text"
                        placeholder="Enter last name"
                        required
                        value={data?.Clients?.last_name}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    readOnly
                    type="text"
                    placeholder="Email"
                    value={data?.Clients?.email}
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
                    value={data?.Clients?.license_plate}
                  />
                </Form.Group>

                <FormGroup controlId="formDateJoin">
                  <FormLabel>Date Join</FormLabel>
                  <FormControl
                    readOnly
                    type="text"
                    placeholder="address"
                    value={data?.Clients?.date_joined}
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
