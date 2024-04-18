import { useState, useEffect } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import { useLocation, Link, Routes, Route } from 'react-router-dom';
import AppointmentsTable from './AppointmentsTable';
import AppointmentsModal from './AppointmentsModal';
import DeleteModal from '../Components/DeleteModal';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { DateTime } from 'luxon';

const columns = [
  {
    accessorKey: 'Client.fullName',
    header: 'Client',
  },
  {
    accessorKey: 'dateOn',
    header: 'Date',
    cell: ({ row }) => <p>{DateTime.fromISO(row.original.dateOn).toISODate()}</p>,
  },
  {
    accessorKey: 'Appointment',
    header: 'Time',
    cell: ({ row }) => <p>{DateTime.fromISO(row.original.timeInAt).toISOTime().slice(0, 5) + '-' + DateTime.fromISO(row.original.timeOutAt).toISOTime().slice(0, 5)}</p>,
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
    accessorKey: 'Client.Device.model',
    header: 'Device',
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
  const [radioValue, setRadioValue] = useState('Upcoming');

  useEffect(() => {
    Api.appointments.index(page).then((response) => {
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

  const onCreate = (appointment) => {
    setData([...data, appointment]);
  };

  const onUpdate = (appointment) => {
    setData(data.map((a) => (a.id === appointment.id ? { ...appointment } : a)));
  };

  const onDelete = (appointmentId) => {
    setData(data.filter((a) => a.id != appointmentId));
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
        <i className="bi bi-clock title-icon">Appointments</i>
        <form className="d-flex" role="search">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              <i className="bi bi-search" />
            </span>
            <input type="search" className="form-control me-2" placeholder="Search Users" onChange={onChange} />
          </div>
        </form>
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
        <Route path="edit/:locationId" element={<AppointmentsModal onUpdate={onUpdate} />} />
        <Route path="delete/:locationId" element={<DeleteModal model="locations" onDelete={onDelete} />} />
      </Routes>
    </main>
  );
};

export default Appointments;
