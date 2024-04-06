import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DeleteModal = ({ toggleDeleteModal, setToggleDeleteModal, row, data, setData, model }) => {
  const onDelete = async () => {
    setToggleDeleteModal(false);
    try {
      await fetch(`/api/${model}/${row.original.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setData(data.filter((d) => d.id !== row.original.id));
    } catch (err) {
      console.log(err);
    }
  };

  console.log(row);

  return (
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
