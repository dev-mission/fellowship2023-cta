import PropTypes from 'prop-types';

import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';

const EditCourseModal = ({ toggleEditModal, setToggleEditModal, data, setData, editData, setEditData }) => {
  const onChange = (e) => {
    const newData = { ...editData };
    newData[e.target.name] = e.target.value;
    setEditData(newData);
  };

  const onSubmit = async (e) => {
    setToggleEditModal(false);
    e.preventDefault();
    try {
      await fetch(`/api/courses/${editData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      setData(data.map((course) => (course.id == editData.id ? { ...editData } : course)));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal show={toggleEditModal} onHide={() => setToggleEditModal(false)}>
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
                  <Form.Control name="name" autoFocus value={editData.name} onChange={onChange} />
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

EditCourseModal.propTypes = {
  toggleEditModal: PropTypes.bool,
  setToggleEditModal: PropTypes.func,
  data: PropTypes.array,
  setData: PropTypes.func,
  editData: PropTypes.object,
  setEditData: PropTypes.func,
};

export default EditCourseModal;
