import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const AddDonorModal = ({ toggleAddModal, setToggleAddModal, data, setData }) => {
  const [addData, setAddData] = useState({
    name: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
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
      await fetch('/api/donors', {
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
        <Modal.Title>New Donor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={18} md={8}>
                <Form.Group controlId="name">
                  <Form.Label>Donor Name</Form.Label>
                  <Form.Control name="name" autoFocus value={addData.name} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={18} md={4}>
                <Form.Group controlId="phone">
                  <Form.Label>Donor Phone</Form.Label>
                  <Form.Control name="phone" autoFocus value={addData.phone} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="email">
                  <Form.Label>Donor Email</Form.Label>
                  <Form.Control name="email" autoFocus value={addData.email} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={8}>
                <Form.Group controlId="address1">
                  <Form.Label>Address 1</Form.Label>
                  <Form.Control name="address1" autoFocus value={addData.address1} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={18} md={4}>
                <Form.Group controlId="address2">
                  <Form.Label>Address 2</Form.Label>
                  <Form.Control name="address2" autoFocus value={addData.address2} placeholder="Ex: Apt 1" onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={9} md={6}>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control name="city" autoFocus value={addData.city} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={4.5} md={3}>
                <Form.Group controlId="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control name="state" autoFocus value={addData.state} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={4.5} md={3}>
                <Form.Group controlId="zip">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control name="zip" autoFocus value={addData.zip} onChange={onChange} />
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

AddDonorModal.propTypes = {
  toggleAddModal: PropTypes.bool,
  setToggleAddModal: PropTypes.func,
  data: PropTypes.array,
  setData: PropTypes.func,
};

export default AddDonorModal;
