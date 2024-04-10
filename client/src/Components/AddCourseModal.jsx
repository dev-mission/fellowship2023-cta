import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const AddCourseModal = ({ toggleAddModal, setToggleAddModal, data, setData }) => {
  const [addData, setAddData] = useState({
    name: ''
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
      await fetch('/api/courses', {
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
        <Modal.Title>New Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="name">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control name="name" autoFocus value={addData.name} onChange={onChange} />
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

AddCourseModal.propTypes = {
  toggleAddModal: PropTypes.bool,
  setToggleAddModal: PropTypes.func,
  data: PropTypes.array,
  setData: PropTypes.func,
};

export default AddCourseModal;