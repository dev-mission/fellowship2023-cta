import { useCallback, useState, useEffect } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import { useLocation, Link, Routes, Route } from 'react-router-dom';
import LocationsTable from './LocationsTable';
import LocationsModal from './LocationsModal';
import DeleteModal from '../Components/DeleteModal';
import { Helmet } from 'react-helmet-async';

const columns = [
  {
    accessorKey: 'name',
    header: 'Location Name',
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
    accessorKey: 'zipCode',
    header: 'Zip Code',
  },
];

const Locations = () => {
  const [data, setData] = useState();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  const fetchData = useCallback(() => {
    Api.locations.index(page).then((response) => {
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

  const onCreate = () => {
    fetchData();
  };

  const onUpdate = (location) => {
    setData(data.map((l) => (l.id === location.id ? { ...location } : l)));
  };

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
        <title>Locations </title>
      </Helmet>
      <main className="container">
        <div className="row align-items-start mt-5">
          <div className="col-3">
            <Link className="btn btn-primary" to={`new?page=${page}`}>
              <div className="d-flex align-items-center justify-content-center">
                New Locations
                <i className="bi bi-plus-lg" />
              </div>
            </Link>
          </div>
          <div className="col-6 text-center">
            <h1>Locations</h1>
          </div>
          <div className="col-3">
            <form className="d-flex" role="search">
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <i className="bi bi-search" />
                </span>
                <input type="search" className="form-control me-2" placeholder="Search Locations" />
              </div>
            </form>
          </div>
        </div>
        <LocationsTable table={table} page={page} />
        <Pagination page={page} lastPage={lastPage} />
        <Routes>
          <Route path="new" element={<LocationsModal onCreate={onCreate} page={page} />} />
          <Route path="edit/:locationId" element={<LocationsModal onUpdate={onUpdate} page={page} />} />
          <Route path="delete/:id" element={<DeleteModal model="locations" onDelete={onDelete} page={page} />} />
        </Routes>
      </main>
    </>
  );
};

export default Locations;
