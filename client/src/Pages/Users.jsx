//import React from 'react';


const Users = () => {
  return (
    <main className='container'>
      <div className='d-flex justify-content-between align-items-center'>
        <button type='button' className='btn btn-primary d-flex align-items-center'>New <i class="bi bi-plus-lg plus"></i></button>
        <i className='bi bi-person-fill personIcon'>Users</i>
        <form class='form-inline my-2 my-lg-0'>
          <input class='form-control' type='search' placeholder='Search Users' aria-label='Search'/>
        </form>
      </div>
    </main>

  );
};

export default Users;
