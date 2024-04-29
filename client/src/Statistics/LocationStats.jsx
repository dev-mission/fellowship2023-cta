import { Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

export default function LocationStats() {
  const [locationVists, setLocationVists] = useState([]);
  const [month, setMonth] = useState('');
  useEffect(() => {
    async function fetchLocation() {
      const date = DateTime.now();
      setMonth(date.monthLong);
      const response = await fetch(`/api/locations/vists/${date.month}`);
      const data = await response.json();
      setLocationVists(data);
    }
    fetchLocation();
  }, []);

  return (
    <div>
      <h3>{month}: Total Clients At All Sites</h3>
      <Table striped="true" border="true" size="sm" responsive="true">
        <thead>
          <tr>
            <th>Location</th>
            <th>Clients</th>
          </tr>
        </thead>
        <tbody>
          {locationVists.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.vist}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
