import { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import TicketTable from './TicketTable';
import AddTicketModal from './AddTicketModal';

const columns = [
  {
    accessorKey: 'id',
    header: 'Ticket #',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'Client',
    header: 'Client',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'Location',
    header: 'Location',
    enableColumnFilter: true,
    enableSorting: false,
  },
  {
    accessorKey: 'User',
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

const Tickets = () => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/tickets')
      .then((res) => res.json())
      .then((data) => {
        data.map((ticket) => {
          ticket['createdAt'] = DateTime.fromISO(ticket['createdAt']).toLocaleString();
        });
        setData(data);
      });
  }, []);

  function updateTable(ticket) {
    setData([...data, ticket]);
  }

  function removeData(ticket) {
    setData(ticket);
  }

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
        <Link className="btn btn-primary d-flex align-items-center" to="new">
          New <i className="bi bi-plus-lg" />
        </Link>
        <i className="bi bi-person-fill">Tickets</i>
        <Filters setColumnFilters={setColumnFilters} />
      </div>
      <TicketTable table={table} data={data} setData={removeData} />
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
      <Routes>
        <Route path="new" element={<AddTicketModal onCreate={updateTable} />} />
      </Routes>
    </main>
  );
};

export default Tickets;
