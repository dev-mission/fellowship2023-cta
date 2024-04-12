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
import DeleteModal from '../Components/DeleteModal';
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
                model='tickets'
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
  lookUp: PropTypes.func.isRequired,
};

function ClientDropMenu({ lookUp }) {
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
      name="ClientId"
      value={singleSelections[0].id}
      id="search-clients"
      isLoading={isLoading}
      labelKey="fullName"
      onSearch={handleSearch}
      options={options}
      onChange={(event, value) => {
        setSingleSelections(value);
        lookUp(event);
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

const TicketModel = ({ data, stateChange, toggleUserModal, setToggleUserModal }) => {


  const submitTicket = async (e) => {
    e.preventDefault();

    const result = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    result.json().then((ticket) => {
      setData([...data, ticket]);
    });
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
              {/* <Col xs={9} md={6}>
                <Form.Group controlId="clientName">
                  <Form.Label>Client Look Up</Form.Label>
                  <ClientDropMenu lookUp={stateChange} />
                </Form.Group>
              </Col> */}
            </Row>
            <Row className="d-flex align-items-end">
              {/* <Col xs={12} md={8}>
                <Dropdown
                  lookUp={stateChange}
                  settings={{ title: 'Location', id: 'LocationId', labelKey: 'name', placeholder: 'Choose an location...' }}
                  path="/api/locations"
                />
              </Col> */}
              <Col xs={12} md={8}>
                <Form.Group controlId="serialNumber">
                  <Form.Label>Serial Number</Form.Label>
                  <Form.Control name="serialNumber" value={data.serialNumber} type="text" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="device">
                  <Form.Label>Device</Form.Label>
                  <Form.Control name="device" value={data.device} type="text" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="problem">
                  <Form.Label>Problem</Form.Label>
                  <Form.Control name="problem" value={data.problem} type="text" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="troubleshooting">
                  <Form.Label>Troubleshooting</Form.Label>
                  <Form.Control name="troubleshooting" value={data.troubleshooting} type="text" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="resolution">
                  <Form.Label>Resolution</Form.Label>
                  <Form.Control name="resolution" value={data.resolution} type="text" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="Date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control name="dateOn" value={data.dateOn} type="date" autoFocus onChange={stateChange} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="timeInAt">
                  <Form.Label>Time Started</Form.Label>
                  {/* <TimeRange name="timeInAt" data={data} setData={setTicket}></TimeRange> */}
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="timeOutAt">
                  <Form.Label>Time Finished</Form.Label>
                  {/* <TimeRange name="timeOutAt" data={data} setData={setTicket}></TimeRange> */}
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="hasCharger">
                  <Form.Label>Charger: </Form.Label>
                  <Form.Label>{data?.hasCharger ? 'Yes' : 'No'}</Form.Label>
                </Form.Group>
                <Button
                name="hasCharger"
                value={true}
                  onClick={stateChange}>
                  Yes
                </Button>
                <Button
                name="hasCharger"
                value={false}
                onClick={stateChange}>
                  No
                </Button>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="notes">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control name="notes" value={data.notes} type="text" autoFocus onChange={stateChange} />
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
  stateChange: PropTypes.func.isRequired,
};

const Tickets = () => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [toggleUserModal, setToggleUserModal] = useState(false);
  const [data, setData] = useState([]);
  const { user } = useAuthContext();
  const [ticket, setTicket] = useState({
    ClientId: null,
    LocationId: null,
    serialNumber: '',
    device: '',
    problem: '',
    troubleshooting: '',
    resolution: '',
    dateOn: DateTime.now().toISODate(),
    timeInAt: '',
    timeOutAt: '',
    hasCharger: false,
    notes: '',
  });

  useEffect(() => {
    fetch('/api/tickets')
      .then((res) => res.json())
      .then((data) => {
        data.map((ticket) => {
          ticket['createdAt'] = DateTime.fromISO(ticket['createdAt']).toLocaleString();
        });
        setData(data);
      });
      setTicket({ ...ticket, UserId: user?.id });
  }, [setData, user, setTicket]);

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

  const handleChange = (e) => {
    const newData = { ...ticket };
    newData[e.target.name] = e.target.value;
    setTicket(newData);
    console.log(ticket);
  };

  return (
    <main className="container">
      <div className="d-flex justify-content-between align-items-center mt-5">
        <button type="button" className="btn btn-primary d-flex align-items-center" onClick={() => setToggleUserModal(true)}>
          New <i className="bi bi-plus-lg" />
        </button>
        <TicketModel data={ticket} stateChange={handleChange} toggleUserModal={toggleUserModal} setToggleUserModal={setToggleUserModal} />
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
