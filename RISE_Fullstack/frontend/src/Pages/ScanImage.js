import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ChatBotComponent from './ChatBot';
import { ToastContainer, toast } from 'react-toastify';


const BotTable = ({ data }) => {
    return (
        <div className='w-100'>
            <table className='w-100'>
                <tbody>
                    <tr>
                        <td className='small'>Edge Coverage</td>
                        <td className='fw-600 small'>{data.edgeCoverage}</td>
                    </tr>
                    <tr>
                        <td className='small'>Orientation Loss</td>
                        <td className='fw-600 small'>{data.OrientationLoss}</td>
                    </tr>
                    <tr>
                        <td className='small'>Average Thickness</td>
                        <td className='fw-600 small'>{data.averageThickness}</td>
                    </tr>
                    <tr>
                        <td className='small'>Average Separation</td>
                        <td className='fw-600 small'>{data.averageSeparation}</td>
                    </tr>
                    <tr>
                        <td className='small'>Distance Entropy</td>
                        <td className='fw-600 small'>{data.distanceEntropy}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const SelectedOptions = ({ data }) => {
    return (
        <div className='w-100'>
            <p><b>Selected summary,</b></p>
            <table className='w-100'>
                <tbody>
                    <tr>
                        <td className='small'>Zoom</td>
                        <td className='fw-600 small'>{data[0]}</td>
                    </tr>
                    <tr>
                        <td className='small'>Focus</td>
                        <td className='fw-600 small'>{data[1]}</td>
                    </tr>
                    <tr>
                        <td className='small'>Contrast</td>
                        <td className='fw-600 small'>{data[2]}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}


const ScanImage = () => {

    const { projectId } = useParams();
    const [imageData, setImageData] = useState();
    const [improvedImage, setImprovedImage] = useState();
    const [instrument, setInstrument] = useState("");
    const [storage, setStorage] = useState("");
    const [image, setImage] = useState("");
    const [instrumentsDefault, setInstrumentsDefault] = useState([]);
    const [storageDefault, setStorageDefault] = useState([]);
    const [loading, setLoading] = useState();
    const [selectedSummary, setSelectedSummary] = useState([]);
    const [success, setSuccess] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);
    const [chatBot, setChatBot] = useState(false);
    const [message, setMessage] = useState();
    const [updatedImageData, setUpdatedImageData] = useState([]);
    const [analyzeImageData, setAnalyzeImageData] = useState();
    const [button, setButton] = useState("");
    const [chatBotSteps, setChatBotSteps] = useState([{
        id: '1',
        message: 'Hi',
    }]);
    let stepNumber = 0;
    let data = {
        "projectId": projectId
    };
    const analyzeImage = (props) => {
        debugger;
        setSuccess("success");
        setMessage("Image is sent for analysis!");
        document.getElementById("analyze_image_btn").setAttribute("disabled", true);
        document.getElementById("remove_image_btn").setAttribute("disabled", true);

        const request_data = {
            storage: props[0].storage,
            filename: props[0].filename,
            uniqueId: props[0].uniqueId
        }

        let config = {
            method: 'post',
            url: 'http://localhost:3200/analyzeImage',
            headers: {
                'Content-Type': 'application/json',
            },
            data: request_data
        };

        axios.request(config)
            .then((response) => {
                const { status, msgType, msg, data } = response.data;
                if (status) {
                    setTimeout(() => {
                        setSuccess(msgType);
                        setMessage(msg);
                        setChatBot(true);
                        setAnalyzeImageData(data);
                        setChatBotSteps([
                            {
                                id: "1",
                                message: "Hi, this RISE bot, I am here to help you with your experiments.",
                                delay: 1000,
                                trigger: "2"
                            },
                            {
                                id: "2",
                                message: "Here is your image analysis summary",
                                delay: 1000,
                                trigger: "3"
                            },
                            {
                                id: "3",
                                component: (
                                    <BotTable
                                        data={data}
                                    />
                                ),
                                delay: 1000,
                                trigger: "4"
                            },
                            {
                                id: "4",
                                message: "Based on your summary, here are some SEM parameter recommendations for for better image.",
                                delay: 1000,
                                trigger: "5"
                            },
                            {
                                id: "5",
                                message: "Select to change",
                                delay: 1000,
                                trigger: "6"
                            },
                            {
                                id: "6",
                                options: [
                                    { value: data?.zoom, label: `Set zoom to ${data?.zoom}`, trigger: '20' },
                                    { value: 0, label: `No change`, trigger: '20' },
                                ],
                                delay: 1000,
                            },
                            {
                                id: "7",
                                options: [
                                    { value: data?.focus, label: `Set focus to ${data?.focus}`, trigger: '20' },
                                    { value: 0, label: `No change`, trigger: '20' },
                                ],
                                delay: 1000,
                            },
                            {
                                id: "9",
                                options: [
                                    { value: data?.contrast, label: `Set contrast to ${data?.contrast}`, trigger: '20' },
                                    { value: 0, label: `No change`, trigger: '20' },
                                ],
                                delay: 1000,
                            },
                            {
                                id: "10",
                                component: (
                                    <SelectedOptions
                                        data={selectedSummary}
                                    />
                                ),
                                delay: 1000,
                                trigger: "11"
                            },
                            {
                                id: "11",
                                message: "Are you ready to update ?",
                                delay: 1000,
                                trigger: "12"
                            },
                            {
                                id: "12",
                                options: [
                                    { value: 1, label: "Yes", trigger: '13' },
                                    { value: 0, label: `No`, trigger: '21' },
                                ],
                                delay: 1000,
                            },
                            {
                                id: "13",
                                message: "Please wait we are updating instrument settings.",
                                delay: 2000,
                                trigger: () => {
                                    debugger;
                                    let data = {
                                        projectId: props[0].projectId,
                                        instrument: props[0].instrument,
                                        storage: props[0].storage,
                                        zoom: button === "SEM-SCAN" ? selectedSummary[0] : selectedSummary.zoom,
                                        focus: button === "SEM-SCAN" ? selectedSummary[1] : selectedSummary.focus,
                                        contrast: button === "SEM-SCAN" ? selectedSummary[2] : selectedSummary.contrast
                                    };

                                    let config = {
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: 'http://localhost:3200/semScan',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        data: data
                                    };

                                    axios.request(config)
                                        .then((response) => {
                                            const { status, data } = response.data;
                                            if (status) {
                                                setImprovedImage(data);
                                                setSuccess("success");
                                                setMessage("Scanning of new image is in progress!");
                                                setTimeout(() => {
                                                    setSuccess("");
                                                    setMessage("");
                                                }, 3000);
                                            }
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                    setTimeout(() => {
                                        setChatBot(false);
                                        setChatBotSteps([{
                                            id: '1',
                                            message: 'Hi',
                                        }]);
                                        document.getElementById("analyze_image_btn").removeAttribute("disabled");
                                        document.getElementById("remove_image_btn").removeAttribute("disabled");
                                    }, 15000);
                                    return "22";
                                },
                                waitAction: true
                            },
                            {
                                id: '20',
                                message: ({ previousValue, steps }) => {
                                    selectedSummary.push(previousValue);
                                    stepNumber = Object.keys(steps).length + 1;
                                    if (stepNumber !== 10) {
                                        return "Select";
                                    }
                                },
                                delay: 1000,
                                trigger: ({ value, steps }) => `${stepNumber}`,
                            },
                            {
                                id: "21",
                                message: "Thank you for connecting with us.",
                                delay: 1000,
                                trigger: () => {
                                    setTimeout(() => {
                                        setChatBot(false);
                                        setChatBotSteps([{
                                            id: '1',
                                            message: 'Hi',
                                        }]);
                                        document.getElementById("analyze_image_btn").removeAttribute("disabled");
                                        document.getElementById("remove_image_btn").removeAttribute("disabled");
                                    }, 10000);
                                },
                            },
                            {
                                id: "22",
                                message: "Please see your improved image in a moment. Thank you!",
                                delay: 5000,
                                end: true
                            },
                        ]);
                    }, 5000);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const getUploadedImgBase64Func = ({ storage, filename }) => {
        let data = {
            storage,
            filename
        };

        let config = {
            method: 'post',
            url: 'http://localhost:3200/showImage',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                const { status, data } = response.data;
                if (status) {
                    setImageData(data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const fetchData = async (values) => {
        let data = "";
        if (button === "SEM-SCAN") {
            data = values;
        } else {
            data = new FormData();
            data.append('projectId', values?.projectId);
            data.append('storage', values?.storage);
            data.append('instrument', values?.instrument);
            data.append('image', document.getElementById("scanImage").files[0]);
        }
        let config = {
            method: 'post',
            url: `http://localhost:3200/${button === "SEM-SCAN" ? 'semScan' : 'upload'}`,
            headers: {
                'Content-Type': button === "SEM-SCAN" ? 'application/json' : 'multipart/form-data'

            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                debugger;
                const { status, data, uniqueId, filename } = response.data;
                if (status) {
                    if (button === "SEM-SCAN") {
                        let new_data = {
                            uniqueId,
                            storage,
                            projectId,
                            instrument,
                            filename
                        }
                        updatedImageData.push(new_data);
                        setImageData(data);
                    } else {
                        updatedImageData.push(data);
                        getUploadedImgBase64Func(data);
                    }
                    setLoading(false);
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
            instrument,
            storage,
            image
        },
        validationSchema: Yup.object({
            instrument: Yup.string().required("Please select instrument"),
            storage: Yup.string().required("Please select storage"),
        }),
        onSubmit: async (values) => {
            debugger;
            setLoading(true);
            values.projectId = projectId;
            if (button === "SEM-SCAN") {
                delete values.image;
                values.zoom = "50000";
                values.focus = "8.5";
                values.contrast = "82";
            }
            await fetchData(values);
        }
    });
    useEffect(() => {
        let config = {
            method: 'post',
            url: 'http://localhost:3200/scanButton',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                const { status, msgType, data } = response.data;
                if (status) {
                    setInstrumentsDefault(data?.instrument);
                    setStorageDefault(data?.storage);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    return (
        <div>
            <h5 className='fw-bold mb-4'>Scan New Image</h5>
            {success && success ? (
                <>
                    {toast.success(<small>{message}....</small>, { position: "top-right", hideProgressBar: false, progress: undefined, toastId: "" })}
                    <ToastContainer autoClose={2000} limit={1} draggable={true} pauseOnHover={true} />
                </>
            ) : null}
            <hr />
            <Row className="justify-content-center">
                <Col sm={12}>
                    <p>Please choose instruments and storage.</p>
                </Col>
                <Col>
                    <Form
                        encType='multipart/form-data'
                        className='mb-4'
                        onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false
                        }}
                        action="#">
                        <Row>
                            <Col sm={3}>
                                <div>
                                    <FormGroup floating className='mb-0'>
                                        <select
                                            name="instrument"
                                            placeholder="Instrument"
                                            class="form-control"
                                            onChange={(e) => setInstrument(e.target.value)}
                                        >
                                            <option value=''>Select</option>
                                            {
                                                instrumentsDefault ? instrumentsDefault.map(item => <option value={item}>{item}</option>) : ""
                                            }
                                        </select>
                                        <Label for="emailInput">
                                            Instruments
                                            <span className='text-danger ps-1'>*</span>
                                        </Label>
                                        {validation.touched.instrument && validation.errors.instrument ? (
                                            <FormFeedback className='d-block' type="invalid"><small>{validation.errors.instrument}</small></FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </div>
                            </Col>
                            <Col sm={3}>
                                <div>
                                    <FormGroup floating className='mb-0'>
                                        <select
                                            name="storage"
                                            placeholder="Storage"
                                            class="form-control"
                                            onChange={(e) => setStorage(e.target.value)}
                                        >
                                            <option value=''>Select</option>
                                            {
                                                storageDefault ? storageDefault.map(item => <option value={item}>{item}</option>) : ""
                                            }
                                        </select>
                                        <Label for="passwordInput">
                                            Storage
                                            <span className='text-danger ps-1'>*</span>
                                        </Label>
                                        {validation.touched.storage && validation.errors.storage ? (
                                            <FormFeedback className='d-block' type="invalid"><small>{validation.errors.storage}</small></FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </div>
                            </Col>
                            <Col sm={3}>
                                <div className='mb-3'>
                                    <FormGroup floating>
                                        <Input
                                            id="scanImage"
                                            name="image"
                                            placeholder="Select Image"
                                            type="file"
                                            onChange={(e) => setImage(e.target.value)}
                                        />
                                        <Label for="emailInput">
                                            Select Image
                                        </Label>
                                        {validation.touched.image && validation.errors.image ? (
                                            <FormFeedback className='d-block' type="invalid"><small>{validation.errors.image}</small></FormFeedback>
                                        ) : null}
                                    </FormGroup>
                                </div>
                            </Col>
                            <div className='col-auto d-flex'>
                                <Button style={{ maxHeight: "58px" }} color="success"
                                    disabled={error ? null : loading ? true : false}
                                    className="btn btn-success w-100 fw-bold" type="submit" data-button="IMAGE-SCAN" onClick={(e) => { setButton(e.target.dataset.button) }}>
                                    {error ? null : loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                                    Submit
                                </Button>
                            </div>
                            <div className='col-auto'>OR</div>
                            <div className='col-auto d-flex'>
                                <Button style={{ maxHeight: "58px" }} color="success"
                                    disabled={error ? null : loading ? true : false}
                                    className="btn btn-success w-100 fw-bold" type="submit" data-button="SEM-SCAN" onClick={(e) => { setButton(e.target.dataset.button) }}>
                                    {error ? null : loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                                    Scan SEM Image
                                </Button>
                            </div>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <>
                {
                    imageData ?
                        <>
                            <Row>
                                <div className='col-auto'>
                                    <div className='border rounded p-2 mb-4'>
                                        <p className='mb-2 fw-600 text-primary'>Primary Image</p>
                                        <img src={`data:image/png;base64,${imageData}`} className='img-fluid image_view_height' />
                                    </div>
                                    <div className='d-flex justify-content-center gap-3'>
                                        <Button id='analyze_image_btn' color='primary' onClick={() => analyzeImage(updatedImageData)}>Analyze Image</Button>
                                        <Button id='remove_image_btn' color='danger' onClick={() => { }}>Remove Image</Button>
                                    </div>
                                </div>
                                <div className='col-auto'>
                                    {
                                        improvedImage ? <>
                                            <div className='border rounded p-2'>
                                                <p className='mb-2 fw-600 text-primary'>Improved Image</p>
                                                <img src={`data:image/png;base64,${improvedImage}`} className='img-fluid image_view_height' />
                                            </div>
                                        </> : ""
                                    }
                                </div>
                            </Row>
                        </> :
                        null
                }
            </>
            <div className={`chat-bot-container ${chatBot ? 'show' : ''}`}>
                {
                    chatBot ?
                        <div className='chat-bot'>
                            <ChatBotComponent data={chatBotSteps} />
                        </div> : ''
                }
            </div>
        </div>
    )
}

export default ScanImage
