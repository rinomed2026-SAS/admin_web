import { CrudPage } from '../components/CrudPage';

export function Sessions() {
  return (
    <CrudPage
      title="Sesiones"
      endpoint="sessions"
      fields={[
        { name: 'day', label: 'Día', type: 'date' },
        { name: 'startTime', label: 'Inicio' },
        { name: 'endTime', label: 'Fin' },
        { name: 'room', label: 'Sala' },
        { name: 'title', label: 'Título' },
        { name: 'topic', label: 'Tema' },
        { name: 'level', label: 'Nivel' },
        { name: 'description', label: 'Descripción', type: 'textarea' }
      ]}
    />
  );
}

export function Speakers() {
  return (
    <CrudPage
      title="Speakers"
      endpoint="speakers"
      fields={[
        { name: 'name', label: 'Nombre' },
        { name: 'country', label: 'País' },
        { name: 'specialty', label: 'Especialidad' },
        { name: 'bio', label: 'Bio', type: 'textarea' },
        { name: 'photoUrl', label: 'Foto URL' },
        { name: 'websiteUrl', label: 'Página Web' },
        { name: 'instagramUrl', label: 'Instagram' }
      ]}
    />
  );
}

export function Sponsors() {
  return (
    <CrudPage
      title="Sponsors"
      endpoint="sponsors"
      fields={[
        { name: 'name', label: 'Nombre' },
        { name: 'tier', label: 'Nivel' },
        { name: 'description', label: 'Descripción', type: 'textarea' },
        { name: 'websiteUrl', label: 'Website' },
        { name: 'products', label: 'Productos' }
      ]}
    />
  );
}

export function Hotels() {
  return (
    <CrudPage
      title="Hoteles"
      endpoint="hotels"
      fields={[
        { name: 'name', label: 'Nombre' },
        { name: 'rating', label: 'Rating', type: 'number' },
        { name: 'priceMinCop', label: 'Precio min', type: 'number' },
        { name: 'priceMaxCop', label: 'Precio max', type: 'number' },
        { name: 'distanceKm', label: 'Distancia km', type: 'number' },
        { name: 'amenities', label: 'Amenidades' },
        { name: 'contact', label: 'Contacto' },
        { name: 'promoCode', label: 'Promo' }
      ]}
    />
  );
}

export function Tourism() {
  return (
    <CrudPage
      title="Turismo"
      endpoint="tourism"
      fields={[
        { name: 'name', label: 'Nombre' },
        { name: 'category', label: 'Categoría' },
        { name: 'duration', label: 'Duración' },
        { name: 'highlights', label: 'Destacados' },
        { name: 'description', label: 'Descripción', type: 'textarea' }
      ]}
    />
  );
}
