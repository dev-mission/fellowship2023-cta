import PropTypes from 'prop-types';

import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';

const EditDonorModal = ({ toggleEditModal, setToggleEditModal, data, setData, editData, setEditData }) => {
  const onChange = (e) => {
    const newData = { ...editData };
    newData[e.target.name] = e.target.value;
    setEditData(newData);
  };

  const onSubmit = async (e) => {
    setToggleEditModal(false);
    e.preventDefault();
    try {
      await fetch(`/api/Donors/${editData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      setData(data.map((donor) => (donor.id == editData.id ? { ...editData } : donor)));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal show={toggleEditModal} onHide={() => setToggleEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Donor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={18} md={8}>
                <Form.Group controlId="name">
                  <Form.Label>Donor Name</Form.Label>
                  <Form.Control name="name" autoFocus value={editData.name} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={18} md={4}>
                <Form.Group controlId="phone">
                  <Form.Label>Donor Phone</Form.Label>
                  <Form.Control name="phone" autoFocus value={editData.phone} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="email">
                  <Form.Label>Donor Email</Form.Label>
                  <Form.Control name="email" autoFocus value={editData.email} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={8}>
                <Form.Group controlId="address1">
                  <Form.Label>Address 1</Form.Label>
                  <Form.Control name="address1" autoFocus value={editData.address1} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={18} md={4}>
                <Form.Group controlId="address2">
                  <Form.Label>Address 2</Form.Label>
                  <Form.Control name="address2" autoFocus value={editData.address2} placeholder="Ex: Apt 1" onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={9} md={6}>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control name="city" autoFocus value={editData.city} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={4.5} md={3}>
                <Form.Group controlId="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control name="state" autoFocus value={editData.state} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={4.5} md={3}>
                <Form.Group controlId="zip">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control name="zip" autoFocus value={editData.zip} onChange={onChange} />
                </Form.Group>
              </Col>
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

EditDonorModal.propTypes = {
  toggleEditModal: PropTypes.bool,
  setToggleEditModal: PropTypes.func,
  data: PropTypes.array,
  setData: PropTypes.func,
  editData: PropTypes.object,
  setEditData: PropTypes.func,
};

export default EditDonorModal;
