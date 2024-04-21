import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState } from 'react';
<<<<<<< HEAD

const DeleteModal = ({ toggleDeleteModal, setToggleDeleteModal, row, data, setData, model }) => {
  const [toggleErrorModal, setToggleErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onDelete = async () => {
    setToggleDeleteModal(false);
    await fetch(`/api/${model}/${row.original.id}`, {
=======
import { useParams, useNavigate } from 'react-router-dom';

const DeleteModal = ({ model, onDelete }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [toggleErrorModal, setToggleErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const deleteTicket = async () => {
    const response = await fetch(`/api/${model}/${id}`, {
>>>>>>> main
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
<<<<<<< HEAD
    }).then(async (response) => {
      const json = await response.json();
      if (json.error === 'error') {
        setToggleErrorModal(true);
        setErrorMessage(json.message.split(' ').pop().slice(1, -2));
      } else {
        setData(data.filter((d) => d.id !== row.original.id));
      }
    });
=======
    });
    const json = await response.json();
    if (json.error === 'error') {
      setErrorMessage(json.message.split(' ').pop().slice(1, -2));
      setToggleErrorModal(true);
    } else {
      onDelete(id);
      navigate(`/${model}`);
    }
>>>>>>> main
  };

  return (
    <>
<<<<<<< HEAD
      <Modal show={toggleDeleteModal} onHide={() => setToggleDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this location?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setToggleDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={onDelete}>
=======
      <Modal show={true} onHide={() => navigate(`/${model}`)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {model.slice(0, -1)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this {model.slice(0, -1)}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate(`/${model}`)}>
            No
          </Button>
          <Button variant="danger" onClick={deleteTicket}>
>>>>>>> main
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={toggleErrorModal} onHide={() => setToggleErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{'Must remove from table in ' + errorMessage + ' page first.'}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setToggleErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DeleteModal.propTypes = {
  model: PropTypes.string,
  onDelete: PropTypes.func,
};

export default DeleteModal;
