import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTokenLogin } from "../api/Login.api";
import { useContext } from "react";
import { IdClientContext } from "../store/client-context/ClientContext";
function LoginPage({ role }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const idCtx = useContext(IdClientContext);
  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: pass,
    };
    const _getToken = async () => {
      try {
        // window.sessionStorage.setItem("tokenAdmin", "1");

        const res = await getTokenLogin(data);
        if (res.token) {
          await toast.success("Login successfully !");
          window.sessionStorage.setItem("tokenAdmin", res.token);
          if (res.id) {
            window.sessionStorage.setItem("idClient", res.id);
            idCtx.setID(res.id);
          }
          res.role === 1 ? navigate("/Manager/") : navigate("/Client/");
        } else {
        }
      } catch (error) {
        toast.error("Login fail !");
      }
    };
    _getToken();
  };

  return (
    <Container
      style={{
        background: "linear-gradient(90deg, #3F2B96 0%, #A8C0FF 100%)",
        maxWidth: "100%",
      }}
      fluid
    >
      <ToastContainer position="top-right" />
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
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default LoginPage;
