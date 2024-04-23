import { useState, useEffect } from 'react';

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
    <div>
      <p>Total Time: {time}</p>
    </div>
  );
}
