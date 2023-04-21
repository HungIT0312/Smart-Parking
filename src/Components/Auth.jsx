import React from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";

export default function Authenticate(props) {
  const [role, setRole] = useState(props.role);

  return <Container>{props.children}</Container>;
}
