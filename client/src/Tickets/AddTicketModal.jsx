import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
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
  stateChange: PropTypes.func.isRequired,
};

function Charger({ stateChange }) {
  const [message, setMessage] = useState('No');
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.value === 'true') {
      setMessage('Yes');
      stateChange({ target: { name: 'hasCharger', value: true } });
    } else {
      setMessage('No');
      stateChange({ target: { name: 'hasCharger', value: false } });
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

const AddTicketModel = ({ update, data, stateChange, toggleUserModal, setToggleUserModal }) => {
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
      update(ticket);
    });

    setToggleUserModal(false);
  };

  return (
    <Modal show={toggleUserModal} onHide={() => setToggleUserModal(false)}>
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
                  <ClientDropMenu lookUp={stateChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="d-flex align-items-end">
              <Col xs={12} md={8}>
                <Dropdown
                  lookUp={stateChange}
                  settings={{ title: 'Location', id: 'LocationId', labelKey: 'name', placeholder: 'Choose an location...' }}
                  path="/api/locations"
                />
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="serialNumber">
                  <Form.Label>Serial Number</Form.Label>
                  <Form.Control name="serialNumber" value={data.serialNumber} type="text" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="device">
                  <Form.Label>Device</Form.Label>
                  <Form.Control name="device" value={data.device} type="text" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="problem">
                  <Form.Label>Problem</Form.Label>
                  <Form.Control name="problem" value={data.problem} type="text" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="troubleshooting">
                  <Form.Label>Troubleshooting</Form.Label>
                  <Form.Control name="troubleshooting" value={data.troubleshooting} type="text" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="resolution">
                  <Form.Label>Resolution</Form.Label>
                  <Form.Control name="resolution" value={data.resolution} type="text" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="Date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control name="dateOn" value={data.dateOn} type="date" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="timeInAt">
                  <Form.Label>Time Started</Form.Label>
                  <TimeRange name="timeInAt" date={data.dateOn} change={stateChange}></TimeRange>
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="timeOutAt">
                  <Form.Label>Time Finished</Form.Label>
                  <TimeRange name="timeOutAt" date={data.dateOn} change={stateChange}></TimeRange>
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Charger stateChange={stateChange}></Charger>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="notes">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control name="notes" value={data.notes} type="text" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setToggleUserModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={submitTicket}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddTicketModel.propTypes = {
  toggleUserModal: PropTypes.bool.isRequired,
  setToggleUserModal: PropTypes.func.isRequired,
  stateChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
};

export default AddTicketModel;
