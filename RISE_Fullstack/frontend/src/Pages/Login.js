import React, { useState, useEffect } from 'react';
import { Col, Container, Input, Label, Row, Button, Form, Spinner, FormGroup, FormFeedback } from 'reactstrap';
import { Link } from "react-router-dom";
import RbAlert from 'react-bootstrap/Alert';
import axios from 'axios'

import ParticlesAuth from "../Layouts/ParticlesAuth";

//redux
// import { useSelector, useDispatch } from "react-redux";


// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Social Media Imports
// import { loginUser, socialLogin, resetLoginFlag } from "../../store/actions";

import { ToastContainer, toast } from 'react-toastify';

import withRouter from '../Common/withRouter';
import { generateToken } from '../Common/AuthToken';

import API from '../Common/ApiConfig';

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

const Login = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordShow, setPasswordShow] = useState(false);
    const [loggedIn, setLoggedIn] = useState();
    const [loading, setLoading] = useState();
    const [success, setSuccess] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);

    const fetchData = async ({ email, password }) => {
        let config = {
            method: 'post',
            url: API.AUTH.LOGIN,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ email, password })
        };
        await axios.request(config)
            .then(async (response) => {
                const { status, msgType, msg, data } = response.data;
                switch (status) {
                    case 1:
                        const token_data = await generateToken(data);
                        if (token_data?.status) {
                            localStorage.setItem("auth_token", token_data.token)
                        }
                        setLoggedIn(data);
                        setSuccess(msgType)
                        break;
                    case 2:
                        setErrorMsg(msg)
                        sleep(2000).then(() => {
                            setError(true);
                            setLoading(false);
                        });
                        break;

                    default:
                        break;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {
            email,
            password
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            await fetchData(values);
        }
    });

    useEffect(() => {
        sleep(5000).then(() => {
            if (loggedIn?.email === email) {
                window.location.replace("/daskboard");
            }
        });
    }, [loggedIn, email]);

    document.title = "Login | RISE";
    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5">
                                    <div>
                                        <h2>Login</h2>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {errorMsg && errorMsg ? (
                            <Row className='justify-content-center'>
                                <Col md={8} lg={6} xl={6}>
                                    <RbAlert variant="danger" onClose={() => setShow(false)} dismissible>
                                        <p className='d-flex align-items-center mb-0'>
                                            <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                            {errorMsg}!
                                        </p>
                                    </RbAlert>
                                </Col>
                            </Row>) : null}
                        {success && success ? (
                            <>
                                {toast.success(<small>Your Redirect To Dashboard...</small>, { position: "top-right", hideProgressBar: false, progress: undefined, toastId: "" })}
                                <ToastContainer autoClose={3000} limit={1} draggable={true} pauseOnHover={true} />
                            </>
                        ) : null}
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={6}>
                                <div className="">
                                    <div className="">
                                        <div className="d-none text-center mt-2">
                                            <h5 className="text-primary">Welcome Back !</h5>
                                            <p className="text-muted">Sign in to continue to RISE.</p>
                                        </div>
                                        {/* {errorMsg && errorMsg ? (<Alert className='px-2 pt-0 pb-1 text-center' color="danger">
                                            <small>{errorMsg}</small>
                                        </Alert>) : null} */}
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false
                                                }}
                                                action="#">
                                                <div className='mb-3'>
                                                    <FormGroup floating>
                                                        <Input
                                                            name="email"
                                                            placeholder="Email"
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                        />
                                                        <Label for="emailInput">
                                                            Email
                                                            <span className='text-danger ps-1'>*</span>
                                                        </Label>
                                                        {validation.touched.email && validation.errors.email ? (
                                                            <FormFeedback className='d-block' type="invalid"><small>{validation.errors.email}</small></FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </div>

                                                <div className='mb-3'>
                                                    <FormGroup floating>
                                                        <Input
                                                            name="password"
                                                            placeholder="password"
                                                            type={passwordShow ? "text" : "password"}
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                        <Label for="passwordInput">
                                                            Password
                                                            <span className='text-danger ps-1'>*</span>
                                                        </Label>
                                                        <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted pt-3" type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}>
                                                            <i className="ri-eye-fill align-middle"></i>
                                                        </button>
                                                        {validation.touched.password && validation.errors.password ? (
                                                            <FormFeedback className='d-block' type="invalid"><small>{validation.errors.password}</small></FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </div>
                                                <div className="mt-4">
                                                    <Button color="success"
                                                        disabled={error ? null : loading ? true : false}
                                                        className="btn btn-success w-100 fw-bold" type="submit">
                                                        {error ? null : loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                                                        Sign In
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Don't have an account ? <Link to="/register" className="fw-semibold text-primary text-decoration-underline"> Register Now </Link> </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default withRouter(Login);
