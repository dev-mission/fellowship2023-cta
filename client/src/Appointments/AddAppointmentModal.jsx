import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Dropdown, DropdownButton } from 'react-bootstrap';
import PropTypes from 'prop-types';

const AddAppointmentModal = ({ toggleAddModal, setToggleAddModal, data, setData }) => {
  const [status, setStatus] = useState('Status');
  const [addData, setAddData] = useState({
    client: '',
    dateTimeAt: '',
    user: '',
    phone: '',
    email: '',
    location: '',
    device: '',
    problem: '',
    status: '',
  });

  const onChange = (e) => {
    const newData = { ...addData };
    newData[e.target.name] = e.target.value;
    setAddData(newData);
  };

  const onSubmit = async (e) => {
    setToggleAddModal(false);
    setStatus('Status');
    e.preventDefault();
    try {
      await fetch('/api/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addData),
      });

      setData([...data, addData]);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <Modal show={toggleAddModal} onHide={() => setToggleAddModal(false)}>
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
                  <Form.Control name="client" autoFocus value={addData.client} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={9} md={6}>
                <Form.Group controlId="dateTimeAt">
                  <Form.Label>Date Time</Form.Label>
                  <Form.Control name="dateTimeAt" autoFocus value={addData.dateTimeAt} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="user">
                  <Form.Label>User</Form.Label>
                  <Form.Control name="user" autoFocus value={addData.user} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId='problem'>
                  <Form.Label>Problem</Form.Label>
                  <Form.Control as='textarea' name='problem' autoFocus value={addData.problem} onChange={onChange} rows={3}/>
                </Form.Group>
              </Col>
            </Row>
            <Row className='mt-3'>
              <DropdownButton id='status' title={status} onSelect={(e) => setStatus(e)}>
                <Dropdown.Item eventKey='Attended'>Attended</Dropdown.Item>
                <Dropdown.Item eventKey='No Show'>No Show</Dropdown.Item>
                <Dropdown.Item eventKey='Cancelled'>Cancelled</Dropdown.Item>
                <Dropdown.Item eventKey='Scheduled'>Scheduled</Dropdown.Item>
                <Dropdown.Item eventKey='Rescheduled'>Rescheduled</Dropdown.Item>
              </DropdownButton>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setToggleAddModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={onSubmit} type="submit">
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddAppointmentModal.propTypes = {
  toggleAddModal: PropTypes.bool,
  setToggleAddModal: PropTypes.func,
  data: PropTypes.array,
  setData: PropTypes.func,
};

export default AddAppointmentModal;
