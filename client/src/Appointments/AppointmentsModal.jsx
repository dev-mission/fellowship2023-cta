import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Dropdown, DropdownButton } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DropDown from '../Components/DropDown';
import DropMenu from '../Components/DropMenu';
import TimeRange from '../Components/TimeRange';
import { DateTime } from 'luxon';

const AppointmentsModal = ({ onCreate, onUpdate }) => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [title, setTitle] = useState('New Appointment');
  const [status, setStatus] = useState('Status');
  const [data, setData] = useState({
    ClientId: '',
    dateOn: DateTime.now().toISODate(),
    timeInAt: '',
    timeOutAt: '',
    UserId: '',
    phone: '',
    email: '',
    LocationId: '',
    problem: '',
    status: status,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    };

    if (appointmentId) {
      fetchData();
      setTitle('Edit Appointment');
    }
  }, [appointmentId]);

  const onChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const submitAppointment = async (e) => {
    e.preventDefault();
    let response;

    if (data.id) {
      response = await fetch(`/api/appointments/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }

    if (response.ok) {
      const newData = await response.json();
      newData['createdAt'] = DateTime.fromISO(newData['createdAt']).toLocaleString();
      if (data.id) {
        onUpdate(newData);
      } else {
        onCreate(newData);
      }
    }
    navigate('/appointments');
  };

  return (
    <Modal show={true} onHide={() => navigate('/appointments')}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="clientName">
                  <Form.Label>Client Look Up</Form.Label>
                  <DropMenu
                    lookUp={onChange}
                    settings={{ route: 'clients', id: 'ClientId', labelKey: 'fullName', placeholder: 'Choose a client...' }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={4}>
                <Form.Group controlId="Date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control name="dateOn" value={DateTime.fromISO(data.dateOn).toISODate()} type="date" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={6} md={4}>
                <Form.Group controlId="timeInAt">
                  <Form.Label>Start: {DateTime.fromISO(data.timeInAt).toISOTime()}</Form.Label>
                  <TimeRange name="timeInAt" date={data.dateOn} change={onChange}></TimeRange>
                </Form.Group>
              </Col>
              <Col xs={6} md={4}>
                <Form.Group controlId="endTime">
                  <Form.Label>End: {DateTime.fromISO(data.timeOutAt).toISOTime()}</Form.Label>
                  <TimeRange name="endTime" date={data.dateOn} change={onChange}></TimeRange>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={9} md={6}>
                <Form.Group controlId="userName">
                  <Form.Label>User Look Up</Form.Label>
                  <DropMenu
                    lookUp={onChange}
                    settings={{ route: 'users', id: 'UserId', labelKey: 'fullName', placeholder: 'Choose a user...' }}
                  />
                </Form.Group>
              </Col>
              <Col xs={9} md={6}>
                <DropDown
                  lookUp={onChange}
                  settings={{ title: 'Location', id: 'LocationId', labelKey: 'name', placeholder: 'Select Location' }}
                  path="/api/locations"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="problem">
                  <Form.Label>Problem</Form.Label>
                  <Form.Control as="textarea" name="problem" autoFocus value={data.problem} onChange={onChange} rows={3} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <DropdownButton id="status" title={status} onSelect={(e) => setStatus(e)}>
                <Dropdown.Item eventKey="Attended">Attended</Dropdown.Item>
                <Dropdown.Item eventKey="No Show">No Show</Dropdown.Item>
                <Dropdown.Item eventKey="Cancelled">Cancelled</Dropdown.Item>
                <Dropdown.Item eventKey="Scheduled">Scheduled</Dropdown.Item>
                <Dropdown.Item eventKey="Rescheduled">Rescheduled</Dropdown.Item>
              </DropdownButton>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => navigate('/appointments')}>
          Close
        </Button>
        <Button variant="primary" onClick={submitAppointment}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AppointmentsModal.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
};

export default AppointmentsModal;
