import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

interface CertificateConfig {
  id: number;
  mainTitle: string;
  introText: string;
  participationText: string;
  eventText: string;
  issuedText: string;
  validationText: string;
}

const defaultState: CertificateConfig = {
  id: 1,
  mainTitle: 'CERTIFICADO DE PARTICIPACIÓN',
  introText: 'Se certifica que',
  participationText: 'ha participado como {subtitle} con una intensidad de {hours} horas',
  eventText: 'en {eventName}',
  issuedText: 'Expedido en {city}, {date}',
  validationText: 'Código de validación:'
};

export function CertificateConfig() {
  const [form, setForm] = useState(defaultState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/v1/admin/certificate-config');
        const data = await response.json();
        if (data.data) setForm({ ...defaultState, ...data.data });
      } catch (error) {
        console.error('Error loading certificate config:', error);
      }
    };
    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/v1/admin/certificate-config', {
        method: 'PUT',
        body: JSON.stringify(form)
      });
      alert('Configuración del certificado guardada exitosamente');
    } catch (error) {
      console.error('Error saving certificate config:', error);
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <h2>Configuración del Certificado</h2>
      <p className="page-description">
        Personaliza los textos que aparecen en los certificados generados. 
        Puedes usar los siguientes placeholders: {'{subtitle}'}, {'{hours}'}, {'{eventName}'}, {'{city}'}, {'{date}'}
      </p>
      
      <form className="card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Título Principal</span>
            <input
              type="text"
              value={form.mainTitle}
              onChange={(e) => setForm({ ...form, mainTitle: e.target.value })}
              placeholder="CERTIFICADO DE PARTICIPACIÓN"
              disabled={loading}
              required
            />
            <small>El título principal del certificado</small>
          </label>

          <label>
            <span>Texto de Introducción</span>
            <input
              type="text"
              value={form.introText}
              onChange={(e) => setForm({ ...form, introText: e.target.value })}
              placeholder="Se certifica que"
              disabled={loading}
              required
            />
            <small>Texto que aparece antes del nombre del usuario</small>
          </label>

          <label>
            <span>Texto de Participación</span>
            <input
              type="text"
              value={form.participationText}
              onChange={(e) => setForm({ ...form, participationText: e.target.value })}
              placeholder="ha participado como {subtitle} con una intensidad de {hours} horas"
              disabled={loading}
              required
            />
            <small>Usa {'{subtitle}'} para el tipo de participante y {'{hours}'} para las horas</small>
          </label>

          <label>
            <span>Texto del Evento</span>
            <input
              type="text"
              value={form.eventText}
              onChange={(e) => setForm({ ...form, eventText: e.target.value })}
              placeholder="en {eventName}"
              disabled={loading}
              required
            />
            <small>Usa {'{eventName}'} para el nombre del evento</small>
          </label>

          <label>
            <span>Texto de Emisión</span>
            <input
              type="text"
              value={form.issuedText}
              onChange={(e) => setForm({ ...form, issuedText: e.target.value })}
              placeholder="Expedido en {city}, {date}"
              disabled={loading}
              required
            />
            <small>Usa {'{city}'} para la ciudad y {'{date}'} para la fecha</small>
          </label>

          <label>
            <span>Texto de Validación</span>
            <input
              type="text"
              value={form.validationText}
              onChange={(e) => setForm({ ...form, validationText: e.target.value })}
              placeholder="Código de validación:"
              disabled={loading}
              required
            />
            <small>Texto que aparece antes del código de validación</small>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3>Vista Previa</h3>
        <div className="certificate-preview">
          <div className="preview-section">
            <strong>{form.mainTitle}</strong>
          </div>
          <div className="preview-section">
            {form.introText}
          </div>
          <div className="preview-section">
            <strong>NOMBRE DEL USUARIO</strong>
          </div>
          <div className="preview-section">
            {form.participationText.replace('{subtitle}', 'asistente').replace('{hours}', '20')}
          </div>
          <div className="preview-section">
            {form.eventText.replace('{eventName}', 'RINOMED 2026')}
          </div>
          <div className="preview-section">
            <small>{form.issuedText.replace('{city}', 'Medellín').replace('{date}', 'abril de 2026')}</small>
          </div>
          <div className="preview-section">
            <small>{form.validationText} RINO-12345678</small>
          </div>
        </div>
      </div>
    </section>
  );
}