import { useEffect, useState, useRef } from 'react';
import { apiFetch } from '../api';

export type Field = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'date' | 'file';
  required?: boolean;
  accept?: string;
  uploadTarget?: string;
};

type CrudPageProps = {
  title: string;
  endpoint: string;
  fields: Field[];
};

function formatValidationErrors(errors: any): string {
  if (errors.fieldErrors) {
    const msgs = Object.entries(errors.fieldErrors)
      .map(([field, msgs]: [string, any]) => `${field}: ${(msgs as string[]).join(', ')}`)
      .join('; ');
    return msgs || 'Validation failed';
  }
  return 'Validation failed';
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(file);
  });
}

export function CrudPage({ title, endpoint, fields }: CrudPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, any>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const load = async () => {
    try {
      const response = await apiFetch(`/v1/admin/${endpoint}`);
      if (!response.ok) {
        setError(`Error al cargar: ${response.statusText}`);
        return;
      }
      const data = await response.json();
      setItems(data.data ?? []);
      setError('');
    } catch (err) {
      setError(`Error de conexión: ${err instanceof Error ? err.message : 'desconocido'}`);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const path = editingId ? `/v1/admin/${endpoint}/${editingId}` : `/v1/admin/${endpoint}`;
      const response = await apiFetch(path, {
        method,
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.errors 
          ? formatValidationErrors(errorData.errors)
          : errorData.message || `Error ${response.status}`;
        throw new Error(errorMsg);
      }

      setForm({});
      setEditingId(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      await load();
    } catch (err) {
      setError(`Error al guardar: ${err instanceof Error ? err.message : 'desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    const normalized: Record<string, any> = { ...item };
    fields.forEach((field) => {
      if (field.type === 'date' && item[field.name]) {
        normalized[field.name] = String(item[field.name]).split('T')[0];
      }
    });
    setEditingId(item.id);
    setForm(normalized);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Opcional: también puedes hacer focus en el primer input
        const firstInput = formRef.current.querySelector('input, textarea, select') as HTMLElement;
        if (firstInput) firstInput.focus();
      }
    }, 0);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar registro?')) return;
    setLoading(true);
    setError('');
    try {
      const response = await apiFetch(`/v1/admin/${endpoint}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      await load();
    } catch (err) {
      setError(`Error al eliminar: ${err instanceof Error ? err.message : 'desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <h2>{title}</h2>
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">¡Operación exitosa!</div>}
      <form className="card" onSubmit={handleSubmit} ref={formRef}>
        <div className="form-grid">
          {fields.map((field) => (
            <label key={field.name}>
              {field.label}
              {field.type === 'textarea' ? (
                <textarea
                  value={form[field.name] ?? ''}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  disabled={loading}
                />
              ) : field.type === 'file' ? (
                <>
                  <input
                    type="file"
                    accept={field.accept ?? 'image/*'}
                    disabled={loading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const dataUrl = await fileToDataUrl(file);
                        const target = field.uploadTarget ?? field.name;
                        setForm((prev) => ({ ...prev, [target]: dataUrl }));
                      } catch (err) {
                        setError(`Error al cargar archivo: ${err instanceof Error ? err.message : 'desconocido'}`);
                      }
                    }}
                  />
                  {!!form[field.uploadTarget ?? field.name] && (
                    <img
                      src={form[field.uploadTarget ?? field.name]}
                      alt={field.label}
                      style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }}
                    />
                  )}
                </>
              ) : (
                <input
                  type={field.type ?? 'text'}
                  value={form[field.name] ?? ''}
                  onChange={(e) => setForm({ ...form, [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                  disabled={loading}
                />
              )}
            </label>
          ))}
        </div>
        <button className="btn" type="submit" disabled={loading}>{editingId ? 'Actualizar' : 'Crear'}</button>
      </form>
      <div className="table">
        <div className="table-row header">
          {fields.map((field) => (
            <div key={field.name}>{field.label}</div>
          ))}
          <div>Acciones</div>
        </div>
        {items.map((item) => (
          <div className="table-row" key={item.id}>
            {fields.map((field) => (
              <div key={field.name}>
                {field.type === 'file' ? (
                  item[field.uploadTarget ?? field.name] ? (
                    <img
                      src={String(item[field.uploadTarget ?? field.name])}
                      alt={field.label}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  ) : (
                    'Sin imagen'
                  )
                ) : (
                  String(item[field.name] ?? '')
                )}
              </div>
            ))}
            <div className="actions">
              <button className="btn secondary" onClick={() => handleEdit(item)}>Editar</button>
              <button className="btn danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
