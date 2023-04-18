import React, { useState } from "react";
import { useEffect } from "react";
import { getLots } from "../../api/Lots.api";
import Lot from "../../Components/Lot";
import { Card, Col, Container, Row } from "react-bootstrap";
import Color from "../../constants/colors";

const ParkingLots = () => {
  const [Lots, setLots] = useState();
  try {
    useEffect(() => {
      const _getParkigLot = async () => {
        const res = await getLots();
        setLots(res);
      };
      _getParkigLot();
    }, []);
  } catch (error) {
    console.log(error);
  }

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
                {Lots &&
                  Lots.map((lot, index) => {
                    return (
                      <Lot slotName={lot.slotName} status={lot.status}></Lot>
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
