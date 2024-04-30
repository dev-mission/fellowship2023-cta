import { useCallback, useState, useEffect } from 'react';
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

  const fetchData = useCallback(() => {
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

  useEffect(() => {
    fetchData();
  }, [fetchData, page]);

  const onCreate = (donor) => {
    setData([...data, donor]);
    fetchData();
  };

  const onUpdate = (donor) => {
    setData(data.map((d) => (d.id === donor.id ? { ...donor } : d)));
  };

  const onDelete = (donorId) => {
    setData(data.filter((d) => d.id != donorId));
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
    <main className="container">
      <div className="row align-items-start mt-5">
        <div className="col-3">
          <Link className="btn btn-primary" to="new">
            <div className="d-flex align-items-center justify-content-center">
              New Donors
              <i className="bi bi-plus-lg" />
            </div>
          </Link>
        </div>
        <div className="col-6 text-center">
          <h1>Donors</h1>
        </div>
        <div className="col-3">
          <form className="d-flex" role="search">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">
                <i className="bi bi-search" />
              </span>
              <input type="search" className="form-control me-2" placeholder="Search Donors" />
            </div>
          </form>
        </div>
      </div>
      <DonorsTable table={table} page={page} />
      <Pagination page={page} lastPage={lastPage} />
      <Routes>
        <Route path="new" element={<DonorsModal onCreate={onCreate} />} />
        <Route path="edit/:donorId" element={<DonorsModal onUpdate={onUpdate} />} />
        <Route path="delete/:id" element={<DeleteModal model="donors" onDelete={onDelete} page={page} />} />
      </Routes>
    </main>
  );
};

export default Donors;
