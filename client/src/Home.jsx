import { Helmet } from 'react-helmet-async';
import { useStaticContext } from './StaticContext';
import { useEffect, useState } from 'react';

function Home() {
  const staticContext = useStaticContext();
  const [user, setUser] = useState({});
  useEffect(() => {
    fetch('/api/users/me')
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      });
  }, []);

  const updateRole = (event) => {
    event.preventDefault();
    const newRole = { ...user, role: event.target.id };
    fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRole),
    });
    location.reload();
  };

  return (
    <>
      <Helmet>
        <title>Home - {staticContext?.env?.VITE_SITE_TITLE ?? ''}</title>
      </Helmet>
      <main className="container">
        <h1>Home</h1>
        <div>
          <p>Welcome to Dev/Mission Portal</p>
          {user?.isAdmin && user.role == null && (
            <>
              <p>Please choose which website you wish to go to!</p>
              <button id="CTA" onClick={updateRole}>
                Tickets
              </button>
              <button id="Inventory" onClick={updateRole}>
                Inventory
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default Home;
