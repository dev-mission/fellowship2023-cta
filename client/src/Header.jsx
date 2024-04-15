import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';

import './Header.scss';
import Api from './Api';
import { useAuthContext } from './AuthContext';
import { logo } from '../public';

function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthContext();
  const [isNavbarShowing, setNavbarShowing] = useState(false);

  useEffect(
    function () {
      Api.users.me().then((response) => {
        if (response.status === 204) {
          setUser(null);
        } else {
          setUser(response.data);
        }
      });
    },
    [setUser],
  );

  async function onLogout(event) {
    event.preventDefault();
    if (user.isAdmin) {
      const newRole = { ...user, role: null };
      Api.users.update(user.id, newRole);
    }
    await Api.auth.logout();
    setUser(null);
    hideNavbar();
    navigate('/');
  }

  function toggleNavbar() {
    setNavbarShowing(!isNavbarShowing);
  }

  function hideNavbar() {
    setNavbarShowing(false);
  }

  return (
    <nav className="header navbar navbar-expand-md navbar-light bg-light fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={hideNavbar}>
          <img width={200} height={50} src={logo} alt="Logo" />
        </Link>
        <button onClick={toggleNavbar} className="navbar-toggler" type="button" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={classNames('collapse navbar-collapse', { show: isNavbarShowing })}>
          <ul className="navbar-nav flex-grow-1 mb-2 mb-md-0">
            {user && (
              <>
                {user.role === 'CTA' && (
                  <>
                    <li className="nav-item active">
                      <Link className="nav-link" aria-current="page" to="/" onClick={hideNavbar}>
                        Home
                      </Link>
                    </li>
                    <li className="nav-item active flex">
                      <Link className="nav-link" aria-current="page" to="/appointments" onClick={hideNavbar}>
                        Appointments
                      </Link>
                    </li>
                    <li className="nav-item active flex">
                      <Link className="nav-link" aria-current="page" to="/tickets" onClick={hideNavbar}>
                        Tickets
                      </Link>
                    </li>
                    <li className="nav-item active flex">
                      <Link className="nav-link" aria-current="page" to="/clients" onClick={hideNavbar}>
                        Clients
                      </Link>
                    </li>
                    <li className="nav-item active flex">
                      <Link className="nav-link" aria-current="page" to="/locations" onClick={hideNavbar}>
                        Locations
                      </Link>
                    </li>
                    <li className="nav-item active flex">
                      <Link className="nav-link" aria-current="page" to="/courses" onClick={hideNavbar}>
                        Courses
                      </Link>
                    </li>
                  </>
                )}
                {user.role === 'Inventory' && (
                  <>
                    <li className="nav-item active flex">
                      <Link className="nav-link" aria-current="page" to="/inventory" onClick={hideNavbar}>
                        Inventory
                      </Link>
                    </li>
                    <li className="nav-item active flex">
                      <Link className="nav-link" aria-current="page" to="/donors" onClick={hideNavbar}>
                        Donors
                      </Link>
                    </li>
                  </>
                )}
                {user.isAdmin && (
                  <li className="nav-item active flex">
                    <Link className="nav-link" aria-current="page" to="/admin/users" onClick={hideNavbar}>
                      Users
                    </Link>
                  </li>
                )}
              </>
            )}
            <div className="flex-grow-1 d-flex justify-content-end">
              {user && (
                <>
                  {user.isAdmin && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin" onClick={hideNavbar}>
                        Admin
                      </Link>
                    </li>
                  )}
                  <li className="nav-item me-3">
                    <span className="nav-link d-inline-block me-1">
                      Hello,{' '}
                      <Link to="/account" onClick={hideNavbar}>
                        {user.firstName}!
                      </Link>
                    </span>
                    {user.pictureUrl && <div className="header__picture" style={{ backgroundImage: `url(${user.pictureUrl})` }}></div>}
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/logout" onClick={onLogout}>
                      Log out
                    </a>
                  </li>
                </>
              )}
              {!user && (
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={hideNavbar}>
                    Log in
                  </Link>
                </li>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
