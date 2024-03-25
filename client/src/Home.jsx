import { Helmet } from 'react-helmet-async';
import { useStaticContext } from './StaticContext';
import { useEffect, useState } from 'react';

function Home() {
  const staticContext = useStaticContext();
  const [data, setData] = useState();
  useEffect(() => {
    fetch('/api/users/me')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log(data);
      });
  }, []);

  function updateRole(event){
    event.preventDefault();
    const role = event.target.id;
    // fetch(`/api/${data.id}`,{
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ role: role }),
    // })
    console.log(role);
  }

  return (
    <>
      <Helmet>
        <title>Home - {staticContext?.env?.VITE_SITE_TITLE ?? ''}</title>
      </Helmet>
      <main className="container">
        <h1>Home</h1>
        <div>
          <p>Welcome to Dev/Mission Portal</p>
          <p>Please choose which website you wish to go to!</p>
          <button id="CTA" onClick={updateRole}>Tickets</button>
          <button id="Inventory" onClick={updateRole}>Inventory</button>
        </div>
      </main>
    </>
  );
}

export default Home;
