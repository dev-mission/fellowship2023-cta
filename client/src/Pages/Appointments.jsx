import { useState, useEffect } from 'react';
import {
  // getCoreRowModel,
  // getFilteredRowModel,
  // getSortedRowModel,
  // useReactTable,
  // flexRender,
} from '@tanstack/react-table';
// import PropTypes from 'prop-types';
// import { AddLocationModal, EditLocationModal, DeleteModal } from '../Components';
import Api from '../Api';
// import Pagination from '../Components/Pagination';
import { useLocation } from 'react-router-dom';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

// const columns = [
//   {
//     accessorKey: 'ClientId',
//     header: 'Client',
//     enableColumnFilter: true,
//   },
//   {
//     accessorKey: 'dateTimeAt',
//     header: 'Date Time',
//     enableColumnFilter: true,
//   },
//   {
//     accessorKey: 'UserId',
//     header: 'User',
//     enableColumnFilter: true,
//   },
//   {},
// ];

const Appointments = () => {
  const [data, setData] = useState();
  // const [toggleAddModal, setToggleAddModal] = useState(false);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  // const [lastPage, setLastPage] = useState(1);
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

  console.log(data);

  // const table = useReactTable({
  //   data: data || [],
  //   columns,
  //   state: {
  //     data,
  //   },
  //   getCoreRowModel: getCoreRowModel(),
  // });

  return (
    <main className="container">
      <div className="d-flex justify-content-between align-items-center mt-5">
        <button type="button" className="btn btn-primary d-flex align-items-center" onClick={() => setToggleAddModal(true)}>
          New <i className="bi bi-plus-lg" />
        </button>
        <i className="bi bi-clock">Appointments</i>
        <form className="d-flex" role="search">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              <i className="bi bi-search" />
            </span>
            <input type="search" className="form-control me-2" placeholder="Search Locations" />
          </div>
        </form>
      </div>
      <div>
        <ButtonGroup>
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
        </ButtonGroup>
      </div>
    </main>
  );
};

export default Appointments;
