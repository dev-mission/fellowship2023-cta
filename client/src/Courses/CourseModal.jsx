import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

const CourseModal = ({ onCreate, onUpdate }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('New Course');
  const { courseId } = useParams();
  const [data, setData] = useState({
    name: ' ',
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    }
    if (courseId) {
      fetchData();
      setTitle('Edit Course');
    }
  }, [courseId]);

  const onChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const submitCourse = async (e) => {
    e.preventDefault();
    let response;
    if (data.id) {
      response = await fetch(`/api/courses/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch('/api/courses', {
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
      navigate('/courses');
    }
  };

  return (
    <Modal show={true} onHide={() => navigate('/courses')}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row className="d-flex align-items-end">
              <Col xs={12} md={8}>
                <Form.Group controlId="name">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control name="name" value={data.name || ''} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => navigate('/courses')}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitCourse}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

CourseModal.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
};

export default CourseModal;
