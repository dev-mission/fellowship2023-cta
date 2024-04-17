import PropTypes from 'prop-types';
import { useState } from 'react';

import { Button, Col, Container, Form, Modal, Row, Dropdown, DropdownButton } from 'react-bootstrap';

const EditAppointmentModal = ({ toggleEditModal, setToggleEditModal, data, setData, editData, setEditData }) => {
  const onChange = (e) => {
    const newData = { ...editData };
    newData[e.target.name] = e.target.value;
    setEditData(newData);
  };

  const onSubmit = async (e) => {
    setToggleEditModal(false);
    e.preventDefault();
    try {
      await fetch(`/api/appointments/${editData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      setData(data.map((appointment) => (appointment.id == editData.id ? { ...editData } : appointment)));
    } catch (err) {
      console.log(err);
    }
  };

  console.log(editData);

  return (
    <Modal show={toggleEditModal} onHide={() => setToggleEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>New Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={9} md={6}>
                <Form.Group controlId="client">
                  <Form.Label>Client</Form.Label>
                  <Form.Control name="client" autoFocus value={editData.client} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={9} md={6}>
                <Form.Group controlId="dateTimeAt">
                  <Form.Label>Date Time</Form.Label>
                  <Form.Control name="dateTimeAt" autoFocus value={editData.dateTimeAt} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="user">
                  <Form.Label>User</Form.Label>
                  <Form.Control name="user" autoFocus value={editData.user} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="problem">
                  <Form.Label>Problem</Form.Label>
                  <Form.Control as="textarea" name="problem" autoFocus value={editData.problem} onChange={onChange} rows={3} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <DropdownButton id="status" title={`${editData.status}`} onSelect={(e) => setEditData({ ...editData, status: e })}>
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
        <Button variant="secondary" onClick={() => setToggleEditModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={onSubmit} type="submit">
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAppointmentModal;
