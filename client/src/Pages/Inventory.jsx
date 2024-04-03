import { useState, useEffect } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  // getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';

const columns = [
  
  {
    accessorKey: 'id',
    header: 'Device#',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'deviceType',
    header: 'Device Type',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'model',
    header: 'model',
    enableColumnFilter: false,
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'serialNum',
    header: 'S/N',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'cpu',
    header: 'CPU',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'ram',
    header: 'RAM',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'os',
    header: 'OS',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'username',
    header: 'Username',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'password',
    header: 'Password',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'condition',
    header: 'Condition',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'value',
    header: 'Value',
    enableColumnFilter: true,
  },
];

const Filters = ({ setColumnFilters }) => {
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
          placeholder="Search Devices"
          onChange={(e) => onFilterChange('name', e.target.value)}
        />
      </div>
    </form>
  );
};

Filters.propTypes = {
  setColumnFilters: PropTypes.func.isRequired,
};

const DeleteModal = ({ toggleDeleteModal, setToggleDeleteModal, row, data, setData }) => {
  const onDelete = async () => {
    setToggleDeleteModal(false);
    try {
      await fetch(`/api/devices/${row.original.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setData(data.filter((d) => d.id !== row.original.id));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal show={toggleDeleteModal} onHide={() => setToggleDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this device?</Modal.Body>
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
  toggleDeleteModal: PropTypes.bool.isRequired,
  setToggleDeleteModal: PropTypes.func.isRequired,
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number,
    }),
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  setData: PropTypes.func.isRequired,
};

const DeviceTable = ({ table, data, setData, setToggleDeviceModal }) => {
  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
  const [propRow, setPropRow] = useState({});

  const onDelete = (row) => (e) => {
    try {
      setToggleDeleteModal(true);
      setPropRow(row);
    } catch (err) {
      console.log(err);
      console.log(e);
    }
  };

  const onEdit = (row) => (e) => {
    try {
      setToggleDeviceModal(true);
      setPropRow(row);
    } catch (err) {
      console.log(err);
      console.log(e);
    }
  };

  return (
    <>
      <table className="table mt-5">
        <thead className="table-primary">
          <tr>
            {table.getHeaderGroups()[0].headers.map((header) => (
              <th scope="col" key={header.id}>
                {header.column.columnDef.header}
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
                <i className="bi bi-pencil" onClick={onEdit(row)}/>
              </td>
              <td>
                <i className="bi bi-x-lg" onClick={onDelete(row)}  />
              </td>
            </tr>
          ))}
        </tbody>
        <DeleteModal
          toggleDeleteModal={toggleDeleteModal}
          setToggleDeleteModal={setToggleDeleteModal}
          row={propRow}
          isRequired
          data={data}
          setData={setData}
        />
        <DeviceModal row={propRow} />
      </table>
    </>
  );
};

DeviceTable.propTypes = {
  table: PropTypes.shape({
    getHeaderGroups: PropTypes.func.isRequired,
    getRowModel: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  setData: PropTypes.func.isRequired,
  setToggleDeviceModal: PropTypes.func.isRequired,
};

const DeviceModal = ({ toggleDeviceModal, setToggleDeviceModal, data, setData }) => {

/*
"deviceType": "Laptop",
      "model": "MacBook Pro",
      "brand": "Apple",
      "serialNum": "1234567890",
      "cpu": "Intel Core i7",
      "ram": "16GB",
      "os": "MacOS",
      "username": "admin",
      "password": "admin",
      "condition": "Good",
      "value": "1000.00",
      "notes": "This is a test device."

*/

  const [addData, setAddData] = useState({
    deviceType: '',
    model: '',
    brand: '',
    serialNum: '',
    cpu: '',
    ram: '',
    os: '',
    username: '',
    password: '',
    condition: '',
    value: '',
    notes: '',
  });

  const onChange = (e) => {
    const newData = { ...addData };
    newData[e.target.name] = e.target.value;
    setAddData(newData);
    console.log(addData);
  };

  const onSubmit = async (e) => {
    setToggleDeviceModal(false);
    e.preventDefault();
    try {
      await fetch('/api/devices', {
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
    <Modal show={toggleDeviceModal} onHide={() => setToggleDeviceModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>New Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={18} md={8}>
                <Form.Group controlId="name">
                  <Form.Label>Device Name</Form.Label>
                  <Form.Control name="name" autoFocus value={addData.name} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={18} md={4}>
                <Form.Group controlId="phone">
                  <Form.Label>Device Phone</Form.Label>
                  <Form.Control name="phone" autoFocus value={addData.phone} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={18} md={12}>
                <Form.Group controlId="email">
                  <Form.Label>Device Email</Form.Label>
                  <Form.Control name="email" autoFocus value={addData.email} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={18} md={8}>
                <Form.Group controlId="address1">
                  <Form.Label>Address 1</Form.Label>
                  <Form.Control name="address1" autoFocus value={addData.address1} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={18} md={4}>
                <Form.Group controlId="address2">
                  <Form.Label>Address 2</Form.Label>
                  <Form.Control name="address2" autoFocus value={addData.address2} placeholder="Ex: Apt 1" onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={9} md={6}>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control name="city" autoFocus value={addData.city} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={4.5} md={3}>
                <Form.Group controlId="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control name="state" autoFocus value={addData.state} onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={4.5} md={3}>
                <Form.Group controlId="zip">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control name="zip" autoFocus value={addData.zip} onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setToggleDeviceModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={onSubmit} type="submit">
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DeviceModal.propTypes = {
  toggleDeviceModal: PropTypes.bool.isRequired,
  setToggleDeviceModal: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  setData: PropTypes.func.isRequired,
  row: PropTypes.object,
};

const Devices = () => {
  const [data, setData] = useState();
  const [columnFilters, setColumnFilters] = useState([]);
  const [toggleDeviceModal, setToggleDeviceModal] = useState(false);

  useEffect(() => {
    fetch('/api/devices')
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      columnFilters,
      data,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <main className="container">
      <div className="d-flex justify-content-between align-items-center mt-5">
        <button type="button" className="btn btn-primary d-flex align-items-center" onClick={() => setToggleDeviceModal(true)}>
          New <i className="bi bi-plus-lg" />
        </button>
        <DeviceModal
          toggleDeviceModal={toggleDeviceModal}
          setToggleDeviceModal={setToggleDeviceModal}
          data={data}
          setData={setData}
        />
        <i className="bi title-icon bi-card-checklist">Devices</i>
        <Filters setColumnFilters={setColumnFilters} />
      </div>
      <DeviceTable table={table} data={data} setData={setData} setToggleDeviceModal={setToggleDeviceModal}/>
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

export default Devices;