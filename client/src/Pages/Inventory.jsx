import { useState, useEffect } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  // getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import PropTypes from 'prop-types';
import { AddDeviceModal, EditDeviceModal, DeleteModal } from '../Components';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import { useLocation } from 'react-router-dom';

const columns = [
  
  {
    accessorKey: 'id',
    header: 'Device#',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'deviceType',
    header: 'Device Type',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'model',
    header: 'model',
    enableColumnFilter: false,
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'serialNum',
    header: 'S/N',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'cpu',
    header: 'CPU',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'ram',
    header: 'RAM',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'os',
    header: 'OS',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'username',
    header: 'Username',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'password',
    header: 'Password',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'condition',
    header: 'Condition',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'value',
    header: 'Value',
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
          placeholder="Search Devices"
          onChange={(e) => onFilterChange('name', e.target.value)}
        />
      </div>
    </form>
  );
};

Filters.propTypes = {
  setColumnFilters: PropTypes.func,
};

const DeviceTable = ({ table, data, setData }) => {
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
        model: row.original.model,
        brand: row.original.brand,
        serialNum: row.original.serialNum,
        cpu: row.original.cpu,
        ram: row.original.ram,
        os: row.original.os,
        username: row.original.username,
        password: row.original.password,
        condition: row.original.condition,
        value: row.original.value,
        notes: row.original.notes,
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
                <i className="bi bi-pencil" onClick={onEdit(row)}/>
              </td>
              <td>
                <i className="bi bi-x-lg" onClick={onDelete(row)}  />
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
          model="devices"
        />
        <EditDeviceModal 
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

DeviceTable.propTypes = {
  table: PropTypes.object,
  data: PropTypes.array,
  setData: PropTypes.func,
};

const Devices = () => {
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
        <AddDeviceModal toggleAddModal={toggleAddModal} setToggleAddModal={setToggleAddModal} data={data} setData={setData} />
        <i className="bi title-icon bi-card-checklist">Devices</i>
        <Filters setColumnFilters={setColumnFilters} />
      </div>
      <DeviceTable table={table} data={data} setData={setData} />
      <Pagination page={page} lastPage={lastPage} />
    </main>
  );
};

export default Devices;