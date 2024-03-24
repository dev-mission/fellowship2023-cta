import { useState, useEffect } from 'react';
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, flexRender } from '@tanstack/react-table'; 

const columns = [
  {
    accessorKey: 'firstName',
    header: 'First',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'lastName',
    header: 'Last',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'LocationId',
    header: 'Location',
    enableColumnFilter: true,
    enableSorting: false
  },
  {
    accessorKey: 'role',
    header: 'Role',
    enableColumnFilter: true,
    enableSorting: false
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableColumnFilter: true,
    enableSorting: false
  }
]

const Filters = ({ columnFilters, setColumnFilters }) => {
  const userName = columnFilters.find(f => f.id === 'firstName')?.value || '';

  const onFilterChange = (id, value) => setColumnFilters(
    prev => prev.filter(f => f.id !== id).concat({ id, value })
  );

  return (
    <form className="d-flex" role='search'>
      <div className="input-group">
        <span className="input-group-text" id="basic-addon1"><i className="bi bi-search"/></span>
        <input type="search" className="form-control me-2" placeholder="Search Users" aria-label="Search" aria-describedby="basic-addon1" value={userName} onChange={(e) => onFilterChange('firstName', e.target.value)}/>
      </div>
    </form>
  );
};

const UserTable = ({ table }) => {

  return (
    <table className="table mt-5">
      <thead className='table-primary'>
        <tr>
          {table.getHeaderGroups()[0].headers.map(header => <th scope='col' key={header.id}>
            {header.column.columnDef.header}
            {header.column.getCanSort() && <i
              className="ms-2 bi bi-arrow-down-up"
              onClick={header.column.getToggleSortingHandler()}
              />}
          </th>)}
        </tr>
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const Users = () => {
  const [data, setData] = useState();
  const [columnFilters, setColumnFilters] = useState([]);

  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(data => setData(data));
  }, [])

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      columnFilters
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
  });  

  return (
    <main className='container'>
      <div className='d-flex justify-content-between align-items-center mt-5'>
        <button type='button' className='btn btn-primary d-flex align-items-center'>New <i className="bi bi-plus-lg"/></button>
        <i className='bi bi-person-fill'>Users</i>
        <Filters columnFilters={columnFilters} setColumnFilters={setColumnFilters}/>
      </div>
      <UserTable table={table}/>
    </main>

  );
};

export default Users;
