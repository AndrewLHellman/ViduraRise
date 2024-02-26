import React, { useEffect, useState } from 'react'
import { Grid, _ } from 'gridjs-react'
import { Button, Col, FormFeedback, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap'
import "gridjs/dist/theme/mermaid.css"
import * as Yup from "yup";
import { useFormik } from 'formik';
import axios from 'axios';
import { verifyToken } from '../Common/AuthToken';

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

const Storage = (props) => {

  const { className } = props;

  const [modal, setModal] = useState(false);
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

  const fetchData = async (req_data) => {
    console.log(req_data);
    let config = {
      method: 'post',
      url: 'http://localhost:3200/addStorage',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(req_data)
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
              storage.imagecount
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
    </div>
  )
}

export default Storage
