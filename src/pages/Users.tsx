import { useEffect, useState, useRef } from 'react';
import { apiFetch } from '../api';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

const roleOptions = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'STAFF', label: 'Staff' },
  { value: 'SPEAKER', label: 'Ponente' },
  { value: 'COMMITTEE', label: 'Comité Científico' },
  { value: 'ASSISTANT', label: 'Asistente' },
  { value: 'ASSISTANT_SURGICAL', label: 'Asistente Quirúrgico' },
  { value: 'ASSISTANT_VIRTUAL', label: 'Asistente Virtual' },
  { value: 'SPONSOR', label: 'Patrocinador' },
];

const roleLabels: Record<string, string> = Object.fromEntries(roleOptions.map(r => [r.value, r.label]));

  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Partial<User> & { password?: string }>({ role: 'ASSISTANT' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const load = async () => {
    const response = await apiFetch('/v1/admin/users');
    const data = await response.json();
    setUsers(data.data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const path = editingId ? `/v1/admin/users/${editingId}` : '/v1/admin/users';
      const body: any = {
        name: form.name,
        email: form.email,
        role: form.role,
      };
      if (form.password) body.password = form.password;

      const response = await apiFetch(path, {
        method,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.errors
          ? Object.values(errorData.errors.fieldErrors || {}).flat().join(', ')
          : errorData.message || `Error ${response.status}`;
        throw new Error(msg);
      }

      setForm({ role: 'ASSISTANT' });
      setEditingId(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const firstInput = formRef.current.querySelector('input, textarea, select') as HTMLElement;
        if (firstInput) firstInput.focus();
      }
    }, 0);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar usuario?')) return;
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      const response = await apiFetch(`/v1/admin/users/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <h2>Usuarios</h2>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">Cambios guardados</div>}

      <form className="card" onSubmit={handleSubmit} ref={formRef}>
        <div className="form-grid">
          <label>
            Nombre
            <input
              required
              value={form.name ?? ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nombre completo"
              disabled={loading}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={form.email ?? ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="correo@rinomed.com"
              disabled={loading}
            />
          </label>
          <label>
            Rol
            <select
              value={form.role ?? 'ASSISTANT'}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              disabled={loading}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </label>
          <label>
            Contraseña {editingId ? '(opcional al editar)' : ''}
            <input
              type="password"
              value={form.password ?? ''}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              disabled={loading}
            />
          </label>
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {editingId ? 'Actualizar' : 'Crear'}
        </button>
      </form>

      <div className="table">
        <div className="table-row header">
          <div>Nombre</div>
          <div>Email</div>
          <div>Rol</div>
          <div>Creado</div>
          <div>Acciones</div>
        </div>
        {users.map((user) => (
          <div className="table-row" key={user.id}>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{roleLabels[user.role] ?? user.role}</div>
            <div>{new Date(user.createdAt).toLocaleDateString()}</div>
            <div className="actions">
              <button className="btn secondary" onClick={() => handleEdit(user)} disabled={loading}>Editar</button>
              <button className="btn danger" onClick={() => handleDelete(user.id)} disabled={loading}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
