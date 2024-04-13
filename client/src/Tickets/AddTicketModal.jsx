import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import Dropdown from '../Components/DropDown';
import TimeRange from '../Components/TimeRange';

ClientDropMenu.propTypes = {
  lookUp: PropTypes.func.isRequired,
};

function ClientDropMenu({ lookUp }) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState();

  const handleSearch = (query) => {
    setIsLoading(true);

    fetch(`/api/clients/search/${query}`)
      .then((resp) => resp.json())
      .then((items) => {
        setOptions(items);
        setIsLoading(false);
      });
  };
  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  return (
    <AsyncTypeahead
      filterBy={filterBy}
      id="search-clients"
      isLoading={isLoading}
      labelKey="fullName"
      onSearch={handleSearch}
      options={options}
      onChange={(value) => {
        lookUp({ target: { name: 'ClientId', value: value[0]?.id } });
      }}
      placeholder="Search for a clients..."
      renderMenuItemChildren={(option) => (
        <>
          <span name="ClientId" value={option.id}>
            {option.fullName}
          </span>
        </>
      )}
    />
  );
}

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
        <Form.Label>Charger: </Form.Label>
        <Form.Label>{message}</Form.Label>
      </Form.Group>
      <Button name="hasCharger" value={true} onSubmit={(e) => e.preventDefault()} onClick={handleChange}>
        Yes
      </Button>
      <Button name="hasCharger" value={false} onClick={handleChange}>
        No
      </Button>
    </>
  );
}

const AddTicketModal = ({ onCreate }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    ClientId: null,
    LocationId: null,
    UserId: null,
    serialNumber: '',
    device: '',
    problem: '',
    troubleshooting: '',
    resolution: '',
    dateOn: DateTime.now().toISODate(),
    timeInAt: '',
    timeOutAt: '',
    hasCharger: false,
    notes: '',
  });

  const onChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const submitTicket = async (e) => {
    e.preventDefault();
    const result = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    result.json().then((ticket) => {
      ticket['createdAt'] = DateTime.fromISO(ticket['createdAt']).toLocaleString();
      onCreate(ticket);
    });

    navigate('/tickets');
  };

  return (
    <Modal show={true} onHide={() => navigate('/tickets')}>
      <Modal.Header closeButton>
        <Modal.Title>New Ticket</Modal.Title>
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
            </Row>
            <Row className="d-flex align-items-end">
              <Col xs={12} md={8}>
                <Dropdown
                  lookUp={onChange}
                  settings={{ title: 'Location', id: 'LocationId', labelKey: 'name', placeholder: 'Choose an location...' }}
                  path="/api/locations"
                />
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="serialNumber">
                  <Form.Label>Serial Number</Form.Label>
                  <Form.Control name="serialNumber" value={data.serialNumber} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="device">
                  <Form.Label>Device</Form.Label>
                  <Form.Control name="device" value={data.device} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="problem">
                  <Form.Label>Problem</Form.Label>
                  <Form.Control name="problem" value={data.problem} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="troubleshooting">
                  <Form.Label>Troubleshooting</Form.Label>
                  <Form.Control name="troubleshooting" value={data.troubleshooting} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="resolution">
                  <Form.Label>Resolution</Form.Label>
                  <Form.Control name="resolution" value={data.resolution} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="Date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control name="dateOn" value={data.dateOn} type="date" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="timeInAt">
                  <Form.Label>Time Started</Form.Label>
                  <TimeRange name="timeInAt" date={data.dateOn} change={onChange}></TimeRange>
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="timeOutAt">
                  <Form.Label>Time Finished</Form.Label>
                  <TimeRange name="timeOutAt" date={data.dateOn} change={onChange}></TimeRange>
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Charger onChange={onChange}></Charger>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="notes">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control name="notes" value={data.notes} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => navigate('/tickets')}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitTicket}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddTicketModal.propTypes = {
  onCreate: PropTypes.func.isRequired,
};

export default AddTicketModal;
