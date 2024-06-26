import { useCallback, useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import DeleteModal from '../Components/DeleteModal';
import TicketTable from './TicketTable';
import TicketModal from './TicketModal';
import { Helmet } from 'react-helmet-async';
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
    accessorKey: 'dateOn',
    header: 'Date Met',
  },
];

const Tickets = () => {
  const [data, setData] = useState([]);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  const fetchData = useCallback(() => {
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

  useEffect(() => {
    fetchData();
  }, [fetchData, page]);

  function onCreate() {
    fetchData();
  }

  function onUpdate(ticket) {
    setData(data.map((t) => (t.id == ticket.id ? { ...ticket } : t)));
  }

  const onDelete = () => {
    fetchData();
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
    <>
      <Helmet>
        <title>Tickets</title>
      </Helmet>
      <main className="container">
        <div className="row align-items-start mt-5">
          <div className="col-3">
            <Link className="btn btn-primary" to={`new?page=${page}`}>
              <div className="d-flex align-items-center justify-content-center">
                New Tickets
                <i className="bi bi-plus-lg" />
              </div>
            </Link>
          </div>
          <div className="col-6 text-center">
            <h1>Tickets</h1>
          </div>
          <div className="col-3">
            <form className="d-flex" role="search">
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <i className="bi bi-search" />
                </span>
                <input type="search" className="form-control me-2" placeholder="Search Tickets" />
              </div>
            </form>
          </div>
        </div>
        <TicketTable table={table} page={page} />
        <Pagination page={page} lastPage={lastPage} />
        <Routes>
          <Route path="new" element={<TicketModal onCreate={onCreate} page={page} />} />
          <Route path="edit/:ticketId" element={<TicketModal onUpdate={onUpdate} page={page} />} />
          <Route path="delete/:id" element={<DeleteModal model="tickets" onDelete={onDelete} page={page} />} />
        </Routes>
      </main>
    </>
  );
};

export default Tickets;
