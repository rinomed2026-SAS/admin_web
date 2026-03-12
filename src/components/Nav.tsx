import { NavLink } from 'react-router-dom';
import { clearTokens } from '../auth';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/sessions', label: 'Sesiones', icon: '📅' },
  { path: '/speakers', label: 'Speakers', icon: '👥' },
  { path: '/sponsors', label: 'Sponsors', icon: '💼' },
  { path: '/hotels', label: 'Hoteles', icon: '🏨' },
  { path: '/tourism', label: 'Turismo', icon: '🗺️' },
  { path: '/event-info', label: 'Info Evento', icon: 'ℹ️' },
  { path: '/questions', label: 'Q&A', icon: '💬' },
  { path: '/leads', label: 'Leads', icon: '✉️' },
  { path: '/users', label: 'Usuarios', icon: '👤' }
];

export function Nav() {
  const handleLogout = () => {
    clearTokens();
    window.location.href = '/login';
  };

  return (
    <nav className="nav">
      <div className="nav-brand">
        <img src="/logo-rinomed.svg" alt="RinoMed 2026" className="brand-logo" />
        <span className="sr-only">RINOMED 2026</span>
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="nav-logout">
        <button onClick={handleLogout}>
          <span>🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}
