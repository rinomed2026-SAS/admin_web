import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../api';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type UserForm = Partial<User> & {
  password?: string;
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

const roleLabels: Record<string, string> = Object.fromEntries(
  roleOptions.map((r) => [r.value, r.label])
);

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof User | 'none'>('none');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [form, setForm] = useState<UserForm>({ role: 'ASSISTANT' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const load = async () => {
    setError('');
    try {
      const response = await apiFetch('/v1/admin/users');

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando usuarios');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const path = editingId ? `/v1/admin/users/${editingId}` : '/v1/admin/users';

      const body: Record<string, string | undefined> = {
        name: form.name,
        email: form.email,
        role: form.role,
      };

      if (form.password?.trim()) {
        body.password = form.password;
      }

      const response = await apiFetch(path, {
        method,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let msg = `Error ${response.status}`;

        try {
          const errorData = await response.json();
          msg =
            Object.values(errorData?.errors?.fieldErrors || {})
              .flat()
              .join(', ') ||
            errorData?.message ||
            msg;
        } catch {
          // si no viene JSON válido, dejamos el mensaje genérico
        }

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
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });

    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const firstInput = formRef.current.querySelector(
          'input, textarea, select'
        ) as HTMLElement | null;
        firstInput?.focus();
      }
    }, 0);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar usuario?')) return;

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await apiFetch(`/v1/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        let msg = `Error ${response.status}`;

        try {
          const errorData = await response.json();
          msg = errorData?.message || msg;
        } catch {
          // fallback al genérico
        }

        throw new Error(msg);
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

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();

    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (roleLabels[u.role]?.toLowerCase().includes(q) ?? false)
    );
  });

  const sortedUsers = [...filteredUsers];

  if (sortBy !== 'none') {
    sortedUsers.sort((a, b) => {
      let v1: string | number = a[sortBy] ?? '';
      let v2: string | number = b[sortBy] ?? '';

      if (sortBy === 'createdAt') {
        v1 = new Date(v1 as string).getTime();
        v2 = new Date(v2 as string).getTime();
      } else {
        v1 = String(v1).toLowerCase();
        v2 = String(v2).toLowerCase();
      }

      if (v1 < v2) return sortDir === 'asc' ? -1 : 1;
      if (v1 > v2) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <section className="page">
      <h2>Usuarios</h2>

      <div
        style={{
          margin: '24px 0 16px 0',
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o rol..."
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: '2px solid var(--color-accent)',
            background: '#23232b',
            color: 'white',
            minWidth: 260,
            fontSize: 16,
            fontWeight: 500,
            outline: 'none',
            boxShadow: '0 2px 12px #0004',
          }}
        />
      </div>

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
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'rgba(0,0,0,0.3)',
                color: 'white',
              }}
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
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
          <div
            style={{ cursor: 'pointer', color: sortBy === 'name' ? 'var(--color-accent)' : undefined }}
            onClick={() => {
              setSortDir(sortBy === 'name' && sortDir === 'asc' ? 'desc' : 'asc');
              setSortBy('name');
            }}
          >
            Nombre {sortBy === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
          </div>

          <div
            style={{ cursor: 'pointer', color: sortBy === 'email' ? 'var(--color-accent)' : undefined }}
            onClick={() => {
              setSortDir(sortBy === 'email' && sortDir === 'asc' ? 'desc' : 'asc');
              setSortBy('email');
            }}
          >
            Email {sortBy === 'email' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
          </div>

          <div
            style={{ cursor: 'pointer', color: sortBy === 'role' ? 'var(--color-accent)' : undefined }}
            onClick={() => {
              setSortDir(sortBy === 'role' && sortDir === 'asc' ? 'desc' : 'asc');
              setSortBy('role');
            }}
          >
            Rol {sortBy === 'role' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
          </div>

          <div
            style={{ cursor: 'pointer', color: sortBy === 'createdAt' ? 'var(--color-accent)' : undefined }}
            onClick={() => {
              setSortDir(sortBy === 'createdAt' && sortDir === 'asc' ? 'desc' : 'asc');
              setSortBy('createdAt');
            }}
          >
            Creado {sortBy === 'createdAt' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
          </div>

          <div>Acciones</div>
        </div>

        {sortedUsers.map((user) => (
          <div className="table-row" key={user.id}>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{roleLabels[user.role] ?? user.role}</div>
            <div>{new Date(user.createdAt).toLocaleDateString()}</div>
            <div className="actions">
              <button
                type="button"
                className="btn secondary"
                onClick={() => handleEdit(user)}
                disabled={loading}
              >
                Editar
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={() => handleDelete(user.id)}
                disabled={loading}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}