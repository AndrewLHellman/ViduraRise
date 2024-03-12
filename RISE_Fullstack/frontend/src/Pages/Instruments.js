import React, { useEffect, useState } from 'react'
import { Grid, _ } from "gridjs-react"
import { Badge, Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, Spinner, ModalHeader, Row, FormFeedback } from "reactstrap"
import PropTypes from "prop-types"
import "gridjs/dist/theme/mermaid.css"
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import RbAlert from 'react-bootstrap/Alert';
import { verifyToken } from '../Common/AuthToken';
import CreateableSelect from "react-select/creatable";

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

const Instruments = (props) => {

  const { className } = props;

  const [modalAction, setModalAction] = useState(false);
  const [modalUsers, setModalUsers] = useState(false);
  const [backdrop, setBackdrop] = useState(true);
  const [keyboard, setKeyboard] = useState(true);
  const [loading, setLoading] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState();

  const [updateId, setUpdateId] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [description, setDescription] = useState("");
  const [id, seId] = useState("");
  const [show, setShow] = useState(false);
  const [newUsers, setNewUsers] = useState([]);

  const [status, setStatus] = useState();
  const storedToken = localStorage.getItem('auth_token');
  const [userData, setUserData] = useState([]);

  const userSchema = Yup.object({
    label: Yup.string().email().required(),
    value: Yup.string().email().required()
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

  const toggleAction = (props) => {
    setModalAction(!modalAction);
    if (props === "cancel") {
      setLoading(false);
      setError(false);
      return null;
    }
    const data = props._cells;
    // console.log(data)
    setUpdateId(data ? data[0].data : "");
    setType(data ? data[2].data : "");
    setName(data ? data[1].data : "");
    setUpdateStatus(data ? data[3].data : "");
    setDescription(data ? data[6].data : "");
    seId(data ? data[7].data : "");
  };

  const toggleUsers = (props) => {
    setModalUsers(!modalUsers);
    if (props === "cancel") {
      setLoading(false);
      setError(false);
      return null;
    }
    const data = props._cells;
    seId(data ? data[7].data : "");
  }

  const columns = [
    {
      name: "Unique ID",
      formatter: (cell, row) => {
        return _(
          <span className='fw-600 text-primary'>{cell}</span>
        )
      }
    },
    "Name",
    "Type",
    "Status",
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
      name: "Add User",
      formatter: (cell, row) => {
        return _(
          <>
            <Button className='pt-1 px-2' color="info" size="sm" outline onClick={() => toggleUsers(row)}>
              <svg className='d-flex pe-none' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6m3-3h-6"/>
              </svg>
            </Button>
          </>
        )
      }
    },
    {
      name: "Description",
      formatter: (cell, row) => {
        return _(
          <>
            <div className='mxw-300 text-2'>{cell}</div>
          </>
        )
      }
    },
    {
      name: "Action",
      formatter: (cell, row) => {
        return _(
          <>
            <Button className='pt-1 px-2' color="info" size="sm" outline onClick={() => toggleAction(row)}>
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

  const fetchData = async ({ _id, name, description }) => {
    let config = {
      method: 'post',
      url: 'http://localhost:3200/updateInstruments',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ _id, name, description })
    };
    await axios.request(config)
      .then(async (response) => {
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

  const addUsers = async ({ _id, newUsers }) => {
    let config = {
      method: 'post',
      url: 'http://localhost:3200/addInstrumentUsers',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        _id,
        newUsers: newUsers.map((user) => ({"user_email": user.value}))
      }
    };
    await axios.request(config)
      .then(async (response) => {
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
    initialValues: {
      _id: id,
      name,
      description
    },
    validationSchema: Yup.object({
      _id: Yup.string().required("data id is mission."),
      name: Yup.string().required("Name field is blank."),
      description: Yup.string().required("Discription is missing. Please provide")
    }),
    onSubmit: async (values) => {
      debugger;
      setLoading(true);
      await fetchData(values);
      sleep(2000).then(() => {
        setError(true);
        setLoading(false);
        setModalAction(!modalAction);
      });
    }
  });

  const userValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      _id: id,
      newUsers
    },
    validationSchema: Yup.object({
      _id: Yup.string().required("data id is mission."),
      newUsers: Yup.array().of(userSchema).required("No new users are added")
    }),
    onSubmit: async (values) => {
      debugger;
      setLoading(true);
      await addUsers(values);
      sleep(2000).then(() => {
        setError(true);
        setLoading(false);
        setModalUsers(!modalUsers);
      });
    }
  });

  return (
    <div>
      <h5 className='fw-bold mb-3'>Instruments</h5>
      {success && success ? (
        <>
          {toast.success(<small>{success}</small>, { position: "top-right", hideProgressBar: false, progress: undefined, toastId: "" })}
          <ToastContainer autoClose={3000} limit={1} draggable={true} pauseOnHover={true} />
        </>
      ) : null}
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
          // data={[]}
          columns={columns}
          server={{
            url: 'http://localhost:3200/getinstruments',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_email: userData[0]?.email ? userData[0]?.email : ""}),
            then: data => data.data.map(instrument => {
              // console.log(instrument);
              return [instrument.uniqueId,
              instrument.name,
              instrument.type,
              instrument.status,
              instrument.usersAssigned,
              instrument.usersAssigned,
              instrument.description,
              instrument._id]
            }),
            handle: (res) => {
              if (res.status === 404) return { data: [] };
              if (res.ok) return res.json();
              throw Error('oh no :(');
            },
          }}
          search={true}
          language={{
            search: {
              placeholder: "Search Instruments"
            }
          }}
          sort={true}
          pagination={{ enabled: true, limit: 10 }}
        />
      </>
      <Modal
        isOpen={modalAction}
        toggle={toggleAction}
        className={className}
        backdrop={backdrop}
        centered={true}
        keyboard={keyboard}
      >
        <ModalHeader toggle={() => toggleAction("cancel")}>Update Instrument</ModalHeader>
        <ModalBody className='pt-4'>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false
            }}
            action="#">
            <Input
              name="_id"
              type="text"
              value={id}
              hidden={true}
            />
            <Row>
              <Col sm={4}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      name="Unique ID"
                      placeholder="Unique ID"
                      type="text"
                      value={updateId}
                      disabled={true}
                    />
                    <Label for="emailInput">
                      Unique ID
                    </Label>
                  </FormGroup>
                </div>
              </Col>
              <Col sm={4}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      name="Type"
                      placeholder="Type"
                      type="text"
                      value={type}
                      disabled={true}
                    />
                    <Label for="passwordInput">
                      Type
                    </Label>
                  </FormGroup>
                </div>
              </Col>
              <Col sm={4}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      name="Status"
                      placeholder="Status"
                      type="text"
                      value={updateStatus}
                      disabled={true}
                    />
                    <Label for="passwordInput">
                      Status
                    </Label>
                  </FormGroup>
                </div>
              </Col>
            </Row>
            <p className='pt-2 mb-2'><em>You can upate -</em></p>
            <Row>
              <Col sm={12}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      name="name"
                      placeholder="Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Label for="passwordInput">
                      Name
                      <span className='text-danger ps-1'>*</span>
                    </Label>
                    {validation.touched.name && validation.errors.name ? (
                      <FormFeedback className='d-block' type="invalid"><small>{validation.errors.name}</small></FormFeedback>
                    ) : null}
                  </FormGroup>
                </div>
              </Col>
              <Col sm={12}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <textarea
                      name="description"
                      placeholder="Description"
                      className="form-control"
                      onChange={(e) => setDescription(e.target.value)}
                    >{description}</textarea>
                    <Label for="passwordInput">
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

            <Row className="mt-4">
              <div className='col-auto ms-auto'>
                <Button color="success"
                  // disabled={error ? null : loading ? true : false}
                  className="btn btn-success fw-bold" type="submit">
                  {error ? null : loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                  Update
                </Button>
              </div>
              <div className='col-auto'>
                <Button color="secondary" onClick={() => toggleAction("cancel")}>
                  Cancel
                </Button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modalUsers}
        toggle={toggleUsers}
        className={className}
        backdrop={backdrop}
        centered={true}
        keyboard={keyboard}
      >
        <ModalHeader toggle={() => toggleUsers("cancel")}>Add User</ModalHeader>
        <ModalBody className='pt-4'>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              userValidation.handleSubmit();
              return false;
            }}>
            <Row>
              <div className='mb-3'>
                <FormGroup floating>
                  <CreateableSelect
                    id='userAssign'
                    name='userAssign'
                    placeholder='New Users'
                    isMulti
                    value={newUsers}
                    onChange={function (e) {
                      setNewUsers(e);
                      console.log(e);
                    }}
                  ></CreateableSelect>
                </FormGroup>
              </div>
            </Row>
            <Row className="mt-4">
              <div className='col-auto ms-auto'>
                <Button color="success"
                  disabled={error ? null : loading ? true : false}
                  className="btn btn-success fw-bold" type="submit">
                  {error ? null : loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                  {"Add"}
                </Button>
              </div>
              <div className='col-auto'>
                <Button color="secondary" onClick={() => toggleUsers("cancel")}>
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

Instruments.propTypes = {
  className: PropTypes.string,
};

export default Instruments
