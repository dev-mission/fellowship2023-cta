import { useState } from 'react';
import { DeleteModal } from '../Components';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import { flexRender } from '@tanstack/react-table';

const DeviceTable = ({ table, data, setData }) => {
  const navigate = useNavigate();

  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
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
              <i className="bi bi-pencil pointer" onClick={() => navigate(`${row.original.id}`)} />
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
        model="devices"
      />
    </table>
  );
};

DeviceTable.propTypes = {
  table: PropTypes.object,
  data: PropTypes.array,
  setData: PropTypes.func,
};

export default DeviceTable;
