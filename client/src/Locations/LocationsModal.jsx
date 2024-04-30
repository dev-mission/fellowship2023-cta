import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const LocationsModal = ({ onCreate, onUpdate, page }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('New Location');
  const { locationId } = useParams();
  const [data, setData] = useState({
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/locations/${locationId}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    };

    if (locationId) {
      fetchData();
      setTitle('Edit Location');
    }
  }, [locationId]);

  const onChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const submitLocation = async (e) => {
    e.preventDefault();
    let response;

    if (data.id) {
      response = await fetch(`/api/locations/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch('/api/locations', {
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
    navigate(`/locations?page=${page}`);
  };

  return (
    <Modal show={true} onHide={() => navigate(`/locations?page=${page}`)}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="name">
                  <Form.Label>Location Name</Form.Label>
                  <Form.Control name="name" autoFocus value={data.name} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="address1">
                  <Form.Label>Address 1</Form.Label>
                  <Form.Control name="address1" autoFocus value={data.address1} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="address2">
                  <Form.Label>Address 2</Form.Label>
                  <Form.Control name="address2" autoFocus value={data.address2} onChange={onChange} />
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
                <Form.Group controlId="zipCode">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control name="zipCode" autoFocus value={data.zipCode} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => navigate(`/locations?page=${page}`)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitLocation}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

LocationsModal.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  page: PropTypes.number,
};

export default LocationsModal;
