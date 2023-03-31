import React, { useEffect, useState } from 'react';
import {  getClientById } from '../../api/Clients.api.js';

const License = () => {
    const [Clients, setClients] = useState("");
    try {
        useEffect(() => {
            console.log("get")
            const _getLicense = async () => {
                const res = await getClientById("111");
                setClients(res);
            };
            _getLicense();
        }, []);
    } catch (error) {
        console.log(error)
    }
    console.log(Clients)
    return (
        <div id="main-wrapper" style={{ padding: "16px 32px 0px 32px" }}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-4" style={{ paddingBottom: "93px" }}>
                        <div className="card border-info" style={{ boxShadow: "5px 8px 8px rgba(0, 0, 0, 0.2)" }}>
                            <img src={Clients.logo} style={{ width: "18rem", marginTop: "32px" }} className="card-img-top rounded mx-auto d-block img-fluid img-thumbnail" alt="..." />
                            <div className="card-body">
                                <label htmlFor="licensePlateInput">Biển kiểm soát:</label>
                                <h5 className="card-title">BKS: {Clients.LicensePlate}</h5>
                                <p className="card-text">Biển số xe đã được đăng kí rồi</p>

                                <a style={{ marginTop: "93px", width: "100%" }} href="/" className="btn btn-primary">Mở Barie</a>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="col-lg-12">
                            <div className="card" style={{ boxShadow: "5px 8px 12px rgba(0, 0, 0, 0.3)" }}>
                                <div className="card-body" style={{ marginBottom: "36px" }}>
                                    <h4 className="card-title text-center">Thông tin</h4>
                                    <div className="basic-form" style={{ marginTop: "36px" }}>
                                        <form>
                                            <div className="form-row">
                                                <div className="form-group col-md-6" >
                                                    <label>ID</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="ID"
                                                        name="id"
                                                        value={Clients.id}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label>Biển kiểm soát</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="BKS"
                                                        name="licensePlate"
                                                        value={Clients.LicensePlate}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Tên</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Tên"
                                                    name="name"
                                                    value={Clients.name}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Liên lạc</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Liên lạc"
                                                    name="contact"
                                                    value={Clients.contact}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Địa chỉ</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Địa chỉ"
                                                    name="address"
                                                    value={Clients.address}
                                                    readOnly
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-dark">
                                                Đăng ký
                                            </button>
                                        </form>
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

export default License;