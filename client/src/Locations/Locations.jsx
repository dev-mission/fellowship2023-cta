import { useState, useEffect } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import AddLocationModal from './AddLocationModal';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import { useLocation } from 'react-router-dom';
import LocationsTable from './LocationsTable';

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

  const onCreate = (location) => {
    setData([...data, location]);
  };

  const onUpdate = (location) => {
    setData(data.map((l) => (l.id === location.id ? { ...location } : l)));
  };

  const onDelete = (locationId) => {
    setData(data.filter((l) => l.id != locationId));
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
        <AddLocationModal toggleAddModal={toggleAddModal} setToggleAddModal={setToggleAddModal} data={data} setData={setData} />
        <i className="bi bi-person-fill title-icon">Locations</i>
      </div>
      <LocationsTable table={table} data={data} setData={setData} />
      <Pagination page={page} lastPage={lastPage} />
      <Routes>
        <Route path="new" element={<LocationsModal onCreate={onCreate} />} />
        <Route path="edit/:locationId" element={<LocationsModal onUpdate={onUpdate} />} />
        <Route path="delete/:locationId" element={<DeleteModal model="locations" onDelete={onDelete} />} />
      </Routes>
    </main>
  );
};

export default Locations;
