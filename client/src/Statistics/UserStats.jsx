import { Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

export default function UserStats() {
  const [totalTime, setTotalTime] = useState([]);
  const [month, setMonth] = useState('');
  useEffect(() => {
    async function fetchLocation() {
      const date = DateTime.now();
      setMonth(date.monthLong);
      const response = await fetch(`/api/locations/totalTime/${date.month}`);
      const data = await response.json();
      setTotalTime(data);
    }
    fetchLocation();
  }, []);

  return (
    <div>
      <h3>{month}: Total Time At All Sites</h3>
      <Table striped="true" border="true" size="sm" responsive="true">
        <thead>
          <tr>
            <th>Location</th>
            <th>Time in hours</th>
          </tr>
        </thead>
        <tbody>
          {totalTime.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.totalTime}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
