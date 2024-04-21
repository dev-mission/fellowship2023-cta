import { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Api from '../Api';
import { DateTime } from 'luxon';
import Pagination from '../Components/Pagination';
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
    cell: ({ row }) => <p>{DateTime.fromISO(row.original.createdAt).toISODate()}</p>,
  },
];

const Tickets = () => {
  const [data, setData] = useState([]);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    Api.tickets.index(page).then((response) => {
      setData(response.data);
      const linkHeader = Api.parseLinkHeader(response);
      let newLastPage = page;
      if (linkHeader?.last) {
        const match = linkHeader.last.match(/page=(\d+)/);
        newLastPage = parseInt(match[1], 10);
      } else if (linkHeader?.next) {
        newLastPage = page + 1;
      }
      setLastPage(newLastPage);
    });
  }, [page]);

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
  });

  return (
    <main className="container">
      <div className="d-flex justify-content-between align-items-center mt-5">
        <Link className="btn btn-primary d-flex align-items-center" to="new">
          New <i className="bi bi-plus-lg" />
        </Link>
        <i className="bi bi-person-fill">Tickets</i>
        <input type="search" className="form-control me-2" placeholder="Search Users" />
      </div>
      <TicketTable table={table} />
      <Pagination page={page} lastPage={lastPage} />
      <Routes>
        <Route path="new" element={<TicketModal onCreate={onCreate} />} />
        <Route path="edit/:ticketId" element={<TicketModal onUpdate={onUpdate} />} />
        <Route path="delete/:id" element={<DeleteModal model="tickets" onDelete={onDelete}></DeleteModal>} />
      </Routes>
    </main>
  );
};

export default Tickets;
