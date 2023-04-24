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
} from "react-bootstrap";
import Color from "../../constants/colors.js";
const License = () => {
  const [Clients, setClients] = useState("");
  try {
    useEffect(() => {
      console.log("get");
      const _getLicense = async () => {
        const res = await getClientById("1");
        setClients(res);
      };
      _getLicense();
    }, []);
  } catch (error) {
    console.log(error);
  }
  console.log(Clients);
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
            <Card.Body className="p-3">
              {/* <Card.Title>Vehicle information</Card.Title> */}
              {/* <Card.Img variant="top" src={Clients?.logo} /> */}
              <Card.Img
                variant="top"
                src={
                  Clients?.logo ||
                  "https://cms.luatvietnam.vn/uploaded/Images/Original/2019/01/04/bien-so-xe_0401085240.jpg"
                }
              />
              {/* "https://cms.luatvietnam.vn/uploaded/Images/Original/2019/01/04/bien-so-xe_0401085240.jpg" */}
              <Card.Text>Biển số:{Clients?.LicensePlate}</Card.Text>
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
                <FormGroup controlId="formBasicName">
                  <FormLabel>Name</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="name"
                    value={Clients?.name}
                  />
                </FormGroup>

                <FormGroup controlId="formContact">
                  <FormLabel>Contact</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="phone number"
                    value={Clients?.contact}
                  />
                </FormGroup>

                <FormGroup controlId="formBasicAddress">
                  <FormLabel>Address</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="address"
                    value={Clients?.address}
                  />
                </FormGroup>
                <FormGroup controlId="formLicense">
                  <FormLabel>License</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="License"
                    value={Clients?.LicensePlate}
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
