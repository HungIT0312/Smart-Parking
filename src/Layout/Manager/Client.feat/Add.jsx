import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// import { addClient } from "../../../api/Clients.api";
import { addAccount } from "../../../api/Manager/Account.api";
import "../../../assets/styles/AddPage.scss";
import "react-toastify/dist/ReactToastify.css";
import CloudinaryUpload from "../../../api/Cloudinary.api";
export default function Add() {
  const [clients, setClients] = useOutletContext();
  const navigate = useNavigate();
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [is_staff, setIs_staff] = useState(0);
  const [licensePlate, setLicensePlate] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [progress, setProgress] = useState("");
  const [repeatePass,setRepeatePass] = useState("");
  const [confirmMess,setConfirmMess] = useState("");
  const params = {
    first_name,
    last_name,
    email,
    is_staff,
    license_plate: licensePlate,
    password,
    vehicle_pic: imageURL,
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(params);
      if(repeatePass === password)
      {
        await addAccount(params);
        await toast.success("Add client successfully !");
        setClients([...clients, params]);
        navigate(-1);
      }
      else {
        setConfirmMess('Wrong password')
        return
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpload = async ({ file }) => {
    try {
      setProgress(0);
      const data = await CloudinaryUpload(file, setProgress);
      const src = data?.url;
      console.log(src);
      if (src) {
        setImageURL(data?.url);
        setProgress(100);
      }
    } catch (error) {
      console.log("err");
    }
  };
  const handleInput = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
        handleUpload({ file });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <Container className="boxCon" fluid>
      <Card className="mt-5 child w-50" xs={12}>
        <Card.Header className="text-center">
          <h3>Add Client</h3>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Row>
                <Col>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    value={first_name}
                    onChange={(event) => setFirst_name(event.target.value)}
                    required
                    message="nhập đi"
                  />
                </Col>
                <Col>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    value={last_name}
                    onChange={(event) => setLast_name(event.target.value)}
                    required
                    message="nhập đi"
                  />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                message="nhập đi"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRepeatPass">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repeat password"
                value={repeatePass}
                onChange={(event) => setRepeatePass(event.target.value)}
                isInvalid={confirmMess!==''}
                required
              />
              <Form.Control.Feedback type="invalid">{confirmMess}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>License Plate</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter license plate"
                value={licensePlate}
                onChange={(event) => setLicensePlate(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicStaff">
              <Form.Label>Staff</Form.Label>
              <Form.Select
                placeholder="Enter staff"
                value={is_staff}
                onChange={(event) => setIs_staff(event.target.value)}
                required
                aria-label="Options"
              >
                <option value={0} selected>Client</option>
                <option value={1} >Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="imgForm">
              <Form.Label>License Img</Form.Label>
              <Form.Control
                type="file"
                accept="image/png, image/jpeg"
                placeholder="Input file"
                onChange={(event) => handleInput(event)}
                required
              />
              <Image
                src={selectedFile}
                style={{ maxWidth: "25%", marginTop: "1rem" }}
              ></Image>
            </Form.Group>
            <Form.Group className="mt-2" controlId="formLogo">
              <Button
                disabled={progress === 100 ? false : true}
                type="submit"
                variant="success"
              >
                Submit
              </Button>
              <Button
                type="submit"
                className="ms-2"
                onClick={() => navigate('/Manager/Clients/')}
              >
                Back
              </Button>
            </Form.Group>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
