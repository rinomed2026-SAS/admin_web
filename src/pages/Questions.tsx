import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

type AdminQuestion = {
  id: string;
  text: string;
  createdAt: string;
  user: { name: string; email: string };
  session: { title: string; day: string; startTime: string };
};

export function Questions() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/v1/admin/questions');
        if (!response.ok) throw new Error('No se pudieron cargar las preguntas');
        const body = await response.json();
        setQuestions(body.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

  const formatSession = (day: string, startTime: string) => {
    const parsed = new Date(day);
    if (Number.isNaN(parsed.getTime())) return startTime;
    return `${parsed.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })} · ${startTime}`;
  };

  return (
    <section className="page">
      <div className="page-header">
        <img src="/logo-rinomed.svg" alt="RinoMed" className="brand-logo" />
        <div>
          <h2>Preguntas de la app</h2>
          <p className="page-sub">Dashboard rápido de Q&A enviado por los asistentes</p>
        </div>
        <a
          className="btn secondary"
          href={`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'}/v1/admin/questions/export.csv`}
        >
          Exportar CSV
        </a>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <div className="card">Cargando preguntas…</div>
      ) : questions.length === 0 ? (
        <div className="card">Aún no hay preguntas enviadas.</div>
      ) : (
        <div className="qa-grid">
          {questions.map((q) => (
            <article key={q.id} className="qa-card">
              <div className="qa-card__top">
                <div>
                  <div className="qa-user">{q.user.name}</div>
                  <div className="qa-meta">{q.user.email}</div>
                </div>
                <div className="qa-badge">Sesión</div>
              </div>

              <div className="qa-session">{q.session.title}</div>
              <div className="qa-meta">{formatSession(q.session.day, q.session.startTime)}</div>

              <p className="qa-text">{q.text}</p>

              <div className="qa-footer">
                <span className="qa-meta">Enviada: {formatDate(q.createdAt)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
