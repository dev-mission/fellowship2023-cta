import { useCallback, useState, useEffect } from 'react';
import { useLocation, Link, Routes, Route } from 'react-router-dom';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import ClientTable from './ClientTable';
import ClientModal from './ClientModal';
import DeleteModal from '../Components/DeleteModal';
import { Helmet } from 'react-helmet-async';

const columns = [
  {
    accessorKey: 'id',
    header: 'Client #',
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'ethnicity',
    header: 'Ethnicity',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'language',
    header: 'Language',
  },
];

const Clients = () => {
  const [data, setData] = useState();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  const fetchData = useCallback(() => {
    Api.clients.index(page).then((response) => {
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

  function onUpdate(client) {
    setData(data.map((c) => (c.id == client.id ? { ...client } : c)));
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
        <title>Clients</title>
      </Helmet>
      <main className="container">
        <div className="row align-items-start mt-5">
          <div className="col-3">
            <Link className="btn btn-primary" to={`new?page=${page}`}>
              <div className="d-flex align-items-center justify-content-center">
                New Clients
                <i className="bi bi-plus-lg" />
              </div>
            </Link>
          </div>
          <div className="col-6 text-center">
            <h1>Clients</h1>
          </div>
          <div className="col-3">
            <form className="d-flex" role="search">
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <i className="bi bi-search" />
                </span>
                <input type="search" className="form-control me-2" placeholder="Search Clients" />
              </div>
            </form>
          </div>
        </div>
        <ClientTable table={table} page={page} />
        <Pagination page={page} lastPage={lastPage} />
        <Routes>
          <Route path="new" element={<ClientModal onCreate={onCreate} page={page} />} />
          <Route path="edit/:clientId" element={<ClientModal onUpdate={onUpdate} page={page} />} />
          <Route path="delete/:id" element={<DeleteModal model="clients" onDelete={onDelete} page={page} />} />
        </Routes>
      </main>
    </>
  );
};

export default Clients;
