import React, { useState } from "react";
import { Card, Col } from "react-bootstrap";
import Color from "../constants/colors";

function Lot(props) {
  const [lot, setLot] = useState(props);
  return (
    <Col xs={6} md={6} lg={6} className="mt-3">
      <Card style={{ boxShadow: Color.boxShadow }}>
        <Card.Header
          className="text-center"
          style={{ backgroundColor: Color.cardHead, color: "#fff" }}
        >
          {lot.slotName}
        </Card.Header>
        <Card.Body
          className="h-100 pb-5 text-center d-flex align-items-center justify-content-center"
          style={{
            fontSize: "52px",
            fontWeight: "600",
          }}
        >
          <span
            style={{
              border: "6px solid #000",
              padding: "10px 30px",
              borderRadius: "100%",
              color: "#00000",
              background: `${
                lot.status === "Full"
                  ? Color.backgroundLotFull
                  : Color.backgroundLotEmpty
              }`,
            }}
          >
            P
          </span>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Lot;
