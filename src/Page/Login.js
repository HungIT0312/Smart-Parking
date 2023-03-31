import { Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function LoginPage() {
    const rules = {
        email: [{ required: true, message: 'Vui lòng nhập email!' }],
        password: [{ required: true, message: 'Vui lòng nhập mật khẩu!' }],
    };

    return (
        <div className="overflow-hidden">
            <Row>
                <Col xl={12} md={12}>
                    <div className="d-flex align-items-center justify-content-center vh-100">
                        <div className="w-50">
                            <Form
                                className="p-5 rounded shadow"
                                name="basic"
                                initialValues={{
                                    remember: true,
                                }}
                                autoComplete="off"
                            >
                                <h1 className="mb-5 ">Đăng nhập</h1>

                                <Form.Group className="mb-3" controlId="formGroupEmail">
                                    <Form.Label className='text-left'>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" rules={rules.email} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>

                                <div className="d-flex justify-content-center mt-4">
                                    <Button variant="primary" type="submit">
                                        Đăng nhập
                                    </Button>
                                </div>
                            </Form>

                            <div className="d-flex justify-content-center mt-4">
                                <span>Bạn chưa có tài khoản?</span>
                                <Link to="/register" className="ms-2">Đăng ký</Link>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
export default LoginPage;