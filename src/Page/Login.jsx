import { Row, Col, Form, Button, Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Color from "../constants/colors";
import { Link, useNavigate } from "react-router-dom";

function LoginPage({ role }) {
  const navigate = useNavigate();
  // const rules = {
  //   email: [{ required: true, message: "Vui lòng nhập email!" }],
  //   password: [{ required: true, message: "Vui lòng nhập mật khẩu!" }],
  // };
  const handleRegister = (e) => {
    e.preventDefault();
    console.log("ok");
  };
  return (
    <Container
      style={{
        backgroundColor: Color.navColor,
        maxWidth: "100%",
      }}
      fluid
    >
      <Row className=" min-vh-100 justify-content-center align-items-center">
        <Col md={6} lg={6} xs={9} className="">
          <Card className="p-lg-5 ">
            <Card.Title className="h-100 text-black text-center">
              <h1>Login</h1>
            </Card.Title>

            <Card.Body>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    required
                    message="Vui lòng nhập email!"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    required
                    message="Vui lòng nhập mật khẩu!"
                  />
                </Form.Group>
                {role === 2 ? (
                  <Form.Group>
                    <p>
                      Don't have account?{" "}
                      <Link to={"/Client/Register"}> Register.</Link>
                    </p>
                  </Form.Group>
                ) : null}

                <div className="d-flex  justify-content-center">
                  <Button variant="primary" type="submit" className="mt-3">
                    SignIn
                  </Button>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  onClick={() => navigate("/Manager/")}
                >
                  SignIn
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default LoginPage;
