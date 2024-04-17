import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Dropdown, DropdownButton } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import DropDown from '../Components/DropDown';

const ClientDropMenu = ({ lookUp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState();

  const handleSearch = (query) => {
    setIsLoading(true);

    fetch(`/api/clients/search/${query}`).then((resp) => resp.json()).then((items) => {
      setOptions(items);
      setIsLoading(false);
    });
  };

  return (
    <AsyncTypeahead
      filterBy={() => true}
      id='search-clients'
      isLoading={isLoading}
      attribute='fullName'
      onSearch={handleSearch}
      options={options}
      onChange={value => {
        lookUp({ target: {name: 'ClientId', value: value[0]?.id} });
      }}
      placeholder="Search for clients..."
      renderMenuItemChildren={option => (
        <span name="ClientId" value={option.id}>
          {option.fullName}
        </span>
      )}
    />
  )
}

const AppointmentsModal = ({ onCreate, onUpdate }) => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [title, setTitle] = useState('New Appointment')
  const [status, setStatus] = useState('Status');
  const [data, setData] = useState({
    ClientId: '',
    dateTimeAt: '',
    UserId: '',
    phone: '',
    email: '',
    LocationId: '',
    problem: '',
    status: '',
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
              <Col xs={9} md={6}>
                <Form.Group controlId="clientName">
                  <Form.Label>Client Look Up</Form.Label>
                  <ClientDropMenu lookUp={onChange} />
                </Form.Group>
              </Col>
              <Col xs={9} md={6}>
                <Form.Group controlId="dateTimeAt">
                  <Form.Label>Date Time</Form.Label>
                  <Form.Control name="dateTimeAt" autoFocus value={data.dateTimeAt} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={9} md={6}>
                <Form.Group controlId="user">
                  <Form.Label>User</Form.Label>
                  <Form.Control name="user" autoFocus value={data.user} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={9} md={6}>
                <DropDown
                  lookUp={onChange}
                  settings={{ title: 'Location', id: 'LocationId', attribute: 'name', placeholder: 'Select Location'}}
                  path='/api/locations'
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
        <Button variant="primary" onClick={submitAppointment} type="submit">
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

AppointmentsModal.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
};

export default AppointmentsModal;