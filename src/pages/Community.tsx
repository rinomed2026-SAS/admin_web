import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../api';

type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type CommunitySubmission = {
  id: string;
  userName: string;
  originalImageUrl: string;
  composedImageUrl: string | null;
  allowGallery: boolean;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
};

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
};

const STATUS_CLASS: Record<SubmissionStatus, string> = {
  PENDING: 'badge badge--pending',
  APPROVED: 'badge badge--approved',
  REJECTED: 'badge badge--rejected',
};

type FilterStatus = 'ALL' | SubmissionStatus;

export function Community() {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [updating, setUpdating] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiFetch('/v1/community/submissions');
      if (!response.ok) throw new Error('No se pudieron cargar las submissions');
      const body = await response.json();
      setSubmissions(body.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setUpdating(id);
    try {
      const response = await apiFetch(`/v1/community/submissions/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('No se pudo actualizar el estado');
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'ALL' ? submissions : submissions.filter((s) => s.status === filter);

  const counts = {
    ALL: submissions.length,
    PENDING: submissions.filter((s) => s.status === 'PENDING').length,
    APPROVED: submissions.filter((s) => s.status === 'APPROVED').length,
    REJECTED: submissions.filter((s) => s.status === 'REJECTED').length,
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <section className="page">
      <div className="page-header">
        <img src="/logo-rinomed.svg" alt="RinoMed" className="brand-logo" />
        <div>
          <h2>Comunidad RINOMED</h2>
          <p className="page-sub">Modera las imágenes enviadas por la comunidad</p>
        </div>
        <button className="btn secondary" onClick={load} disabled={loading}>
          {loading ? 'Cargando…' : '↻ Recargar'}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="community-filters">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as FilterStatus[]).map((f) => (
          <button
            key={f}
            className={`community-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            <span className={`community-filter-dot community-filter-dot--${f.toLowerCase()}`} />
            {f === 'ALL' ? 'Todas' : STATUS_LABEL[f as SubmissionStatus]}
            <span className="community-filter-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card">Cargando submissions…</div>
      ) : filtered.length === 0 ? (
        <div className="card community-empty">
          <span style={{ fontSize: 40 }}>🖼️</span>
          <p>No hay submissions {filter !== 'ALL' ? `con estado "${STATUS_LABEL[filter as SubmissionStatus]}"` : 'todavía'}.</p>
        </div>
      ) : (
        <div className="community-grid">
          {filtered.map((sub) => (
            <article key={sub.id} className="community-card">
              <div
                className="community-card__img-wrap"
                onClick={() => setLightbox(sub.composedImageUrl ?? sub.originalImageUrl)}
                title="Ver en grande"
              >
                <img
                  src={sub.composedImageUrl ?? sub.originalImageUrl}
                  alt={`Imagen de ${sub.userName}`}
                  className="community-card__img"
                  loading="lazy"
                />
                <div className="community-card__img-overlay"><span>🔍 Ver</span></div>
              </div>

              <div className="community-card__body">
                <div className="community-card__row">
                  <span className="community-card__name">{sub.userName}</span>
                  <span className={STATUS_CLASS[sub.status]}>{STATUS_LABEL[sub.status]}</span>
                </div>
                <div className="community-card__meta">
                  <span>{formatDate(sub.createdAt)}</span>
                  {sub.allowGallery && <span className="badge badge--gallery">Galería pública</span>}
                </div>

                {sub.status === 'PENDING' && (
                  <div className="community-card__actions">
                    <button className="btn btn-sm success" disabled={updating === sub.id} onClick={() => updateStatus(sub.id, 'APPROVED')}>✓ Aprobar</button>
                    <button className="btn btn-sm danger"  disabled={updating === sub.id} onClick={() => updateStatus(sub.id, 'REJECTED')}>✕ Rechazar</button>
                  </div>
                )}
                {sub.status === 'APPROVED' && (
                  <div className="community-card__actions">
                    <button className="btn btn-sm danger" disabled={updating === sub.id} onClick={() => updateStatus(sub.id, 'REJECTED')}>✕ Rechazar</button>
                  </div>
                )}
                {sub.status === 'REJECTED' && (
                  <div className="community-card__actions">
                    <button className="btn btn-sm success" disabled={updating === sub.id} onClick={() => updateStatus(sub.id, 'APPROVED')}>✓ Aprobar</button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="community-lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
        >
          <button className="community-lightbox__close" onClick={() => setLightbox(null)} aria-label="Cerrar">✕</button>
          <img
            src={lightbox}
            alt="Vista ampliada"
            className="community-lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
