import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="container">
      <div className="card" style={{ width: 18 + 'rem' }}>
        <div className="card-body">
          <h5 className="card-title">Hours Worked</h5>
          <p>All CTA have worked: {time} hours</p>
          <p className="card-text"></p>
          <Link to={'admin/users'} className="btn btn-primary">
            Detailed View
          </Link>
        </div>
      </div>
    </div>
  );
}
