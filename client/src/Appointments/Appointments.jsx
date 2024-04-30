import { useCallback, useState, useEffect } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import { useLocation, Link, Routes, Route } from 'react-router-dom';
import AppointmentsTable from './AppointmentsTable';
import AppointmentsModal from './AppointmentsModal';
import DeleteModal from '../Components/DeleteModal';
// import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { DateTime } from 'luxon';

const columns = [
  {
    accessorKey: 'Client.fullName',
    header: 'Client',
  },
  {
    accessorKey: 'dateOn',
    header: 'Date',
    cell: ({ row }) => (
      <p>{row.original.dateOn.slice(6, 7) + '/' + row.original.dateOn.slice(8, 10) + '/' + row.original.dateOn.slice(0, 4)}</p>
    ),
  },
  {
    accessorKey: 'Appointment',
    header: 'Time',
    cell: ({ row }) => (
      <p>
        {DateTime.fromISO(row.original.timeInAt).toLocaleString(DateTime.TIME_SIMPLE) +
          '-' +
          DateTime.fromISO(row.original.timeOutAt).toLocaleString(DateTime.TIME_SIMPLE)}
      </p>
    ),
  },
  {
    accessorKey: 'User.fullName',
    header: 'User',
  },
  {
    accessorKey: 'Client.phone',
    header: 'Phone',
  },
  {
    accessorKey: 'Client.email',
    header: 'Email',
  },
  {
    accessorKey: 'Location.name',
    header: 'Location',
  },
  {
    accessorKey: 'Client',
    header: 'Device',
    cell: ({ row }) => <p>{row.original.Client.Device?.model || 'None'}</p>,
  },
  {
    accessorKey: 'problem',
    header: 'Problem',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

const Appointments = () => {
  const [data, setData] = useState();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);
  // const [radioValue, setRadioValue] = useState('Upcoming');

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

  const onCreate = (appointment) => {
    setData([...data, appointment]);
    fetchData();
  };

  const onUpdate = (appointment) => {
    setData(data.map((a) => (a.id === appointment.id ? { ...appointment } : a)));
  };

  const onDelete = (appointmentId) => {
    setData(data.filter((a) => a.id != appointmentId));
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
              New Appointments
              <i className="bi bi-plus-lg" />
            </div>
          </Link>
        </div>
        <div className="col-6 text-center">
          <h1>Appointments</h1>
        </div>
        <div className="col-3">
          <form className="d-flex" role="search">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">
                <i className="bi bi-search" />
              </span>
              <input type="search" className="form-control me-2" placeholder="Search Appointments" />
            </div>
          </form>
        </div>
      </div>
      {/* <ButtonGroup>
        <ToggleButton
          className={`border-primary ${radioValue === 'Upcoming' ? 'text-white' : 'text-primary'} `}
          id="radio-upcoming"
          type="radio"
          variant={radioValue === 'Upcoming' ? 'outline-primary' : ''}
          name="radio"
          value="Upcoming"
          checked={radioValue === 'Upcoming'}
          onChange={(e) => setRadioValue(e.currentTarget.value)}
          size="md">
          Upcoming
        </ToggleButton>
        <ToggleButton
          className={`border-primary ${radioValue === 'Archive' ? 'text-white' : 'text-primary'}`}
          id="radio-archive"
          type="radio"
          variant={radioValue === 'Archive' ? 'outline-primary' : ''}
          name="radio"
          value="Archive"
          checked={radioValue === 'Archive'}
          onChange={(e) => setRadioValue(e.currentTarget.value)}
          size="md">
          Archive
        </ToggleButton>
      </ButtonGroup> */}
      <AppointmentsTable table={table} />
      <Pagination page={page} lastPage={lastPage} />
      <Routes>
        <Route path="new" element={<AppointmentsModal onCreate={onCreate} />} />
        <Route path="edit/:appointmentId" element={<AppointmentsModal onUpdate={onUpdate} />} />
        <Route path="delete/:id" element={<DeleteModal model="appointments" onDelete={onDelete} />} />
      </Routes>
    </main>
  );
};

export default Appointments;
