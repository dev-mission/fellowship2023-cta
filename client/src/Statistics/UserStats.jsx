import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

export default function UserStats() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    async function fetchTime() {
      const response = await fetch('/api/users/stats');
      const data = await response.json();
      setTime(data);
    }
    fetchTime();
  }, []);

  return (
    <Card style={{ width: 18 + 'rem' }}>
      <Card.Body>
        <Card.Title>Hours Worked</Card.Title>
        <Card.Text>All CTA have worked: {time}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Link to={'admin/users'} className="btn btn-primary">
          Detailed View
        </Link>
      </Card.Footer>
    </Card>
  );
}
