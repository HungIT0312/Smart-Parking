import { Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function LoginPage() {
  const rules = {
    email: [{ required: true, message: "Vui lòng nhập email!" }],
    password: [{ required: true, message: "Vui lòng nhập mật khẩu!" }],
  };
  return (
    <div
      className="overflow-hidden"
      style={{
        backgroundColor: "#52fb5b",
        backgroundImage: "linear-gradient(315deg, #82ff89 0%, #c9d9ff 74%)",
      }}
    >
      <Row>
        <Col xl={12} md={12} lg={12}>
          <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="w-50">
              <Form
                className="p-5 rounded shadow text-start col-sm-12"
                name="basic"
                initialValues={{
                  remember: true,
                }}
                autoComplete="off"
                style={{ backgroundColor: "#fff" }}
              >
                <h1 className="mb-5 text-center">Đăng nhập</h1>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label className="text-left">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    rules={rules.email}
                    validated={true}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3 text-left"
                  controlId="formGroupPassword"
                >
                  <Form.Label className="text-left">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    validated={true}
                  />
                </Form.Group>

                <div className="d-flex justify-content-center mt-4">
                  <Button variant="primary" type="submit">
                    Đăng nhập
                  </Button>
                </div>
              </Form>

              <div className="d-flex justify-content-center mt-4">
                <span>Bạn chưa có tài khoản?</span>
                <Link to="/register" className="ms-2">
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default LoginPage;
