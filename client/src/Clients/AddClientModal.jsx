import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const AddClientModal = ({ toggleAddModal, setToggleAddModal, data, setData }) => {
  const [addData, setAddData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    email: '',
    ethnicity: '',
    address: '',
    gender: '',
    language: '',
  });

  const onChange = (e) => {
    const newData = { ...addData };
    newData[e.target.name] = e.target.value;
    setAddData(newData);
  };

  const onSubmit = async (e) => {
    setToggleAddModal(false);
    e.preventDefault();
    try {
      await fetch('/api/clients', {
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
        <Modal.Title>New Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={9} md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label>Client First Name</Form.Label>
                  <Form.Control name="firstName" autoFocus value={addData.name} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={9} md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label>Client Last Name</Form.Label>
                  <Form.Control name="lastName" autoFocus value={addData.address1} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control name="phone" autoFocus value={addData.address2} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" autoFocus value={addData.address2} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control name="adress" autoFocus value={addData.address2} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={4.5} md={3}>
                <Form.Group controlId="age">
                  <Form.Label>Age</Form.Label>
                  <Form.Control name="age" autoFocus value={addData.state} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={4.5} md={3}>
                <Form.Group controlId="gender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control name="gender" autoFocus value={addData.zipCode} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={9} md={6}>
                <Form.Group controlId="ethnicity">
                  <Form.Label>Ethnicity</Form.Label>
                  <Form.Control name="ethnicity" autoFocus value={addData.city} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="language">
                  <Form.Label>Language</Form.Label>
                  <Form.Control name="language" autoFocus value={addData.address2} onChange={onChange} />
                </Form.Group>
              </Col>
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

AddClientModal.propTypes = {
  toggleAddModal: PropTypes.bool,
  setToggleAddModal: PropTypes.func,
  data: PropTypes.array,
  setData: PropTypes.func,
};

export default AddClientModal;
