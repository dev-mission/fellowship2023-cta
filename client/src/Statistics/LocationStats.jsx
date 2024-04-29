import { Table } from 'react-bootstrap';
// import { useState, useEffect } from 'react';

export default function LocationStats() {
  return (
    <Table striped="true" responsive="true">
      <thead>
        <tr>
          <th>#</th>
          <th>Location</th>
          <th>Clients</th>
        </tr>
      </thead>
    </Table>
  );
}
