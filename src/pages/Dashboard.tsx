import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

const statItems = [
  { label: 'Usuarios', icon: '👥', key: 'users' },
  { label: 'Sesiones', icon: '📅', key: 'sessions' },
  { label: 'Preguntas', icon: '💬', key: 'questions' },
  { label: 'Leads', icon: '✉️', key: 'leads' }
];

export function Dashboard() {
  const [stats, setStats] = useState({ users: 0, sessions: 0, questions: 0, leads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, sessionsRes, questionsRes, leadsRes] = await Promise.all([
          apiFetch('/v1/admin/users'),
          apiFetch('/v1/admin/sessions'),
          apiFetch('/v1/admin/questions/export.csv'),
          apiFetch('/v1/admin/leads/export.csv')
        ]);

        const users = await usersRes.json();
        const sessions = await sessionsRes.json();
        const questionsText = await questionsRes.text();
        const leadsText = await leadsRes.text();

        setStats({
          users: users.data?.length ?? 0,
          sessions: sessions.data?.length ?? 0,
          questions: questionsText ? questionsText.split('\n').length - 1 : 0,
          leads: leadsText ? leadsText.split('\n').length - 1 : 0
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
          <div key={item.key} className="stat-card">
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">{stats[item.key as keyof typeof stats]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
