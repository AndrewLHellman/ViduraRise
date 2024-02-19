import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { Grid, _ } from 'gridjs-react';
import axios from 'axios';
import { Button, Col, Row } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';


const Project = () => {
    const [data, setData] = useState([]);
    const [success, setSuccess] = useState();

    const toggle = (props) => {
        const data = props._cells;
        if (data) {
            window.location.href = `/image-view/${data ? data[7].data : ""}&&&&${data ? data[3].data : ""}&&&&${data ? data[2].data : ""}&&&&${data ? data[8].data : ""}&&&&${data ? data[1].data : ""}`;
        }
    };

    const deleteImage = (props) => {
        debugger;
        const _id = props._cells[0].data;
        const filename = props._cells[3].data;
        const storage = props._cells[7].data;
        const request_data = { _id, filename, storage }
        console.log(request_data);
        // let data = JSON.stringify({
        //     "_id": "650bf372ebaeb89cd3aeed2e",
        //     "filename": "testing.tif",
        //     "storage": "cnt-project-3"
        // });

        let config = {
            method: 'post',
            url: 'http://localhost:3200/deleteImage',
            headers: {
                'Content-Type': 'application/json',
            },
            data: request_data
        };

        axios.request(config)
            .then((response) => {
                const { status, msgType, data } = response.data;
                if (status) {
                    setSuccess(msgType)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const { id } = useParams();
    const columns = [
        {
            name: "_ID",
            formatter: (cell, row) => {
                return _(
                    <>
                        <button className='image-link cursor-pointer text-primary bg-transparent border-0 p-0 m-0' size="sm" outline onClick={() => toggle(row)}>{cell}</button>
                    </>
                )
            }
        },
        "projectId",
        "uniqueId",
        "filename",
        "resolution",
        "Analyzed",
        "size",
        "storage",
        "instrument",
        {
            name: "Action",
            formatter: (cell, row) => {
                return _(
                    <>
                        <Button className='pt-1 px-2 d-flex' color="danger" size="sm" outline onClick={() => deleteImage(row)}>
                            <svg className='d-flex pe-none' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </Button>
                    </>
                )
            }
        }
    ]

    useEffect(() => {
        const requestData = {
            "projectId": id
        };

        let config = {
            method: 'post',
            url: 'http://localhost:3200/getAllImages',
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestData
        };

        axios(config)
            .then((response) => {
                const { status, data, length } = response.data;
                if (status) {
                    const new_data = data.map((project) => [
                        project._id,
                        project.projectId,
                        project.uniqueId,
                        project.filename,
                        project.resolution,
                        project.status,
                        project.size,
                        project.storage,
                        project.instrument,
                    ])
                    setData(new_data);
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
                    {toast.success(<small>Image deleted successfully....</small>, { position: "top-right", hideProgressBar: false, progress: undefined, toastId: "" })}
                    <ToastContainer autoClose={3000} limit={1} draggable={true} pauseOnHover={true} />
                </>
            ) : null}
            <Row>
                <Col>
                    <h5 className='fw-bold mb-3'>Images</h5>
                </Col>
                <Col className='text-end'>
                    <Link to={`/scan-image/${id}`} className='btn btn-primary btn-sm' onClick={() => { }}><b>Scan New Image</b></Link>
                </Col>
            </Row>
            <hr className='my-1' />
            <Row>
                <Col>
                    <>
                        <Grid
                            data={data}
                            columns={columns}
                            search={true}
                            language={{
                                search: {
                                    placeholder: "Search Image"
                                }
                            }}
                            sort={true}
                            pagination={{ enabled: true, limit: 10 }}
                        />
                    </>
                </Col>
            </Row>
        </div>
    )
}

export default Project
