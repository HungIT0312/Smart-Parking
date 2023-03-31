import React from "react";

const Error = () => {
    return (
        <div id="main-wrapper" style={{ padding: "16px 32px 0px 32px", marginTop: "10%" }}>
            <div className="container-fluid align-items-center justify-content-center">
                <div className="login-form-bg h-100">
                    <div className="container h-100">
                        <div className="row justify-content-center h-100">
                            <div className="col-xl-6">
                                <div className="error-content">
                                    <div className="card mb-0">
                                        <div className="card-body text-center pt-5">
                                            <h1 className="error-text text-primary">404</h1>
                                            <h4 className="mt-4">
                                                <i className="fa fa-thumbs-down text-danger"></i> Bad
                                                Request
                                            </h4>
                                            <p>Your Request resulted in an error.</p>
                                            <form className="mt-5 mb-5">
                                                <div className="text-center mb-4 mt-4">
                                                    <a href="/" className="btn btn-primary">
                                                        Go to Homepage
                                                    </a>
                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error;
