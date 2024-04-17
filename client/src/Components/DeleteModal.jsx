import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useParams, useNavigate, Route, Routes } from 'react-router-dom';

const DeleteModal = ({ model, onDelete }) => {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const [toggleErrorModal, setToggleErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const deleteTicket = async () => {
    const response = await fetch(`/api/${model}/${locationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      const json = await response.json();
      if (json.error === 'error') {
        setToggleErrorModal(true);
        setErrorMessage(json.message.split(' ').pop().slice(1, -2));
      } else {
        const newData = data.filter((item) => item.id !== row.original.id);
        setData(newData);
      }
    });
    const json = await response.json();
    if (json.error === 'error') {
      setErrorMessage(json.message.split(' ').pop().slice(1, -2));
      setToggleErrorModal(true);
    } else {
      onDelete(locationId);
      navigate('/locations');
    }
  };

  return (
    <>
      <Modal show={true} onHide={() => navigate('/locations')}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {model.slice(0, -1)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this {model.slice(0, -1)}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate('/locations')}>
            No
          </Button>
          <Button variant="danger" onClick={deleteTicket}>
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
