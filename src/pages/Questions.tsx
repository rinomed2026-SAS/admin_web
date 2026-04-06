import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

type AdminQuestion = {
  id: string;
  text: string;
  anonymous: boolean;
  createdAt: string;
  user: { name: string; email: string };
  session: { title: string; day: string; startTime: string };
};

export function Questions() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError('');
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

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) return;

    try {
      const response = await apiFetch(`/v1/admin/questions/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la pregunta');
      }
      
      // Recargar la lista después de eliminar
      await loadQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Error al eliminar la pregunta');
    }
  };

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
        <div className="page-actions">
          <button
            className="btn secondary"
            onClick={loadQuestions}
            disabled={loading}
          >
            🔄 Recargar
          </button>
          <a
            className="btn secondary"
            href={`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'}/v1/admin/questions/export.csv`}
          >
            Exportar CSV
          </a>
        </div>
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
                  {q.anonymous ? (
                    <>
                      <div className="qa-user">Usuario Anónimo</div>
                      <div className="qa-badge qa-badge--anonymous">🔒 Anónimo</div>
                    </>
                  ) : (
                    <>
                      <div className="qa-user">{q.user.name}</div>
                      <div className="qa-meta">{q.user.email}</div>
                    </>
                  )}
                </div>
                <div className="qa-actions">
                  <div className="qa-badge">Sesión</div>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(q.id)}
                    title="Eliminar pregunta"
                  >
                    ❌
                  </button>
                </div>
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
