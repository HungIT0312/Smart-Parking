import { useState } from "react";
import Toast from "react-bootstrap/Toast";

function ToastMessage(props) {
  const [mess, setMess] = useState(props);
  const [show, setShow] = useState(true);
  return (
    <Toast
      onClose={() => setShow(false)}
      show={show}
      delay={3000}
      autohide
      bg={props.variant}
    >
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">{mess.header}</strong>
        <small>{mess.time} mins ago</small>
      </Toast.Header>
      <Toast.Body>{mess.content}</Toast.Body>
    </Toast>
  );
}

export default ToastMessage;
