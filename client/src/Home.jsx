import { Helmet } from 'react-helmet-async';
import { useStaticContext } from './StaticContext';
import { useAuthContext } from './AuthContext';
import Api from './Api';
import AdminStats from './Components/AdminStats';

function Home() {
  const staticContext = useStaticContext();
  const { user, setUser } = useAuthContext();

  const updateRole = (event) => {
    event.preventDefault();
    const role = event.target.id;
    setUser({ ...user, role });
    Api.users.update(user.id, { role });
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
          {user?.isAdmin && user.role == 'CTA' && <AdminStats></AdminStats>}
        </div>
      </main>
    </>
  );
}

export default Home;
