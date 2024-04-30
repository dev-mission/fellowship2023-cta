import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DonorsModal = ({ onCreate, onUpdate, page }) => {
  const navigate = useNavigate();
  const { donorId } = useParams();
  const [title, setTitle] = useState('New Donor');
  const [data, setData] = useState({
    name: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/donors/${donorId}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    };

    if (donorId) {
      fetchData();
      setTitle('Edit Donor');
    }
  }, [donorId]);

  const onChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const submitDonor = async (e) => {
    e.preventDefault();
    let response;
    if (data.id) {
      response = await fetch(`/api/donors/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch('/api/donors', {
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
        onCreate();
      }
    }
    navigate(`/donors?page=${page}`);
  };

  return (
    <Modal show={true} onHide={() => navigate(`/donors?page=${page}`)}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={18} md={8}>
                <Form.Group controlId="name">
                  <Form.Label>Donor Name</Form.Label>
                  <Form.Control name="name" autoFocus value={data.name} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={18} md={4}>
                <Form.Group controlId="phone">
                  <Form.Label>Donor Phone</Form.Label>
                  <Form.Control name="phone" autoFocus value={data.phone} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="email">
                  <Form.Label>Donor Email</Form.Label>
                  <Form.Control name="email" autoFocus value={data.email} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={8}>
                <Form.Group controlId="address1">
                  <Form.Label>Address 1</Form.Label>
                  <Form.Control name="address1" autoFocus value={data.address1} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={18} md={4}>
                <Form.Group controlId="address2">
                  <Form.Label>Address 2</Form.Label>
                  <Form.Control name="address2" autoFocus value={data.address2} placeholder="Ex: Apt 1" onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={9} md={6}>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control name="city" autoFocus value={data.city} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={4.5} md={3}>
                <Form.Group controlId="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control name="state" autoFocus value={data.state} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={4.5} md={3}>
                <Form.Group controlId="zip">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control name="zip" autoFocus value={data.zip} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => navigate(`/donors?page=${page}`)}>
          Close
        </Button>
        <Button variant="primary" onClick={submitDonor}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DonorsModal.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  page: PropTypes.number,
};

export default DonorsModal;
