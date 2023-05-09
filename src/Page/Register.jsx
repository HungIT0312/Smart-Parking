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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloudinaryUpload from "../api/Cloudinary.api";
import { addAccount } from "../api/Manager/Account.api";
import Color from "../constants/colors";

export default function Register(props) {
  const navigate = useNavigate();
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [progress, setProgress] = useState("");
  const [repeatePass, setRepeatePass] = useState("");
  const [confirmMess, setConfirmMess] = useState("");
  const params = {
    first_name,
    last_name,
    email,
    is_staff: 0,
    license_plate: licensePlate,
    password,
    vehicle_pic: imageURL,
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(params);
      if (repeatePass === password) {
        await addAccount(params);
        await toast.success("Add client successfully !");
        navigate(-1);
      } else {
        setConfirmMess("Wrong password");
        return;
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
    <Container
      style={{
        background: "linear-gradient(90deg, #3F2B96 0%, #A8C0FF 100%)",
      }}
      fluid
    >
      <Row className=" min-vh-100 justify-content-center align-items-center">
        <Col md={6} lg={6} xs={9} className="">
          <Card className="mt-5 child " xs={12}>
            <Card.Header className="text-center">
              <h3>Register</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group controlId="formName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        value={first_name}
                        onChange={(event) => setFirst_name(event.target.value)}
                        required
                        message="nhập đi"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        value={last_name}
                        onChange={(event) => setLast_name(event.target.value)}
                        required
                        message="nhập đi"
                      />
                    </Form.Group>
                  </Col>
                </Row>
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
                    isInvalid={confirmMess !== ""}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {confirmMess}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formLicense">
                  <Form.Label>License Plate</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter license plate"
                    value={licensePlate}
                    onChange={(event) => setLicensePlate(event.target.value)}
                    required
                  />
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
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
