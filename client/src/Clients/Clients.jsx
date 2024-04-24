import { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { DateTime } from 'luxon';

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
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => {
        data.map((client) => {
          client['createdAt'] = DateTime.fromISO(client['createdAt']).toLocaleString();
          client['updatedAt'] = DateTime.fromISO(client['updatedAt']).toLocaleString();
        });
        setData(data);
      });
  }, []);

  function onCreate(client) {
    setData([...data, client]);
    console.log(data);
  }

  function onUpdate(client) {
    setData(data.map((t) => (t.id == client.id ? { ...client } : t)));
    console.log(client);
  }

  const onDelete = (clientId) => {
    setData(data.filter((l) => l.id != clientId));
  };

  function removeData(client) {
    setData(client);
  }
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
        <i className="bi bi-person-fill">Clients</i>
        <p>Search Box</p>
      </div>
      <ClientTable table={table} data={data} setData={removeData} />
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
        <Route path="new" element={<ClientModal onCreate={onCreate} />} />
        <Route path="edit/:clientId" element={<ClientModal onUpdate={onUpdate} />} />
        <Route path="delete/:id" element={<DeleteModal model="clients" onDelete={onDelete} />} />
      </Routes>
    </main>
  );
};

export default Clients;
