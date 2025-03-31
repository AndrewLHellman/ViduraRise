import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { Button, Card, CardBody, Col, Row, Table } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import ChatBotComponent, { ViduraChatbot } from './ChatBot';
import API from '../Common/ApiConfig';

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

const Image = () => {
    const { params } = useParams();
    const [imageData, setImageData] = useState();
    const [analyzeImageData, setAnalyzeImageData] = useState();
    const [message, setMessage] = useState();
    const [success, setSuccess] = useState();
    const [chatBot, setChatBot] = useState(false);
    const [improvedImage, setImprovedImage] = useState("");
    const [selectedSummary, setSelectedSummary] = useState([]);
    const [chatBotSteps, setChatBotSteps] = useState([{
        id: '1',
        message: 'Hi',
    }]);
    let stepNumber = 0;
    let image_req_data = [];

    const analyzeImage = (props) => {
        setSuccess("success");
        setMessage("Image is sent for analysis!");
        document.getElementById("analyze_image_btn").setAttribute("disabled", true);
        document.getElementById("remove_image_btn").setAttribute("disabled", true);
        image_req_data = params.split("&&&&")

        const request_data = {
            storage: image_req_data[0],
            filename: image_req_data[1],
            uniqueId: image_req_data[2]
        }

        let config = {
            method: 'post',
            url: API.IMAGES.ANALYZE,
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
                                    image_req_data = params.split("&&&&");
                                    let data = {
                                        projectId: image_req_data[4],
                                        instrument: image_req_data[3],
                                        storage: image_req_data[0],
                                        zoom: selectedSummary.zoom,
                                        focus: selectedSummary.focus,
                                        contrast: selectedSummary.contrast
                                    };

                                    let config = {
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: API.IMAGES.INSTRUMENT_SCAN,
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

    useEffect(() => {
        if (params) {
            image_req_data = params.split("&&&&")
        } else {
            return null;
        }
        const requestData = JSON.stringify({
            storage: image_req_data[0],
            filename: image_req_data[1]
        });

        let config = {
            method: 'post',
            url: API.IMAGES.SHOW,
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestData
        };

        axios(config)
            .then((response) => {
                const { status, data } = response.data;
                if (status) {
                    setImageData(data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            {success && success ? (
                <>
                    {toast.success(<small>{message}....</small>, { position: "top-right", hideProgressBar: false, progress: undefined, toastId: "" })}
                    <ToastContainer autoClose={2000} limit={1} draggable={true} pauseOnHover={true} />
                </>
            ) : null}
            <h5 className='fw-bold mb-3'>Storage - {params.split("&&&&")[0]} | Image - {params.split("&&&&")[1]}</h5>
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
                                        <Button id='analyze_image_btn' color='primary' onClick={() => analyzeImage()}>Analyze Image</Button>
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

            {/* VIDURA Research Assistant powered by ARES.py */}
            <ViduraChatbot />

            {/* Add CSS for VIDURA Chatbot */}
            <style>
            {`
                .vidura-chatbot-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 999;
                }

                .vidura-chatbot {
                    width: 600px;
                    height: 900px;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .chatbot-header {
                    background-color: #376B7E;
                    padding: 5px 10px;
                    text-align: right;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                }

                .chatbot-toggle {
                    background-color: #376B7E;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    padding: 10px 15px;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                }

                .react-chatbot-kit-chat-container {
                    width: 100%;
                    height: calc(900px - 37px);
                }

                .react-chatbot-kit-chat-message-container {
                    height: calc(900px - 140px);
                }

                .react-chatbot-kit-chat-bot-message {
                    width: 450px;
                }

                .error-message {
                    color: #d9534f;
                    padding: 10px;
                    border-radius: 5px;
                    background-color: rgba(217, 83, 79, 0.1);
                    border-left: 3px solid #d9534f;
                    margin: 10px 0;
                }

                .thinking-widget {
                    padding: 5px 0;
                }

                .dot-pulse {
                    position: relative;
                    left: -9999px;
                    width: 6px;
                    height: 6px;
                    border-radius: 5px;
                    background-color: #fff;
                    color: #fff;
                    box-shadow: 9999px 0 0 -5px;
                    animation: dot-pulse 1.5s infinite linear;
                    animation-delay: 0.25s;
                }

                .dot-pulse::before, .dot-pulse::after {
                    content: "";
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    width: 6px;
                    height: 6px;
                    border-radius: 5px;
                    background-color: #fff;
                    color: #fff;
                }

                .dot-pulse::before {
                    box-shadow: 9984px 0 0 -5px;
                    animation: dot-pulse-before 1.5s infinite linear;
                    animation-delay: 0s;
                }

                .dot-pulse::after {
                    box-shadow: 10014px 0 0 -5px;
                    animation: dot-pulse-after 1.5s infinite linear;
                    animation-delay: 0.5s;
                }

                @keyframes dot-pulse-before {
                    0% { box-shadow: 9984px 0 0 -5px; }
                    30% { box-shadow: 9984px 0 0 2px; }
                    60%, 100% { box-shadow: 9984px 0 0 -5px; }
                }

                @keyframes dot-pulse {
                    0% { box-shadow: 9999px 0 0 -5px; }
                    30% { box-shadow: 9999px 0 0 2px; }
                    60%, 100% { box-shadow: 9999px 0 0 -5px; }
                }

                @keyframes dot-pulse-after {
                    0% { box-shadow: 10014px 0 0 -5px; }
                    30% { box-shadow: 10014px 0 0 2px; }
                    60%, 100% { box-shadow: 10014px 0 0 -5px; }
                }
            `}
            </style>
        </div>
    )
}

export default Image
