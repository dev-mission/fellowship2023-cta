import { useState, useEffect } from 'react';
import { getCoreRowModel, getFilteredRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import PropTypes from 'prop-types';
import AddLocationModal from './AddLocationModal';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import { useLocation } from 'react-router-dom';
import LocationTable from './LocationTable';

const columns = [
  {
    accessorKey: 'name',
    header: 'Location Name',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'address1',
    header: 'Address 1',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'address2',
    header: 'Address 2',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'city',
    header: 'City',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'state',
    header: 'State',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'zipCode',
    header: 'Zip Code',
    enableColumnFilter: true,
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
          placeholder="Search Locations"
          onChange={(e) => onFilterChange('name', e.target.value)}
        />
      </div>
    </form>
  );
};

Filters.propTypes = {
  setColumnFilters: PropTypes.func,
};

const Locations = () => {
  const [data, setData] = useState();
  const [columnFilters, setColumnFilters] = useState([]);
  const [toggleAddModal, setToggleAddModal] = useState(false);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
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

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      columnFilters,
      data,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <main className="container">
      <div className="d-flex justify-content-between align-items-center mt-5">
        <button type="button" className="btn btn-primary d-flex align-items-center" onClick={() => setToggleAddModal(true)}>
          New <i className="bi bi-plus-lg" />
        </button>
        <AddLocationModal toggleAddModal={toggleAddModal} setToggleAddModal={setToggleAddModal} data={data} setData={setData} />
        <i className="bi bi-person-fill">Locations</i>
        <Filters setColumnFilters={setColumnFilters} />
      </div>
      <LocationTable table={table} data={data} setData={setData} />
      <Pagination page={page} lastPage={lastPage} />
    </main>
  );
};

export default Locations;
