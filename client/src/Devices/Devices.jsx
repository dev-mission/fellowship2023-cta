import { useState, useEffect } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import Api from '../Api';
import Pagination from '../Components/Pagination';
import { useLocation , Link, Routes, Route} from 'react-router-dom';
import DeviceTable from './DeviceTable';
import DeviceModal from './DeviceModal';

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
];




const Devices = () => {
  const [data, setData] = useState();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  console.log(data);

  useEffect(() => {
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


  function onCreate(device) {
    setData([...data, device]);
    console.log(data);
  }

  function onUpdate(device) {
    setData(data.map((d) => (d.id == device.id ? { ...device } : d)));
  }

  

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      data,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(table.getRowModel().rows);

  const onChange = (e) => { };

  return (
    <main className="container">
      <div className="d-flex justify-content-between align-items-center mt-5">
        <Link className="btn btn-primary d-flex align-items-center" to="new">
          New <i className="bi bi-plus-lg" />
        </Link>
        <i className="bi title-icon bi-card-checklist">Devices</i>
        <form className="d-flex" role="search">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              <i className="bi bi-search" />
            </span>
            <input
              type="search"
              className="form-control me-2"
              placeholder="Search Devices"
              onChange={onChange}
            />
          </div>
        </form>
      </div>
      <DeviceTable table={table} data={data} setData={setData} />
      <Pagination page={page} lastPage={lastPage} />
      <Routes>
        <Route path="new" element={<DeviceModal onCreate={onCreate} />} />
        <Route path=":deviceId" element={<DeviceModal onUpdate={onUpdate} />} />
      </Routes>
    </main>
  );
};

export default Devices;
