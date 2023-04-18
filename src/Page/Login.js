import { Row, Col, Form, Button, Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Color from "../constants/colors";

function LoginPage() {
  // const rules = {
  //   email: [{ required: true, message: "Vui lòng nhập email!" }],
  //   password: [{ required: true, message: "Vui lòng nhập mật khẩu!" }],
  // };

  return (
    <Container
      style={{
        backgroundColor: Color.navColor,
        maxWidth: "100%",
      }}
    >
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={6} xs={9}>
          <Card className="p-lg-5">
            <Card.Title className="h-100 text-black text-center">
              <h1>Login</h1>
            </Card.Title>

            <Card.Body>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="emaixsl"
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
                    message="Vui lòng nhập email!"
                  />
                </Form.Group>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-3"
                    xs={12}
                  >
                    Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default LoginPage;
