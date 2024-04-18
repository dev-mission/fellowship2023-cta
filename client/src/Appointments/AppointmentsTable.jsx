import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { flexRender } from '@tanstack/react-table';

const AppointmentsTable = ({ table }) => {
  const navigate = useNavigate();

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
              <i className="bi bi-pencil pointer" onClick={() => navigate(`edit/${row.original.id}`)} />
            </td>
            <td>
              <i className="bi bi-x-lg pointer" onClick={() => navigate(`delete/${row.original.id}`)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

AppointmentsTable.propTypes = {
  table: PropTypes.object,
};

export default AppointmentsTable;