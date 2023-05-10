import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Lot from "../../Components/Lot";
import Color from "../../constants/colors";
import { useOutletContext } from "react-router-dom";

const ParkingLots = () => {
  const [Lots, setLots] = useState();
  const data = useOutletContext();
  return (
    <Container className="" style={{ minHeight: "75vh" }}>
      <Row className="   mt-5 h-100" style={{ minHeight: "75vh" }}>
        <Col sm={3} md={6} lg={9}>
          <Card
            className="h-100"
            style={{
              boxShadow: Color.boxShadow,
              backgroundColor: Color.cardBackgroundColor,
            }}
          >
            <Card.Body>
              <Row xs={12} md={12} lg={12} className="h-100">
                {data.Lots &&
                  data?.Lots.map((lot, index) => {
                    return (
                      <Lot
                        key={index}
                        name={`Lot #${index + 1}`}
                        status={lot}
                      ></Lot>
                    );
                  })}
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={3} md={6} lg={3}>
          <Card
            style={{ background: "#fff", boxShadow: Color.boxShadow }}
            className="h-100 "
          >
            <Card.Body className="d-flex flex-column text-center  ">
              <h2>Status</h2>
              <Card
                className="h-50 m-2"
                bg=""
                style={{ background: Color.backgroundLotEmpty }}
              >
                <Card.Body
                  className="d-flex justify-content-center
                align-items-center"
                  style={{ fontSize: "24px", fontWeight: "500" }}
                >
                  Empty
                </Card.Body>
              </Card>
              <Card
                className="h-50 m-2"
                style={{ background: Color.backgroundLotFull }}
              >
                <Card.Body
                  className="d-flex justify-content-center
                align-items-center"
                  style={{ fontSize: "24px", fontWeight: "500" }}
                >
                  Full
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ParkingLots;
//style={{ marginTop: "100px" }}
