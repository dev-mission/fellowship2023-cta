import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteModal } from '../Components';
import PropTypes from 'prop-types';
import { flexRender } from '@tanstack/react-table';

const TicketTable = ({ table, data, setData }) => {
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
        model="tickets"
      />
    </table>
  );
};

TicketTable.propTypes = {
  table: PropTypes.shape({
    getHeaderGroups: PropTypes.func.isRequired,
    getRowModel: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
};

export default TicketTable;