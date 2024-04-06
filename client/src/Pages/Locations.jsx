import { useState, useEffect } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  // getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import PropTypes from 'prop-types';
import { AddLocationModal, EditLocationModal, DeleteModal } from '../Components';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import { useLocation } from 'react-router-dom';

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

const LocationTable = ({ table, data, setData }) => {
  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
  const [toggleEditModal, setToggleEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [propRow, setPropRow] = useState({});

  const onDelete = (row) => (e) => {
    try {
      setToggleDeleteModal(true);
      setPropRow(row);
    } catch (err) {
      console.log(err);
      console.log(e);
    }
  };

  const onEdit = (row) => (e) => {
    try {
      setToggleEditModal(true);
      setPropRow(row);
      setEditData({
        id: row.original.id,
        name: row.original.name,
        address1: row.original.address1,
        address2: row.original.address2,
        city: row.original.city,
        state: row.original.state,
        zipCode: row.original.zipCode,
      });
    } catch (err) {
      console.log(err);
      console.log(e);
    }
  };

  return (
    <>
      <table className="table mt-5">
        <thead className="table-primary">
          <tr>
            {table.getHeaderGroups()[0].headers.map((header) => (
              <th scope="col" key={header.id}>
                {header.column.columnDef.header}
                {/* {header.column.getCanSort() && <i className="ms-2 bi bi-arrow-down-up" onClick={header.column.getToggleSortingHandler()} />} */}
              </th>
            ))}
            <th scope="col">
              <i className="bi bi-pencil-square" />
            </th>
            <th scope="col">
              <i className="bi bi-trash-fill" />
            </th>
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
              <td>
                <i className="bi bi-pencil" onClick={onEdit(row)} />
              </td>
              <td>
                <i className="bi bi-x-lg" onClick={onDelete(row)} />
              </td>
            </tr>
          ))}
        </tbody>
        <DeleteModal
          toggleDeleteModal={toggleDeleteModal}
          setToggleDeleteModal={setToggleDeleteModal}
          row={propRow}
          data={data}
          setData={setData}
          model="locations"
        />
        <EditLocationModal
          toggleEditModal={toggleEditModal}
          setToggleEditModal={setToggleEditModal}
          row={propRow}
          data={data}
          setData={setData}
          editData={editData}
          setEditData={setEditData}
        />
      </table>
    </>
  );
};

LocationTable.propTypes = {
  table: PropTypes.object,
  data: PropTypes.array,
  setData: PropTypes.func,
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
    // getSortedRowModel: getSortedRowModel(),
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
