import { useState, useEffect } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import { useLocation, Link, Routes, Route } from 'react-router-dom';
import DonorsTable from './DonorsTable';
import DonorsModal from './DonorsModal';
import DeleteModal from '../Components/DeleteModal';

const columns = [
  {
    accessorKey: 'name',
    header: 'Donor Name',
  },
  {
    accessorKey: 'phone',
    header: 'Phone Number',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'address1',
    header: 'Address 1',
  },
  {
    accessorKey: 'address2',
    header: 'Address 2',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'zip',
    header: 'Zip Code',
  },
];

const Donors = () => {
  const [data, setData] = useState();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    Api.donors.index(page).then((response) => {
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

  const onCreate = (donor) => {
    setData([...data, donor]);
  };

  const onUpdate = (donor) => {
    setData(data.map((d) => (d.id === donor.id ? { ...donor } : d)));
  };

  const onDelete = (donorId) => {
    setData(data.filter((d) => d.id != donorId));
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
        <i className="bi title-icon bi-box2-heart">Donors</i>
        <form className="d-flex" role="search">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              <i className="bi bi-search" />
            </span>
            <input type="search" className="form-control me-2" placeholder="Search Donors" onChange={onChange} />
          </div>
        </form>
      </div>
      <DonorsTable table={table} />
      <Pagination page={page} lastPage={lastPage} />
      <Routes>
        <Route path="new" element={<DonorsModal onCreate={onCreate} />} />
        <Route path="edit/:donorId" element={<DonorsModal onUpdate={onUpdate} />} />
        <Route path="delete/:id" element={<DeleteModal model="donors" onDelete={onDelete} />} />
      </Routes>
    </main>
  );
};

export default Donors;
