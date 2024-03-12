import React, { useEffect,useState } from 'react'
import { Grid, _ } from 'gridjs-react';
import { html } from 'gridjs'
import { Badge, Button, Col, FormFeedback, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap'
import "gridjs/dist/theme/mermaid.css"
import * as Yup from "yup";
import { useFormik } from 'formik';
import axios from 'axios';
import PropTypes from "prop-types"
import { ToastContainer, toast } from 'react-toastify';
import RbAlert from 'react-bootstrap/Alert';
import { verifyToken } from '../Common/AuthToken';
import Select from 'react-select';

function LinkCell(text) {
  return (
    <>
      <a href={`/project/${text}`} className='text-primary fw-700'>{text}</a>
    </>
  );
}

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

const Projects = (props) => {

  const { className } = props;

  const [modal, setModal] = useState(false);
  const [backdrop, setBackdrop] = useState(true);
  const [keyboard, setKeyboard] = useState(true);
  const [loading, setLoading] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [update, setUpdate] = useState();

  const [updateId, setUpdateId] = useState("");
  const [name, setName] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [id, seId] = useState("");
  const [show, setShow] = useState(false);

  const [uniqueId, setUniqueId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [type, setType] = useState("");
  const [instruments, setInstruments] = useState("");
  const [imageAnalyzed, setImageAnalyzed] = useState("");
  const [storageAssign, setStorageAssign] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState();
  const storedToken = localStorage.getItem('auth_token');
  const [userData, setUserData] = useState([]);

  const [storagesAvailable, setStoragesAvailable] = useState();
  const [instrumentsAvailable, setInstrumentsAvailable] = useState();

  const storageSchema = Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required()
  });

  const instrumentSchema = Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required()
  });

  useEffect(() => {
      async function fetchData() {
          try {
              let user = {
                  token: storedToken
              }
              let token_res = await verifyToken(user);
              setUserData([token_res?.data]);
              setStatus(token_res.status);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      }
      fetchData()
  }, [status, storedToken]);

  const getStorages = async () => {
    let config = {
      method: 'post',
      url: 'http://localhost:3200/getStorage',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        user_email: userData[0]?.email ? userData[0]?.email : ""
      }
    };
    await axios.request(config)
      .then(async (response) => {
        debugger;
        const { status, msgType, msg, data } = response.data;
        switch (status) {
          case 1:
            setSuccess(msgType)
            setStoragesAvailable(data.map(item => {
              return {
                  value: item.bucketName,
                  label: item.bucketName
              };
          }))
            break;
          case 2:
            setErrorMsg(msg)
            break;

          default:
            break;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getInstruments = async () => {
    let config = {
      method: 'post',
      url: 'http://localhost:3200/getinstruments',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        user_email: userData[0]?.email ? userData[0]?.email : ""
      }
    };
    await axios.request(config)
      .then(async (response) => {
        debugger;
        const { status, msgType, msg, data } = response.data;
        switch (status) {
          case 1:
            setSuccess(msgType)
            setInstrumentsAvailable(data.map(item => {
              return {
                  value: item.uniqueId,
                  label: item.name
              };
          }))
            break;
          case 2:
            setErrorMsg(msg)
            break;

          default:
            break;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

// false for add, true for update
  const toggle = (props, update = false) => {
    debugger
    setUpdate(update);
    setModal(!modal);
    if (props === "cancel") {
      setLoading(false);
      setError(false);
      return null;
    }
    const data = (update ? props._cells : false);
    console.log(data);
    setUniqueId(data ? data[0].data : "");
    setProjectName(data ? data[1].data : "");
    setType(data ? data[2].data : "");
    setInstruments(data ? data[3].data.map(item => {
      return {
        value: item.in_uniqueId,
        label: item.in_name
      };
    }) : "");
    setImageAnalyzed(data ? data[4].data : "");
    setStorageAssign(data ? data[5].data.map(item => {
      return {
          value: item.st_name,
          label: item.st_name
      };
  }) : []);
    setDescription(data ? data[7].data : "");
    getStorages();
    getInstruments();
  };

  const columns = [
    {
      name: "Unique ID",
      formatter: (text) => _(LinkCell(text))
    },
    "Project Name",
    "Type",
    {
      name: "Instruments",
      formatter: (cell, row) => {
        return _(
          <div className='d-flex flex-wrap mxw-150 gap-1'>
            {cell.map((item) =>
              <>
                <Badge>{item.in_name}</Badge>
              </>
            )}
          </div>
        )
      }
    },
    {
      name: html("Analyzed<br />Image")
    },
    {
      name: "Storage Assign",
      formatter: (cell, row) => {
        return _(
          <div className='d-flex flex-wrap mxw-300 gap-1'>
            {cell.map((item) =>
              <>
                <Badge>{item.st_name}</Badge>
              </>
            )}
          </div>
        )
      }
    },
    {
      name: "Users Assigned",
      formatter: (cell, row) => {
        return _(
          <div className='d-flex flex-wrap mxw-300 gap-1'>
            {cell.map((item) =>
              <>
                <Badge>{item.user_email}</Badge>
              </>
            )}
          </div>
        )
      }
    },
    {
      name: "Description",
      formatter: (cell, row) => {
        return _(
          <div>
            <div className='mxw-250 text-2'>{cell}</div>
          </div>
        )
      }
    },
    {
      name: "Action",
      formatter: (cell, row) => {
        return _(
          <>
            <Button className='pt-1 px-2' color="info" size="sm" outline onClick={() => toggle(row, true)}>
              <svg className='d-flex pe-none' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </Button>
          </>
        )
      }
    }
  ]

  const fetchData = async ({
    uniqueId,
    type,
    projectName,
    description,
    storageAssign,
    instruments
  }) => {
    let config = {
      method: 'post',
      url: update ? 'http://localhost:3200/updateProject' : 'http://localhost:3200/addProject',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        uniqueId,
        type,
        projectName,
        description,
        storageAssign: storageAssign.map((storage) => storage.value),
        instruments: instruments.map((instrument) => ({
          "in_name": instrument.label,
          "in_unqiueId": instrument.value
        })),
        user_email: userData[0]?.email ? userData[0]?.email : ""
      }
    };
    await axios.request(config)
      .then(async (response) => {
        debugger;
        const { status, msgType, msg, data } = response.data;
        switch (status) {
          case 1:
            setSuccess(msgType)
            break;
          case 2:
            setErrorMsg(msg)
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
    enableReinitialize: true,
    initialValues: update ? {
      uniqueId,
      type,
      projectName,
      description,
      storageAssign,
      instruments
    } : {
      type,
      projectName,
      description,
      storageAssign,
      instruments
    },
    validationSchema: Yup.object( update ? {
      uniqueId: Yup.string().required("Unique id is missing."),
      type: Yup.string().required("Type field is blank."),
      projectName: Yup.string().required("Project name field is blank."),
      description: Yup.string().required("Description is missing. Please provide"),
      storageAssign: Yup.array().of(storageSchema).required("No storages are selected."),
      instruments: Yup.array().of(instrumentSchema).required("No instruments are selected.")
    } : {
      type: Yup.string().required("Type field is blank."),
      projectName: Yup.string().required("Project name field is blank."),
      description: Yup.string().required("Description is missing. Please provide"),
      storageAssign: Yup.array().of(storageSchema).required("No storages are selected."),
      instruments: Yup.array().of(instrumentSchema).required("No instruments are selected.")
    }),
    onSubmit: async (values) => {
      debugger;
      setLoading(true);
      await fetchData(values);
      sleep(2000).then(() => {
        setError(true);
        setLoading(false);
        setModal(!modal);
        setSuccess("");
        setErrorMsg("")
      });
    }
  });

  return (
    <div>
      <h5 className='fw-bold mb-3'>Projects</h5>
      {/*success && success ? (
        <>
          {toast.success(<small>{success}</small>, { position: "top-right", hideProgressBar: false, progress: undefined, toastId: "" })}
          <ToastContainer autoClose={3000} limit={1} draggable={true} pauseOnHover={true} />
        </>
      ) : null*/}
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
      <>
        <Grid
          columns={columns}
          server={{
            url: 'http://localhost:3200/allProjects',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_email: userData[0]?.email ? userData[0]?.email : ""}),
            then: data => data.data.map((project) => [
              project.uniqueId,
              project.projectName,
              project.type,
              project.instruments,
              project.imageAnalyzed,
              project.storageAssign,
              project.usersAssigned,
              project.description
            ]),
            handle: (res) => {
              if (res.status === 404) return { data: [] };
              if (res.ok) return res.json();
              throw Error('oh no :(');
            },
          }}
          search={true}
          language={{
            search: {
              placeholder: "Search Project"
            }
          }}
          sort={true}
          pagination={{ enabled: true, limit: 10 }}
        />
        <Button className='pt-1 px-2' color="info" size="sm" outline onClick={() => toggle({}, false)}>
          Add Project
        </Button>
      </>
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={className}
        backdrop={backdrop}
        centered={true}
        keyboard={keyboard}
        update={update}
      >
        <ModalHeader toggle={() => toggle("cancel")}>{update ? "Update Project" : "Add Project"}</ModalHeader>
        <ModalBody className='pt-4'>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              debugger;
              validation.handleSubmit();
              return false
            }}
            action="#">
            <Row>
              <Col sm={6}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      id='uniqueId'
                      name="Unique ID"
                      placeholder="Unique ID"
                      type="text"
                      value={uniqueId}
                      disabled={true}
                    />
                    <Label for="uniqueId">
                      Unique ID
                    </Label>
                  </FormGroup>
                </div>
              </Col>
              <Col sm={6}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      id="projectType"
                      name="type"
                      placeholder="Type"
                      type="text"
                      value={type}
                      disabled={update}
                      required={!update}
                      onChange={(e) => setType(e.target.value)}
                    />
                    <Label for="projectType">
                      Type
                      <span className='text-danger ps-1'>{update ? "" : "*"}</span>
                    </Label>
                    {(!update) ?  (validation.touched.type && validation.errors.type ? (
                      <FormFeedback className='d-block' type="invalid"><small>{validation.errors.type}</small></FormFeedback>
                    ) : null) : null}
                  </FormGroup>
                </div>
              </Col>
              {/*<Col sm={6}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      id="projectInstruments"
                      name="instruments"
                      placeholder="Instruments"
                      type="text"
                      value={instruments}
                      disabled={true}
                    />
                    <Label for="projectInstruments">
                      Instruments
                    </Label>
                  </FormGroup>
                </div>
              </Col>*/}
              <Col sm={6}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      id="imageAnalyzed"
                      name="imageAnalyzed"
                      placeholder="Image Analyzed"
                      type="text"
                      value={imageAnalyzed}
                      disabled={true}
                    />
                    <Label for="imageAnalyzed">
                      Image Analyzed
                    </Label>
                  </FormGroup>
                </div>
              </Col>
              {/*<Col sm={6}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      id="storageAssign"
                      name="storageAssign"
                      placeholder="Storage Assign"
                      type="text"
                      value={storageAssign}
                      disabled={true}
                    />
                    <Label for="storageAssign">
                      Storages Assigned
                    </Label>
                  </FormGroup>
                </div>
              </Col>*/}
            </Row>
            <p className='pt-2 mb-2'><em>You can update -</em></p>
            <Row>
              <Col sm={12}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      id="projectName"
                      name="projectName"
                      placeholder="Project Name"
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                    <Label for="projectName">
                      Project Name
                      <span className='text-danger ps-1'>*</span>
                    </Label>
                    {validation.touched.projectName && validation.errors.projectName ? (
                      <FormFeedback className='d-block' type="invalid"><small>{validation.errors.projectName}</small></FormFeedback>
                    ) : null}
                  </FormGroup>
                </div>
              </Col>
              <Col sm={12}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <textarea
                      id="projectDescription"
                      name="description"
                      placeholder="Description"
                      className="form-control"
                      onChange={(e) => setDescription(e.target.value)}
                    >{description}</textarea>
                    <Label for="projectDescription">
                      Description
                      <span className='text-danger ps-1'>*</span>
                    </Label>
                    {validation.touched.description && validation.errors.description ? (
                      <FormFeedback className='d-block' type="invalid"><small>{validation.errors.description}</small></FormFeedback>
                    ) : null}
                  </FormGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Select
                      id="storageAssign"
                      name="storageAssign"
                      placeholder="Storages"
                      options={storagesAvailable}
                      isMulti
                      value={storageAssign}
                      required
                      onChange={(e) => setStorageAssign(e)}
                      ></Select>
                  </FormGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Select
                      id="projectInstruments"
                      name="instruments"
                      placeholder="Instruments"
                      options={instrumentsAvailable}
                      isMulti
                      value={instruments}
                      required
                      onChange={function (e) {
                        setInstruments(e);
                        console.log(e);
                      }}
                      ></Select>
                  </FormGroup>
                </div>
              </Col>
            </Row>

            <Row className="mt-4">
              <div className='col-auto ms-auto'>
                <Button color="success"
                  disabled={error ? null : loading ? true : false}
                  className="btn btn-success fw-bold" type="submit">
                  {error ? null : loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                  {update ? "Update" : "Add"}
                </Button>
              </div>
              <div className='col-auto'>
                <Button color="secondary" onClick={() => toggle("cancel")}>
                  Cancel
                </Button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

Projects.propTypes = {
  className: PropTypes.string,
};

export default Projects
