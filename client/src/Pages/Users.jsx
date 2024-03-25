import { useState, useEffect } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';

const columns = [
  {
    accessorKey: 'firstName',
    header: 'First',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'lastName',
    header: 'Last',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'LocationId',
    header: 'Location',
    enableColumnFilter: true,
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    enableColumnFilter: true,
    enableSorting: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableColumnFilter: true,
    enableSorting: false,
  },
];

const Filters = ({ columnFilters, setColumnFilters }) => {
  const userName = columnFilters.find((f) => f.id === 'firstName')?.value || '';

  const onFilterChange = (id, value) => setColumnFilters((prev) => prev.filter((f) => f.id !== id).concat({ id, value }));

  return (
    <form className="d-flex" role="search">
      <div className="input-group">
        <span className="input-group-text" id="basic-addon1">
          <i className="bi bi-search" />
        </span>
        <input
          type="search"
          className="form-control me-2"
          placeholder="Search Users"
          value={userName}
          onChange={(e) => onFilterChange('firstName', e.target.value)}
        />
      </div>
    </form>
  );
};

Filters.propTypes = {
  columnFilters: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, value: PropTypes.string })).isRequired,
  setColumnFilters: PropTypes.func.isRequired,
};

const UserTable = ({ table }) => {
  return (
    <table className="table mt-5">
      <thead className="table-primary">
        <tr>
          {table.getHeaderGroups()[0].headers.map((header) => (
            <th scope="col" key={header.id}>
              {header.column.columnDef.header}
              {header.column.getCanSort() && <i className="ms-2 bi bi-arrow-down-up" onClick={header.column.getToggleSortingHandler()} />}
            </th>
          ))}
          <th scope="col">
            <i className="bi bi-pencil-square" />
          </th>
          <th scope="col">
            <i className="bi bi-trash-fill" />
          </th>
        </tr>
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
            <td>
              <i className="bi bi-pencil" />
            </td>
            <td>
              <i className="bi bi-x-lg" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

UserTable.propTypes = {
  table: PropTypes.shape({
    getHeaderGroups: PropTypes.func.isRequired,
    getRowModel: PropTypes.func.isRequired,
  }).isRequired,
};

const UserModal = ({ toggleModal, setToggleModal }) => {
  const [check, setCheck] = useState(false);
  // const [data, setData] = useState({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   role: '',
  //   location: '',
  // });

  return (
    <Modal show={toggleModal} onHide={() => setToggleModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={9} md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="name" autoFocus />
                </Form.Group>
              </Col>
              <Col xs={9} md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="name" autoFocus />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8}>
                <Form.Group controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" autoFocus />
                </Form.Group>
              </Col>
              <Col xs={6} md={4}>
                <Form.Group controlId="role">
                  <Form.Label>Role</Form.Label>
                  <Form.Control type="name" autoFocus />
                </Form.Group>
              </Col>
            </Row>
            <Row className="d-flex align-items-end">
              <Col xs={12} md={8}>
                <Form.Group controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control type="name" autoFocus />
                </Form.Group>
              </Col>
              <Col xs={6} md={4}>
                <Form.Check type="switch" id="custom-switch" label="Admin" checked={check} onChange={() => setCheck(!check)} />
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setToggleModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => setToggleModal(false)}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

UserModal.propTypes = {
  toggleModal: PropTypes.bool.isRequired,
  setToggleModal: PropTypes.func.isRequired,
};

const Users = () => {
  const [data, setData] = useState();
  const [columnFilters, setColumnFilters] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <main className="container">
      <div className="d-flex justify-content-between align-items-center mt-5">
        <button type="button" className="btn btn-primary d-flex align-items-center" onClick={() => setToggleModal(true)}>
          New <i className="bi bi-plus-lg" />
        </button>
        <UserModal toggleModal={toggleModal} setToggleModal={setToggleModal} />
        <i className="bi bi-person-fill">Users</i>
        <Filters columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
      </div>
      <UserTable table={table} />
      <p>
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </p>
      <div className="btn-group" role="group">
        <button type="button" className="btn btn-primary" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </button>
        <button type="button" className="btn btn-primary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </button>
      </div>
    </main>
  );
};

export default Users;
