import { useState } from 'react';
import { setTokens } from '../auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export function Login() {
  const [email, setEmail] = useState('review@rinomed2026.com');
  const [password, setPassword] = useState('Rinomed2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        setError('Credenciales inválidas');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setTokens(data.accessToken, data.refreshToken);
      window.location.href = '/';
    } catch (err) {
      setError('Error de conexión al servidor');
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="card" onSubmit={handleLogin}>
        <img src="/logo-rinomed.svg" alt="RinoMed 2026" className="brand-logo" />
        <h1 className="sr-only">RINOMED 2026</h1>
        <p className="rinomed-sub">Panel Administrativo</p>

        {error && <div className="alert error">⚠️ {error}</div>}

        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@rinomed2026.com"
            disabled={loading}
          />
        </label>

        <label>
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </label>

        <button className="btn" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '16px', margin: '16px 0 0 0' }}>
          Credenciales de prueba incluidas
        </p>
      </form>
    </div>
  );
}
