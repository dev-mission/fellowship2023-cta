import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, FormControl, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import Dropdown from '../Components/DropDown';
import DropMenu from '../Components/DropMenu';

Charger.propTypes = {
  onChange: PropTypes.func.isRequired,
};

function Charger({ onChange }) {
  const [message, setMessage] = useState('No');
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.value === 'true') {
      setMessage('Yes');
      onChange({ target: { name: 'hasCharger', value: true } });
    } else {
      setMessage('No');
      onChange({ target: { name: 'hasCharger', value: false } });
    }
  };

  return (
    <>
      <Form.Group>
        <Form.Label>Charger: {message}</Form.Label>
      </Form.Group>
      <Button variant="primary" name="hasCharger" value={true} onClick={handleChange}>
        Yes
      </Button>{' '}
      <Button variant="primary" name="hasCharger" value={false} onClick={handleChange}>
        No
      </Button>
    </>
  );
}

const TicketModal = ({ onCreate, onUpdate, page }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('New Ticket');
  const { ticketId } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/tickets/${ticketId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data.Client.fullName);
        setData(data);
      }
    }
    if (ticketId) {
      fetchData();
      setTitle(`Edit Ticket ${ticketId}`);
    } else {
      setData({
        ClientId: null,
        LocationId: null,
        serialNumber: ' ',
        device: ' ',
        problem: '',
        troubleshooting: '',
        resolution: '',
        dateOn: DateTime.now().toISODate(),
        timeInAt: '',
        timeOutAt: '',
        hasCharger: false,
        notes: '',
        timeZone: DateTime.local().zoneName,
      });
    }
  }, [ticketId]);

  const onChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const submitTicket = async (e) => {
    e.preventDefault();
    let response;
    console.log(data);
    if (data.id) {
      response = await fetch(`/api/tickets/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch('/api/tickets', {
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
      navigate(`/tickets?page=${page}`);
    }
  };

  return (
    <Modal show={true} onHide={() => navigate(`/tickets?page=${page}`)}>
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
                <Row>
                  <Col xs={9} md={6}>
                    <Form.Group controlId="clientName">
                      <Form.Label>Client Look Up</Form.Label>
                      <DropMenu
                        lookUp={onChange}
                        settings={{
                          route: 'clients',
                          id: 'ClientId',
                          labelKey: 'fullName',
                          placeholder: 'Choose a client...',
                          name: data.Client?.fullName,
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={9} md={6}>
                    <Dropdown
                      lookUp={onChange}
                      settings={{
                        title: 'Location',
                        id: 'LocationId',
                        labelKey: 'name',
                        placeholder: 'Choose an location...',
                        name: data.Location?.name,
                      }}
                      path="/api/locations"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={9} md={6}>
                    <Form.Group controlId="device">
                      <Form.Label>Device</Form.Label>
                      <Form.Control name="device" value={data.device || ''} type="text" autoFocus onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col xs={9} md={6}>
                    <Form.Group controlId="serialNumber">
                      <Form.Label>Serial Number</Form.Label>
                      <Form.Control name="serialNumber" value={data.serialNumber || ''} type="text" autoFocus onChange={onChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={18} md={12}>
                    <Form.Group controlId="problem">
                      <Form.Label>Problem</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="problem"
                        autoFocus
                        value={data.problem || ''}
                        type="text"
                        onChange={onChange}
                        rows={3}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={18} md={12}>
                    <Form.Group controlId="troubleshooting">
                      <Form.Label>Troubleshooting</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="troubleshooting"
                        value={data.troubleshooting || ''}
                        type="text"
                        autoFocus
                        onChange={onChange}
                        rows={3}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Col xs={18} md={12}>
                  <Form.Group controlId="resolution">
                    <Form.Label>Resolution</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="resolution"
                      value={data.resolution || ''}
                      type="text"
                      autoFocus
                      onChange={onChange}
                      rows={3}
                    />
                  </Form.Group>
                </Col>
                <Row>
                  <Col xs={9} md={6}>
                    <Form.Group controlId="Date">
                      <Form.Label>Date</Form.Label>
                      <Form.Control name="dateOn" value={data.dateOn} type="date" autoFocus onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col xs={9} md={6}>
                    <Charger onChange={onChange}></Charger>
                  </Col>
                </Row>
                <Row>
                  <Col xs={9} md={6}>
                    <Form.Group controlId="timeInAt">
                      <Form.Label>Time Started: </Form.Label>
                      <FormControl name="timeInAt" value={data.timeInAt} type="time" onChange={onChange}></FormControl>
                    </Form.Group>
                  </Col>
                  <Col xs={9} md={6}>
                    <Form.Group controlId="timeOutAt">
                      <Form.Label>Time Finished: </Form.Label>
                      <FormControl name="timeOutAt" value={data.timeOutAt} type="time" onChange={onChange}></FormControl>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={18} md={12}>
                    <Form.Group controlId="notes">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="notes"
                        value={data.notes || ''}
                        type="text"
                        autoFocus
                        onChange={onChange}
                        rows={3}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => navigate(`/tickets?page=${page}`)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitTicket}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

TicketModal.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  page: PropTypes.number,
};

export default TicketModal;
