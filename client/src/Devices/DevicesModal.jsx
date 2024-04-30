import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Dropdown, DropdownButton } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DropDown from '../Components/DropDown';
import DropMenu from '../Components/DropMenu';

const DevicesModal = ({ onCreate, onUpdate, page }) => {
  const navigate = useNavigate();
  const { deviceId } = useParams();
  const [title, setTitle] = useState('New Device');
  const [deviceTypeVal, setDeviceTypeVal] = useState('Type');
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/devices/${deviceId}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    };
    if (deviceId) {
      fetchData();
      setTitle('Edit Device ' + deviceId);
    } else {
      setData({
        deviceType: deviceTypeVal,
        model: '',
        brand: '',
        serialNum: '',
        location: '',
        cpu: '',
        ram: '',
        os: '',
        storage: '',
        batteryLastChecked: '',
        intern: '',
        DonorId: '',
        UserId: '',
        username: '',
        password: '',
        condition: '',
        value: '',
        notes: '',
      });
    }
  }, [deviceId]);

  const onChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const submitDevice = async (e) => {
    e.preventDefault();
    let response;
    if (data.id) {
      response = await fetch(`/api/devices/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }
    if (response.ok) {
      const newData = await response.json();
      if (data.id) {
        onUpdate(newData);
      } else {
        onCreate();
      }
    }
    navigate(`/devices?page=${page}`);
  };

  return (
    <Modal show={true} onHide={() => navigate(`/devices?page=${page}`)}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {!data && (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {data && (
            <>
              <Form>
                <h5>Specs</h5>
                <Row>
                  <Col xs={18} md={4}>
                    <Form.Group>
                      <Form.Label>Device Type</Form.Label>
                      <DropdownButton
                        id="deviceType"
                        title={deviceTypeVal}
                        onSelect={(e) => {
                          setDeviceTypeVal(e);
                          onChange({ target: { name: 'deviceType', value: e } });
                        }}>
                        <Dropdown.Item eventKey="Laptop">Laptop</Dropdown.Item>
                        <Dropdown.Item eventKey="Desktop">Desktop</Dropdown.Item>
                        <Dropdown.Item eventKey="Tablet">Tablet</Dropdown.Item>
                        <Dropdown.Item eventKey="Mobile">Mobile</Dropdown.Item>
                      </DropdownButton>
                    </Form.Group>
                  </Col>
                  <Col xs={18} md={8}>
                    <DropDown
                      lookUp={onChange}
                      settings={{
                        title: 'Location',
                        id: 'LocationId',
                        labelKey: 'name',
                        placeholder: 'Select Location',
                        name: data.Location?.name,
                      }}
                      path="/api/locations"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={18} md={4}>
                    <Form.Group controlId="brand">
                      <Form.Label>Brand</Form.Label>
                      <Form.Control name="brand" autoFocus value={data.brand} onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col xs={18} md={8}>
                    <Form.Group controlId="model">
                      <Form.Label>Model</Form.Label>
                      <Form.Control name="model" autoFocus value={data.model} onChange={onChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={18} md={12}>
                    <Form.Group controlId="serialNum">
                      <Form.Label>Serial Number</Form.Label>
                      <Form.Control name="serialNum" autoFocus value={data.serialNum} onChange={onChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={18} md={6}>
                    <Form.Group controlId="cpu">
                      <Form.Label>CPU</Form.Label>
                      <Form.Control name="cpu" autoFocus value={data.cpu} onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col xs={18} md={6}>
                    <Form.Group controlId="ram">
                      <Form.Label>RAM</Form.Label>
                      <Form.Control name="ram" autoFocus value={data.ram} onChange={onChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={18} md={6}>
                    <Form.Group controlId="storage">
                      <Form.Label>Storage</Form.Label>
                      <Form.Control name="storage" autoFocus value={data.storage} onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col xs={18} md={6}>
                    <Form.Group controlId="os">
                      <Form.Label>Operating System</Form.Label>
                      <Form.Control name="os" autoFocus value={data.os} onChange={onChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <hr></hr>
                <h5>Security</h5>
                <Row>
                  <Col xs={18} md={6}>
                    <Form.Group controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control name="username" autoFocus value={data.username} onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col xs={18} md={6}>
                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control name="password" autoFocus value={data.password} onChange={onChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <hr></hr>
                <h5>Additional Information</h5>
                <Row>
                  <Col xs={18} md={12}>
                    <Form.Group>
                      <DropDown
                        lookUp={onChange}
                        settings={{ title: 'Donor', id: 'DonorId', labelKey: 'name', placeholder: 'Select donor', name: data.Donor?.name }}
                        path="/api/donors"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={18} md={6}>
                    <Form.Group controlId="condition">
                      <Form.Label>Condition</Form.Label>
                      <Form.Control name="condition" autoFocus value={data.condition} onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col xs={18} md={6}>
                    <Form.Group controlId="value">
                      <Form.Label>Value</Form.Label>
                      <Form.Control name="value" autoFocus value={data.value} onChange={onChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={18} md={6}>
                    <Form.Group controlId="intern">
                      <Form.Label>Intern</Form.Label>
                      <DropMenu
                        lookUp={onChange}
                        settings={{
                          route: 'users',
                          id: 'UserId',
                          labelKey: 'fullName',
                          placeholder: 'Select the Intern...',
                          name: data.User?.fullName,
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={18} md={6}>
                    <Form.Group controlId="batteryLastChecked">
                      <Form.Label>Battery Last Checked</Form.Label>
                      <Form.Control name="batteryLastChecked" autoFocus value={data.batteryLastChecked} onChange={onChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={18} md={12}>
                    <Form.Group controlId="notes">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control as="textarea" name="notes" autoFocus value={data.notes} rows="5" onChange={onChange} />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => navigate(`/devices?page=${page}`)}>
          Close
        </Button>
        <Button variant="primary" onClick={submitDevice}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DevicesModal.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  page: PropTypes.number,
};

export default DevicesModal;
