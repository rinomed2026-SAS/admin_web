import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export function Leads() {
  const [rows, setRows] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const response = await apiFetch('/v1/admin/leads/export.csv');
      setRows(await response.text());
    };
    load();
  }, []);

  return (
    <section className="page">
      <h2>Leads Sponsors</h2>
      <a className="btn" href={`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'}/v1/admin/leads/export.csv`}>
        Exportar CSV
      </a>
      <pre className="csv-preview">{rows}</pre>
    </section>
  );
}
