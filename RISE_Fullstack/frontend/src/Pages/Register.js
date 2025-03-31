import React, { useEffect, useState } from "react";
import { Row, Col, Alert, Container, Input, Label, Form, FormGroup, Button, Spinner, FormFeedback } from "reactstrap";
import ParticlesAuth from "../Layouts/ParticlesAuth";
import axios from 'axios';
import RbAlert from 'react-bootstrap/Alert';

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// action
// import { registerUser, apiError, resetRegisterFlag } from "../../store/actions";

//redux
// import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import API from "../Common/ApiConfig";

//import images

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

const Register = () => {

    const history = useNavigate();
    // const dispatch = useDispatch();
    const [passwordShow, setPasswordShow] = useState(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [inputCountry, setCountry] = useState("");
    const [inputZip, setZip] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState();
    const [success, setSuccess] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const [error, setError] = useState();
    const [resStatus, setResStatus] = useState();
    const [regisateredData, setRegisateredData] = useState();
    const [show, setShow] = useState(false);


    const fetchData = async (req_data) => {
        console.log(req_data);
        let config = {
            method: 'post',
            url: API.AUTH.REGISTER,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(req_data)
        };
        await axios.request(config)
            .then((response) => {
                const { status, msgType, msg, data } = response.data;
                setResStatus(status);
                switch (status) {
                    case 1:
                        setRegisateredData(data);
                        setSuccess(msgType)
                        break;
                    case 2:
                        setErrorMsg(msg)
                        sleep(3000).then(() => {
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
        //     // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email,
            firstname,
            lastname,
            address,
            contact,
            inputCountry,
            inputZip,
            password,
            confirmPassword
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Email"),
            firstname: Yup.string().required("Please Enter First Name"),
            lastname: Yup.string().required("Please Enter Last Name"),
            address: Yup.string().required("Please Enter Address"),
            contact: Yup.string().required("Please Enter Contact Number"),
            inputCountry: Yup.string().required("Please Enter Country Name"),
            inputZip: Yup.string().required("Please Enter Zip Code"),
            password: Yup.string().required("Please Enter Password"),
            confirmPassword: Yup.string().required('Please retype your password.').oneOf([Yup.ref('password')], 'Your passwords do not match.')
        }),
        onSubmit: async (values) => {
            delete values.confirmPassword;
            setLoading(true);
            await fetchData(values);
        }
    });

    useEffect(() => {
        sleep(7000).then(() => {
            if (regisateredData?.email === email) {
                window.location.replace("/login");
            }
        });
    }, [success, error, history, email, regisateredData]);

    document.title = "Registration | RISE";

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5">
                                    <div>
                                        <h2>Registration</h2>
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
                                {toast.success("Your Redirect To Login Page...", { position: "top-right", hideProgressBar: false, progress: undefined, toastId: "" })}
                                <ToastContainer autoClose={5000} limit={1} draggable={true} pauseOnHover={true} />
                            </>
                        ) : null}
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={6}>
                                <div className="">
                                    <div className="">
                                        <div className="d-none text-center mt-2">
                                            <h5 className="text-primary">Create New Account</h5>
                                            <p className="text-muted">Get your free RISE account now</p>
                                        </div>
                                        {/* {errorMsg && errorMsg && resStatus === 2 ? (<Alert className='px-2 pt-0 pb-1 text-center' color="danger">
                                            <small>Email has been Register Before, Please Use Another Email Address...</small>
                                        </Alert>) : null} */}
                                        {success && success && resStatus === 1 ? (<Alert className='px-2 pt-0 pb-1 text-center' color="success">
                                            <small>Congratulations ! Your are registered successfully.</small>
                                        </Alert>) : null}
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                className="needs-validation" action="#">
                                                <Row>
                                                    <Col>
                                                        <div className='mb-3'>
                                                            <FormGroup floating>
                                                                <Input
                                                                    name="firstname"
                                                                    placeholder="First Name"
                                                                    type="text"
                                                                    value={firstname}
                                                                    onChange={(e) => setFirstname(e.target.value)}
                                                                />
                                                                <Label for="emailInput">
                                                                    First Name
                                                                    <span className='text-danger ps-1'>*</span>
                                                                </Label>
                                                                {validation.touched.firstname && validation.errors.firstname ? (
                                                                    <FormFeedback className='d-block' type="invalid"><small>{validation.errors.firstname}</small></FormFeedback>
                                                                ) : null}
                                                            </FormGroup>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className='mb-3'>
                                                            <FormGroup floating>
                                                                <Input
                                                                    name="lastname"
                                                                    placeholder="Last Name"
                                                                    type="text"
                                                                    value={lastname}
                                                                    onChange={(e) => setLastname(e.target.value)}
                                                                />
                                                                <Label for="emailInput">
                                                                    Last Name
                                                                    <span className='text-danger ps-1'>*</span>
                                                                </Label>
                                                                {validation.touched.lastname && validation.errors.lastname ? (
                                                                    <FormFeedback className='d-block' type="invalid"><small>{validation.errors.lastname}</small></FormFeedback>
                                                                ) : null}
                                                            </FormGroup>
                                                        </div>
                                                    </Col>
                                                </Row>
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
                                                            name="contact"
                                                            placeholder="Contact Number"
                                                            type="text"
                                                            value={contact}
                                                            onChange={(e) => setContact(e.target.value)}
                                                        />
                                                        <Label for="emailInput">
                                                            Contact Number
                                                            <span className='text-danger ps-1'>*</span>
                                                        </Label>
                                                        {validation.touched.contact && validation.errors.contact ? (
                                                            <FormFeedback className='d-block' type="invalid"><small>{validation.errors.contact}</small></FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </div>
                                                <div className='mb-3'>
                                                    <FormGroup floating>
                                                        <Input
                                                            name="address"
                                                            placeholder="Address"
                                                            type="text"
                                                            value={address}
                                                            onChange={(e) => setAddress(e.target.value)}
                                                        />
                                                        <Label for="emailInput">
                                                            Address
                                                            <span className='text-danger ps-1'>*</span>
                                                        </Label>
                                                        {validation.touched.address && validation.errors.address ? (
                                                            <FormFeedback className='d-block' type="invalid"><small>{validation.errors.address}</small></FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </div>
                                                <Row>
                                                    <Col>
                                                        <div className='mb-3'>
                                                            <FormGroup floating>
                                                                <Input
                                                                    name="inputCountry"
                                                                    placeholder="Country"
                                                                    type="text"
                                                                    value={inputCountry}
                                                                    onChange={(e) => setCountry(e.target.value)}
                                                                />
                                                                <Label for="emailInput">
                                                                    Country
                                                                    <span className='text-danger ps-1'>*</span>
                                                                </Label>
                                                                {validation.touched.inputCountry && validation.errors.inputCountry ? (
                                                                    <FormFeedback className='d-block' type="invalid"><small>{validation.errors.inputCountry}</small></FormFeedback>
                                                                ) : null}
                                                            </FormGroup>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className='mb-3'>
                                                            <FormGroup floating>
                                                                <Input
                                                                    name="inputZip"
                                                                    placeholder="Zip Code"
                                                                    type="text"
                                                                    value={inputZip}
                                                                    onChange={(e) => setZip(e.target.value)}
                                                                />
                                                                <Label for="emailInput">
                                                                    Zip Code
                                                                    <span className='text-danger ps-1'>*</span>
                                                                </Label>
                                                                {validation.touched.inputZip && validation.errors.inputZip ? (
                                                                    <FormFeedback className='d-block' type="invalid"><small>{validation.errors.inputZip}</small></FormFeedback>
                                                                ) : null}
                                                            </FormGroup>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className='mb-3'>
                                                    <FormGroup floating>
                                                        <Input
                                                            name="password"
                                                            placeholder="Password"
                                                            type={passwordShow ? "text" : "password"}
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                        <Label for="emailInput">
                                                            Password
                                                            <span className='text-danger ps-1'>*</span>
                                                        </Label>
                                                        {validation.touched.password && validation.errors.password ? (
                                                            <FormFeedback className='d-block' type="invalid"><small>{validation.errors.password}</small></FormFeedback>
                                                        ) : null}
                                                        <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted pt-3" type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}>
                                                            <i className={passwordShow ? "ri-eye-off-fill align-middle" : "ri-eye-fill align-middle"}></i>
                                                        </button>
                                                    </FormGroup>
                                                </div>
                                                <div className='mb-3'>
                                                    <FormGroup floating>
                                                        <Input
                                                            name="confirmPassword"
                                                            placeholder="Confirm Password"
                                                            type={confirmPasswordShow ? "text" : "password"}
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                        />
                                                        <Label for="emailInput">
                                                            Confirm Password
                                                            <span className='text-danger ps-1'>*</span>
                                                        </Label>
                                                        {validation.touched.confirmPassword && validation.errors.confirmPassword ? (
                                                            <FormFeedback className='d-block' type="invalid"><small>{validation.errors.confirmPassword}</small></FormFeedback>
                                                        ) : null}
                                                        <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted pt-3" type="button" id="password-addon" onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}>
                                                            <i className={confirmPasswordShow ? "ri-eye-off-fill align-middle" : "ri-eye-fill align-middle"}></i>
                                                        </button>
                                                    </FormGroup>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="mb-0 fs-12 text-muted fst-italic">By registering you agree to the RISE
                                                        <Link to="#" className="text-primary text-decoration-underline fst-normal fw-medium ms-1">Terms of Use</Link></p>
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
                                    <p className="mb-0">Already have an account ? <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Register;
