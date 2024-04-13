/* eslint-disable */

import { useState } from 'react';
import { DeleteModal } from '../Components';
import EditAppointmentModal from './EditAppointmentModal';
import PropTypes from 'prop-types';
import { flexRender } from '@tanstack/react-table';

const AppointmentsTable = ({ table, data, setData }) => {
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
        ClientId: row.original.ClientId,
        client: row.original.Client.fullName,
        user: row.original.User.firstName + ' ' + row.original.User.lastName,
        UserId: row.original.UserId,
        LocationId: row.original.LocationId,
        dateTimeAt: row.original.dateTimeAt,
        problem: row.original.problem,
        status: row.original.status,
      });
    } catch (err) {
      console.log(err);
      console.log(e);
    }
  };

  return (
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
              <i className="bi bi-pencil pointer" onClick={onEdit(row)} />
            </td>
            <td>
              <i className="bi bi-x-lg pointer" onClick={onDelete(row)} />
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
        model="appointments"
      />
      <EditAppointmentModal
        toggleEditModal={toggleEditModal}
        setToggleEditModal={setToggleEditModal}
        row={propRow}
        data={data}
        setData={setData}
        editData={editData}
        setEditData={setEditData}
      />
    </table>
  );
};

AppointmentsTable.propTypes = {
  table: PropTypes.object,
  data: PropTypes.array,
  setData: PropTypes.func,
};

export default AppointmentsTable;
