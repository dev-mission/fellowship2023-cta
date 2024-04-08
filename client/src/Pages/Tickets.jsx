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
import { DateTime } from 'luxon';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useAuthContext } from '../AuthContext';
import Dropdown from '../Components/DropDown';
import TimeRange from '../Components/TimeRange';
const columns = [
  {
    accessorKey: 'id',
    header: 'Ticket #',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'Client.fullName',
    header: 'Client',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'Location.name',
    header: 'Location',
    enableColumnFilter: true,
    enableSorting: false,
  },
  {
    accessorKey: 'User.fullName',
    header: 'CTA Assigned',
    enableColumnFilter: true,
    enableSorting: false,
  },
  {
    accessorKey: 'device',
    header: 'Device',
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: 'problem',
    header: 'Problem',
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Met',
    enableColumnFilter: true,
    enableSorting: true,
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
          placeholder="Search Users"
          onChange={(e) => onFilterChange('firstName', e.target.value)}
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
      await fetch(`/api/ticket/${row.original.id}`, {
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
        <Modal.Title>Delete User</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
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
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  setData: PropTypes.func.isRequired,
};

const TicketTable = ({ table, data, setData }) => {
  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);

  return (
    <>
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
                <i className="bi bi-x-lg" onClick={() => setToggleDeleteModal(true)} />
              </td>
              <DeleteModal
                toggleDeleteModal={toggleDeleteModal}
                setToggleDeleteModal={setToggleDeleteModal}
                row={row}
                data={data}
                setData={setData}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

TicketTable.propTypes = {
  table: PropTypes.shape({
    getHeaderGroups: PropTypes.func.isRequired,
    getRowModel: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  setData: PropTypes.func.isRequired,
};

ClientDropMenu.propTypes = {
  setData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

function ClientDropMenu({ setData, data }) {
  const [isLoading, setIsLoading] = useState(false);
  const [singleSelections, setSingleSelections] = useState([]);
  const [options, setOptions] = useState();

  const handleSearch = (query) => {
    setIsLoading(true);

    fetch(`/api/clients/search/${query}`)
      .then((resp) => resp.json())
      .then((items) => {
        setOptions(items);
        setIsLoading(false);
      });
  };
  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  return (
    <AsyncTypeahead
      filterBy={filterBy}
      id="search-clients"
      isLoading={isLoading}
      labelKey="fullName"
      minLength={3}
      onSearch={handleSearch}
      options={options}
      onChange={(value) => {
        setSingleSelections(value);
        setData({ ...data, ClientId: value[0]?.id });
      }}
      selected={singleSelections}
      placeholder="Search for a clients..."
      renderMenuItemChildren={(option) => (
        <>
          <span name="ClientId" value={option.id}>
            {option.fullName}
          </span>
        </>
      )}
    />
  );
}

const TicketModel = ({ toggleUserModal, setToggleUserModal }) => {
  const { user } = useAuthContext();
  const [data, setData] = useState({
    ticketType: '',
    serialNumber: '',
    device: '',
    problem: '',
    troubleshooting: '',
    resolution: '',
    dateOn: Date.now(),
    timeInAt: '',
    timeOutAt: '',
    hasCharger: false,
    notes: '',
  });

  useEffect(() => {
    if (data === null) {
      setData((prev) => ({ ...prev, UserId: user?.id }));
    }
  }, [user, data]);

  const onChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const submitTicket = async (e) => {
    e.preventDefault();
    // let method = 'POST';
    // try {
    //   let path = '/api/users';
    // }
    console.log(data);
    setToggleUserModal(false);
  };

  return (
    <Modal show={toggleUserModal} onHide={() => setToggleUserModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>New Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col xs={9} md={6}>
                <Form.Group controlId="clientName">
                  <Form.Label>Client Look Up</Form.Label>
                  <ClientDropMenu data={data} setData={setData} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="d-flex align-items-end">
              <Col xs={12} md={8}>
                <Dropdown
                  data={data}
                  setData={setData}
                  settings={{ title: 'Location', id: 'LocationId', labelKey: 'name', placeholder: 'Choose an location...' }}
                  path="/api/locations"
                />
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="serialNumber">
                  <Form.Label>Serial Number</Form.Label>
                  <Form.Control name="serialNumber" value={data.serialNumber} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="device">
                  <Form.Label>Device</Form.Label>
                  <Form.Control name="device" value={data.device} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="problem">
                  <Form.Label>Problem</Form.Label>
                  <Form.Control name="problem" value={data.problem} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="troubleshooting">
                  <Form.Label>Troubleshooting</Form.Label>
                  <Form.Control name="troubleshooting" value={data.troubleshooting} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="resolution">
                  <Form.Label>Resolution</Form.Label>
                  <Form.Control name="resolution" value={data.resolution} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="timeInAt">
                  <Form.Label>Time Started</Form.Label>
                  <TimeRange name="timeInAt" data={data} setData={setData}></TimeRange>
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="timeOutAt">
                  <Form.Label>Time Finished</Form.Label>
                  <TimeRange name="timeOutAt" data={data} setData={setData}></TimeRange>
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="hasCharger">
                  <Form.Label>Charger: </Form.Label>
                  <Form.Label>{data?.hasCharger ? 'Yes' : 'No'}</Form.Label>
                </Form.Group>
                <Button
                  onClick={() => {
                    setData({ ...data, hasCharger: true });
                  }}>
                  Yes
                </Button>
                <Button
                  onClick={() => {
                    setData({ ...data, hasCharger: false });
                  }}>
                  No
                </Button>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="notes">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control name="notes" value={data.notes} type="text" autoFocus onChange={onChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setToggleUserModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={submitTicket}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

TicketModel.propTypes = {
  toggleUserModal: PropTypes.bool.isRequired,
  setToggleUserModal: PropTypes.func.isRequired,
};

const Tickets = () => {
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [toggleUserModal, setToggleUserModal] = useState(false);

  useEffect(() => {
    fetch('/api/ticket')
      .then((res) => res.json())
      .then((data) => {
        data.map((ticket) => {
          ticket['createdAt'] = DateTime.fromISO(ticket['createdAt']).toLocaleString();
        });
        setData(data);
      });
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
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <main className="container">
      <div className="d-flex justify-content-between align-items-center mt-5">
        <button type="button" className="btn btn-primary d-flex align-items-center" onClick={() => setToggleUserModal(true)}>
          New <i className="bi bi-plus-lg" />
        </button>
        <TicketModel toggleUserModal={toggleUserModal} setToggleUserModal={setToggleUserModal} />
        <i className="bi bi-person-fill">Tickets</i>
        <Filters setColumnFilters={setColumnFilters} />
      </div>
      <TicketTable table={table} data={data} setData={setData} />
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

export default Tickets;
