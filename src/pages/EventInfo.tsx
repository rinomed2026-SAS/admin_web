import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

const defaultState = {
  name: '',
  city: '',
  dates: '',
  venue: '',
  address: '',
  email: '',
  phone: '',
  whatsapp: '',
  website: '',
  mapsUrl: '',
  academicHours: ''
};

export function EventInfo() {
  const [form, setForm] = useState(defaultState);

  useEffect(() => {
    const load = async () => {
      const response = await apiFetch('/v1/event-info');
      const data = await response.json();
      if (data.data) setForm({ ...defaultState, ...data.data });
    };
    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await apiFetch('/v1/admin/event-info', {
      method: 'PUT',
      body: JSON.stringify(form)
    });
    alert('Información guardada');
  };

  return (
    <section className="page">
      <h2>Info Evento</h2>
      <form className="card" onSubmit={handleSubmit}>
        <div className="form-grid">
          {Object.keys(defaultState).map((key) => (
            <label key={key}>
              {key}
              <input value={(form as any)[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </label>
          ))}
        </div>
        <button className="btn" type="submit">Guardar</button>
      </form>
    </section>
  );
}
