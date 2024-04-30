import { useCallback, useState, useEffect } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import { useLocation, Link, Routes, Route } from 'react-router-dom';
import DevicesTable from './DevicesTable';
import DevicesModal from './DevicesModal';
import DeleteModal from '../Components/DeleteModal';

const columns = [
  {
    accessorKey: 'id',
    header: 'Device#',
  },
  {
    accessorKey: 'deviceType',
    header: 'Device Type',
  },
  {
    accessorKey: 'model',
    header: 'model',
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
  },
  {
    accessorKey: 'serialNum',
    header: 'S/N',
  },

  {
    accessorKey: 'condition',
    header: 'Condition',
  },
  {
    accessorKey: 'value',
    header: 'Value',
  },

  {
    accessorKey: 'Location.name',
    header: 'Location',
  },

  {
    accessorKey: 'Donor.name',
    header: 'Donor',
  },
  {
    accessorKey: 'User.fullName',
    header: 'Intern',
  },
];

const Devices = () => {
  const [data, setData] = useState();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  const fetchData = useCallback(() => {
    Api.devices.index(page).then((response) => {
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

  const onCreate = (device) => {
    setData([...data, device]);
    fetchData();
  };

  const onUpdate = (device) => {
    setData(data.map((d) => (d.id === device.id ? { ...device } : d)));
  };

  const onDelete = (deviceId) => {
    setData(data.filter((d) => d.id != deviceId));
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
              New Devices
              <i className="bi bi-plus-lg" />
            </div>
          </Link>
        </div>
        <div className="col-6 text-center">
          <h1>Devices</h1>
        </div>
        <div className="col-3">
          <form className="d-flex" role="search">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">
                <i className="bi bi-search" />
              </span>
              <input type="search" className="form-control me-2" placeholder="Search Devices" />
            </div>
          </form>
        </div>
      </div>
      <DevicesTable table={table} page={page} />
      <Pagination page={page} lastPage={lastPage} />
      <Routes>
        <Route path="new" element={<DevicesModal onCreate={onCreate} />} />
        <Route path="edit/:deviceId" element={<DevicesModal onUpdate={onUpdate} />} />
        <Route path="delete/:id" element={<DeleteModal model="devices" onDelete={onDelete} page={page} />} />
      </Routes>
    </main>
  );
};

export default Devices;
