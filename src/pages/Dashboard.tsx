import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

const statItems = [
  { label: 'Usuarios', icon: '👥', key: 'users', path: '/users' },
  { label: 'Sesiones', icon: '📅', key: 'sessions', path: '/sessions' },
  { label: 'Preguntas', icon: '💬', key: 'questions', path: '/questions' },
  { label: 'Leads', icon: '✉️', key: 'leads', path: '/leads' },
  { label: 'Encuestas', icon: '📊', key: 'surveys', path: '/surveys' },
  { label: 'Comunidad', icon: '📸', key: 'community', path: '/community' },
  { label: 'Ponentes', icon: '🎤', key: 'speakers', path: '/speakers' },
  { label: 'Patrocinadores', icon: '🏢', key: 'sponsors', path: '/sponsors' }
];

export function Dashboard() {
  const [stats, setStats] = useState({
    users: 0, sessions: 0, questions: 0, leads: 0,
    surveys: 0, community: 0, speakers: 0, sponsors: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/v1/admin/stats');
        const result = await response.json();
        setStats(result.data);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatClick = (path: string) => {
    navigate(path);
  };

  return (
    <section className="page">
      <div className="page-header">
        <img src="/logo-rinomed.svg" alt="RinoMed 2026" className="brand-logo" />
        <div>
          <h2>Dashboard</h2>
          <p className="page-sub">Panel de control</p>
        </div>
      </div>
      <div className="stats">
        {statItems.map((item) => (
          <div 
            key={item.key} 
            className="stat-card stat-card--clickable"
            onClick={() => handleStatClick(item.path)}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">
              {loading ? '...' : stats[item.key as keyof typeof stats]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
