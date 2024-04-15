import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DeleteModal = ({ model, onDelete }) => {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const [errorMessage, setErrorMessage] = useState('');

  const deleteTicket = async () => {
    await fetch(`/api/${model}/${locationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      const json = await response.json();
      if (json.error === 'error') {
        setErrorMessage(json.message.split(' ').pop().slice(1, -2));
        navigate('/error');
      } else {
        onDelete(locationId);
      }
    });
  };

  return (
    <>
      <Modal show={true} onHide={navigate('/locations')}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this {model.slice(0, -1)}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate('/locations') }>
            No
          </Button>
          <Button variant="danger" onClick={deleteTicket}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Route path='error' element={ 
        <Modal show={true} onHide={() => navigate('/locations')}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{'Must remove from table in ' + errorMessage + ' page first.'}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => navigate('/locations')}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        }>
      </Route>
    </>
  );
};

DeleteModal.propTypes = {
  model: PropTypes.string,
  onDelete: PropTypes.func,
};

export default DeleteModal;
