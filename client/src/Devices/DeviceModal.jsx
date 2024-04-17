import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';


const DeviceModal = ({ onCreate, onUpdate }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('New Device');
  const { deviceId } = useParams();
  const [data, setData] = useState({
    deviceType: '',
    model: '',
    brand: '',
    serialNum: '',
    locationName: '',
    cpu: '',
    ram: '',
    os: '',
    username: '',
    password: '',
    condition: '',
    value: '',
    notes: '',
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/devices/${deviceId}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    }
    if (deviceId) {
      fetchData();
      setTitle('Edit Device');
    }
  }, [deviceId]);

  const onChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const submitDevice = async (e) => {
    e.preventDefault();
    let response;
    if (data.id) {
      response = await fetch(`/api/devices/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch('/api/devices', {
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
        onCreate(newData);
      }
      navigate('/devices');
    }
  };

  return (
    <Modal show={true} onHide={() => navigate('/devices')}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => navigate('/devices')}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitDevice}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DeviceModal.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
};

export default DeviceModal;