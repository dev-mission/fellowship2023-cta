import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';


const ClientModal = ({ onCreate, onUpdate }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('New Client');
  const { clientId } = useParams();
  const [data, setData] = useState({
    firstName: ' ',
    lastName: ' ',
    age: '',
    phone: '',
    email: '',
    ethnicity: '',
    address: '',
    gender: '',
    language: '',
    updatedAt: DateTime.now().toISODate(),
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/clients/${clientId}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    }
    if (clientId) {
      fetchData();
      setTitle('Edit Client');
    }
  }, [clientId]);

  const onChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const submitClient = async (e) => {
    e.preventDefault();
    let response;
    if (data.id) {
      response = await fetch(`/api/clients/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch('/api/clients', {
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
      newData['updatedAt'] = DateTime.fromISO(newData['updatedAt']).toLocaleString();
      if (data.id) {
        onUpdate(newData);
      } else {
        onCreate(newData);
      }
      navigate('/clients');
    }
  };

  return (
    <Modal show={true} onHide={() => navigate('/clients')}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row className="d-flex align-items-end">
              <Col xs={12} md={8}>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control name="firstName" value={data.firstName || ''} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control name="lastName" value={data.lastName || ''} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="age">
                  <Form.Label>Age</Form.Label>
                  <Form.Control name="age" value={data.age} type="integer" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control name="phone" value={data.phone} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" value={data.email} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="ethinicity">
                  <Form.Label>Ethnicity</Form.Label>
                  <Form.Control name="ethnicity" value={data.ethnicity} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control name="address" value={data.address} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="gender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control name="gender" value={data.gender} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="language">
                  <Form.Label>Language</Form.Label>
                  <Form.Control name="language" value={data.language} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="updatedAt">
                  <Form.Label>Date</Form.Label>
                  <Form.Control name="updatedAt" value={DateTime.fromISO(data.updatedAt).toISODate()} type="date" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => navigate('/clients')}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitClient}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ClientModal.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
};

export default ClientModal;