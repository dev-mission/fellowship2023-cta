import { Routes, Route } from 'react-router-dom';

import './App.scss';

import AuthContextProvider from './AuthContextProvider';
import { useStaticContext } from './StaticContext';
import AppRedirects from './AppRedirects';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import { Appointments, Clients, Donors, Inventory, Locations, Tickets } from './Pages';
import AdminRoutes from './Admin/AdminRoutes';
import InvitesRoutes from './Invites/InvitesRoutes';
import PasswordsRoutes from './Passwords/PasswordsRoutes';
import Register from './Register';
import UsersRoutes from './Users/UsersRoutes';

function App() {
  const staticContext = useStaticContext();

  return (
    <AuthContextProvider>
      <Header />
      <Routes>
        <Route
          path="*"
          element={
            <AppRedirects>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/passwords/*" element={<PasswordsRoutes />} />
                <Route path="/invites/*" element={<InvitesRoutes />} />
                {staticContext?.env?.VITE_FEATURE_REGISTRATION === 'true' && <Route path="/register" element={<Register />} />}
                <Route path="/account/*" element={<UsersRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/Appointments" element={<Appointments />} />
                <Route path="/Tickets" element={<Tickets />} />
                <Route path="/Clients" element={<Clients />} />
                <Route path="/Inventory" element={<Inventory />} />
                <Route path="/Locations" element={<Locations />} />
                <Route path="/Donors" element={<Donors />} />
              </Routes>
            </AppRedirects>
          }
        />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
