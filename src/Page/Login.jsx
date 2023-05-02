import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTokenLogin } from "../api/Login.api";
import Color from "../constants/colors";
function LoginPage({ role }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: pass,
    };
    console.log(data);
    const _getToken = async () => {
      try {
        const res = await getTokenLogin(data);
        if (res.token) {
          await toast.success("Login successfully !", { autoClose: 3000 });
          window.sessionStorage.setItem("tokenAd", res.token);
          res.role === 1 ? navigate("/Manager/") : navigate("/Client/");
        } else {
          toast.error("Login fail !", { autoClose: 3000 });
        }
      } catch (error) {}
    };
    _getToken();
  };

  return (
    <Container
      style={{
        backgroundColor: Color.navColor,
        maxWidth: "100%",
      }}
      fluid
    >
      <ToastContainer position="bottom-left" />
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    required
                    message="Vui lòng nhập mật khẩu!"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
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
                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-3"
                    onClick={handleLogin}
                  >
                    SignIn
                  </Button>
                </div>

                {/* <Button variant="primary" type="submit" className="mt-3">
                  SignIn
                </Button> */}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default LoginPage;
