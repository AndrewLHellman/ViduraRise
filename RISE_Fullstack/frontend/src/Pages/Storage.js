import React, { useEffect, useState } from 'react'
import { Grid, _ } from 'gridjs-react'
import { Badge, Button, Col, FormFeedback, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap'
import "gridjs/dist/theme/mermaid.css"
import * as Yup from "yup";
import { useFormik } from 'formik';
import axios from 'axios';
import { verifyToken } from '../Common/AuthToken';
import CreateableSelect from "react-select/creatable";


const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

const Storage = (props) => {

  const { className } = props;

  const [modal, setModal] = useState(false);
  const [modalUsers, setModalUsers] = useState(false);
  const [backdrop, setBackdrop] = useState(true);
  const [keyboard, setKeyboard] = useState(true);
  const [loading, setLoading] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const [bucketName, setBucketName] = useState("");
  const [type, setType] = useState("");
  const [usage, setUsage] = useState(""); 
  const [imageCount, setImageCount] = useState("");

  const [status, setStatus] = useState();
  const storedToken = localStorage.getItem('auth_token');
  const [userData, setUserData] = useState([]);
  const [newUsers, setNewUsers] = useState([]);

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

  const toggleUsers = (props) => {
    setModalUsers(!modalUsers);
    if (props === "cancel") {
      setNewUsers([]);
      setLoading(false);
      setError(false);
      return null;
    }
    const data = props._cells;
    setBucketName(data ? data[0].data : "");
  }

  const addUsers = async ({ bucketName, newUsers }) => {
    let config = {
      method: 'post',
      url: 'http://localhost:3200/addStorageUsers',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        bucketName,
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

  const columns = [
    {
      name: "Storage Name",
      formatter: (cell, row) => {
        return _(
          <span className='fw-600 text-primary'>{cell}</span>
        )
      }
    },
    "Type",
    "Usage",
    {
      name: "Image Count",
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
    }
  ]

  const toggle = (props) => {
    debugger
    setModal(!modal);
    if (props === "cancel") {
      setLoading(false);
      setError(false);
      return null;
    }
    const data = ["", ""];
    setBucketName(data ? data[0].data : "");
    setType(data ? data[1].data : "");
  };

  const fetchData = async ({ bucketName, type }) => {
    let config = {
      method: 'post',
      url: 'http://localhost:3200/addStorage',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        bucketName,
        type,
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
    initialValues: {
      bucketName,
      type
    },
    validationSchema: Yup.object({
      bucketName: Yup.string().required("Bucket name is missing."),
      type: Yup.string().required("Type field is blank.")
    }),
    onSubmit: async (values) => {
      debugger;
      setLoading(true);
      await fetchData(values);
      sleep(2000).then(() => {
        //setError(true);
        setLoading(false);
        setModal(!modal);
        setSuccess("");
        setErrorMsg("")
      });
    }
  });

  const userValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      bucketName: bucketName,
      newUsers
    },
    validationSchema: Yup.object({
      bucketName: Yup.string().required("Unique Id is missing."),
      newUsers: Yup.array().of(userSchema).required("No new users are added")
    }),
    onSubmit: async (values) => {
      debugger;
      setLoading(true);
      await addUsers(values);
      sleep(2000).then(() => {
        setError(true);
        setLoading(false);
        setNewUsers([]);
        setModalUsers(!modalUsers);
      });
    }
  });

  return (
    <div>
      <h5 className='fw-bold mb-3'>Storage</h5>
      <>
        <Grid
          // data={[]}
          columns={columns}
          server={{
            url: 'http://localhost:3200/getStorage',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_email: userData[0]?.email ? userData[0]?.email : ""}),
            then: data => data.data.map(storage => [
              storage.bucketName,
              storage.type,
              storage.usage,
              storage.imagecount,
              storage.usersAssigned,
              storage.usersAssigned
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
              placeholder: "Search Storage"
            }
          }}
          sort={true}
          pagination={{ enabled: true, limit: 10 }}
        />
        <Button className='pt-1 px-2' color="info" size="sm" outline onClick={() => toggle()}>
          Add S3
        </Button>
      </>
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={className}
        backdrop={backdrop}
        centered={true}
        keyboard={keyboard}
      >
        <ModalHeader toggle={() => toggle("cancel")}>Add Storage</ModalHeader>
        <ModalBody className='pt-4'>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
            className="needs-validation" action="#">
            <Row>
              <Col sm={6}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      id='bucketName'
                      name="Bucket Name"
                      placeholder="Bucket Name"
                      type="text"
                      value={bucketName}
                      onChange={(e) => setBucketName(e.target.value)}
                    />
                    <Label for="bucketName">
                      Bucket Name
                      <span className='text-danger ps-1'>*</span>
                    </Label>
                    {validation.touched.bucketName && validation.errors.bucketName ? (
                      <FormFeedback className='d-block' type="invalid"><small>{validation.errors.bucketName}</small></FormFeedback>
                    ) : null}
                  </FormGroup>
                </div>
              </Col>
              <Col sm={6}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      id="storageType"
                      name="type"
                      placeholder="S3"
                      type="text"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    />
                    <Label for="storageType">
                      Type
                      <span className='text-danger ps-1'>*</span>
                    </Label>
                    {validation.touched.type && validation.errors.type ? (
                      <FormFeedback className='d-block' type="invalid"><small>{validation.errors.type}</small></FormFeedback>
                    ) : null}
                  </FormGroup>
                </div>
              </Col>
              <Col sm={6}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      id="usage"
                      name="usage"
                      placeholder="Usage"
                      type="text"
                      value={usage}
                      disabled={true}
                    />
                    <Label for="usage">
                      Usage
                    </Label>
                  </FormGroup>
                </div>
              </Col>
              <Col sm={6}>
                <div className='mb-3'>
                  <FormGroup floating>
                    <Input
                      id="imageCount"
                      name="imageCount"
                      placeholder="Image Count"
                      type="number"
                      value={imageCount}
                      disabled={true}
                    />
                    <Label for="imageCount">
                      Image Count
                    </Label>
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
                  Update
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
                    placeholder='New User Emails'
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

export default Storage
