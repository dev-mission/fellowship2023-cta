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
      <main className="container my-5">
        {user?.isAdmin && user.role == null && (
          <div className="p-5 text-center rounded-3">
            <i className="bi bi-code-slash "></i>
            <h1 className="text-body-emphasis">Welcome to the Dev/Mission Portal</h1>
            <p className="col-lg-8 mx-auto fs-5 text-muted">Choose which website you would like to access</p>
            <div className="d-inline-flex gap-2 mb-5">
              <button
                id="CTA"
                onClick={updateRole}
                className="d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill"
                type="button">
                Tickets
              </button>
              <button
                id="Inventory"
                onClick={updateRole}
                className="d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill"
                type="button">
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
