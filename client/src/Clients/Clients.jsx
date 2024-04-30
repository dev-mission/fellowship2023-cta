import { useState, useEffect } from 'react';
import { useLocation, Link, Routes, Route } from 'react-router-dom';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import ClientTable from './ClientTable';
import ClientModal from './ClientModal';
import DeleteModal from '../Components/DeleteModal';

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
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
  },
];

const Clients = () => {
  const [data, setData] = useState();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
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

  function onCreate(client) {
    setData([...data, client]);
    console.log(data);
  }

  function onUpdate(client) {
    setData(data.map((c) => (c.id == client.id ? { ...client } : c)));
    console.log(client);
  }

  const onDelete = (clientId) => {
    setData(data.filter((c) => c.id != clientId));
  };

  const onChange = () => {};

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
        <i className="bi bi-person-fill title-icon">Clients</i>
        <form className="d-flex" role="search">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              <i className="bi bi-search" />
            </span>
            <input type="search" className="form-control me-2" placeholder="Search Clients" />
          </div>
        </form>
      </div>
      <ClientTable table={table} />
      <Pagination page={page} lastPage={lastPage} />
      <Routes>
        <Route path="new" element={<ClientModal onCreate={onCreate} />} />
        <Route path="edit/:clientId" element={<ClientModal onUpdate={onUpdate} />} />
        <Route path="delete/:id" element={<DeleteModal model="clients" onDelete={onDelete}></DeleteModal>} />
      </Routes>
    </main>
  );
};

export default Clients;
