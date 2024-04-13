import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState } from 'react';

const DeleteModal = ({ toggleDeleteModal, setToggleDeleteModal, row, data, setData, model }) => {
  const [toggleErrorModal, setToggleErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onDelete = async () => {
    setToggleDeleteModal(false);
    await fetch(`/api/${model}/${row.original.id}`, {
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
  };

  return (
    <>
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
  toggleDeleteModal: PropTypes.bool,
  setToggleDeleteModal: PropTypes.func,
  row: PropTypes.object,
  data: PropTypes.array,
  setData: PropTypes.func,
  model: PropTypes.string,
};

export default DeleteModal;
