import { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import DeleteModal from '../Components/DeleteModal';

import TicketTable from './TicketTable';
import TicketModal from './TicketModal';

const columns = [
  {
    accessorKey: 'id',
    header: 'Ticket #',
  },
  {
    accessorKey: 'Client.fullName',
    header: 'Client',
  },
  {
    accessorKey: 'Location.name',
    header: 'Location',
  },
  {
    accessorKey: 'User.fullName',
    header: 'CTA Assigned',
  },
  {
    accessorKey: 'device',
    header: 'Device',
  },
  {
    accessorKey: 'problem',
    header: 'Problem',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Met',
  },
];

const Tickets = () => {
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

  function onCreate(ticket) {
    setData([...data, ticket]);
  }

  function onUpdate(ticket) {
    setData(data.map((t) => (t.id == ticket.id ? { ...ticket } : t)));
  }

  const onDelete = (ticketId) => {
    setData(data.filter((t) => t.id != ticketId));
  };
  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      data,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <main className="container">
      <div className="d-flex justify-content-between align-items-center mt-5">
        <Link className="btn btn-primary d-flex align-items-center" to="new">
          New <i className="bi bi-plus-lg" />
        </Link>
        <i className="bi bi-person-fill">Tickets</i>
        <p>Search Box</p>
      </div>
      <TicketTable table={table} />
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
        <Route path="new" element={<TicketModal onCreate={onCreate} />} />
        <Route path="edit/:ticketId" element={<TicketModal onUpdate={onUpdate} />} />
        <Route path="delete/:id" element={<DeleteModal model="tickets" onDelete={onDelete}></DeleteModal>} />
      </Routes>
    </main>
  );
};

export default Tickets;
