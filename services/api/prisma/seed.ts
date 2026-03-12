import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/lib/auth.js';

const day1 = new Date('2026-04-17T00:00:00.000Z');
const day2 = new Date('2026-04-18T00:00:00.000Z');

async function main() {
  await prisma.refreshToken.deleteMany();
  await prisma.sponsorLead.deleteMany();
  await prisma.question.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.sessionSpeaker.deleteMany();
  await prisma.session.deleteMany();
  await prisma.speaker.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.tourism.deleteMany();
  await prisma.eventInfo.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hashPassword('Rinomed2026!');
  const attendeePassword = await hashPassword('Rinomed2026!');

  const adminUser = await prisma.user.create({
    data: {
      name: 'Reviewer Admin',
      email: 'review@rinomed2026.com',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  });

  await prisma.user.create({
    data: {
      name: 'Demo Attendee',
      email: 'attendee@rinomed2026.com',
      passwordHash: attendeePassword,
      role: 'ASSISTANT'
    }
  });

  await prisma.eventInfo.create({
    data: {
      id: 1,
      name: 'Congreso de Rinología y Otorrinolaringología RINOMED 2026',
      city: 'Medellín',
      dates: '17–18 abril 2026',
      venue: 'Centro de Eventos El Tesoro',
      address: 'Cra. 25a #1A Sur-45, Medellín',
      email: 'info@rinomed2026.com',
      phone: '+57 604 0000000',
      whatsapp: '+57 300 0000000',
      website: 'https://rinomed2026.com',
      mapsUrl: 'https://maps.google.com/?q=Centro+de+Eventos+El+Tesoro',
      academicHours: '20 horas académicas'
    }
  });

  const speakers = await Promise.all([
    prisma.speaker.create({
      data: {
        name: 'Dr. Michael Rosen',
        country: 'USA',
        specialty: 'Rinología avanzada',
        bio: 'Cirujano especializado en rinosinusitis crónica y cirugía endoscópica.',
        photoUrl: 'https://placehold.co/300x300'
      }
    }),
    prisma.speaker.create({
      data: {
        name: 'Dra. Laura Bianchi',
        country: 'Italia',
        specialty: 'Otología',
        bio: 'Experta en abordajes mínimamente invasivos de oído medio.',
        photoUrl: 'https://placehold.co/300x300'
      }
    }),
    prisma.speaker.create({
      data: {
        name: 'Dr. Kenji Nakamura',
        country: 'Japón',
        specialty: 'Base de cráneo',
        bio: 'Investigador en técnicas de navegación y seguridad quirúrgica.',
        photoUrl: 'https://placehold.co/300x300'
      }
    }),
    prisma.speaker.create({
      data: {
        name: 'Dr. Alejandro Ruiz',
        country: 'México',
        specialty: 'Rinología pediátrica',
        bio: 'Lidera programas de rinología pediátrica y alergias.',
        photoUrl: 'https://placehold.co/300x300'
      }
    }),
    prisma.speaker.create({
      data: {
        name: 'Dra. Valentina Gómez',
        country: 'Colombia',
        specialty: 'Otorrinolaringología clínica',
        bio: 'Docente universitaria y conferencista nacional.',
        photoUrl: 'https://placehold.co/300x300'
      }
    }),
    prisma.speaker.create({
      data: {
        name: 'Dr. Felipe Restrepo',
        country: 'Colombia',
        specialty: 'Cirugía endoscópica',
        bio: 'Especialista en cirugía endoscópica nasal y formación médica.',
        photoUrl: 'https://placehold.co/300x300'
      }
    }),
    prisma.speaker.create({
      data: {
        name: 'Dra. Natalia Ruiz',
        country: 'Colombia',
        specialty: 'Alergias y rinitis',
        bio: 'Investigadora en tratamientos innovadores para rinitis.',
        photoUrl: 'https://placehold.co/300x300'
      }
    })
  ]);

  const sessionsData = [
    { day: day1, startTime: '08:00', endTime: '08:45', room: 'Sala A', title: 'Bienvenida y apertura', topic: 'Institucional', level: 'General', description: 'Apertura oficial del congreso.' },
    { day: day1, startTime: '09:00', endTime: '09:45', room: 'Sala A', title: 'Rinitis alérgica: panorama 2026', topic: 'Alergia', level: 'Intermedio', description: 'Actualización en diagnóstico y tratamiento.' },
    { day: day1, startTime: '10:00', endTime: '10:45', room: 'Sala A', title: 'Cirugía endoscópica funcional', topic: 'Cirugía', level: 'Avanzado', description: 'Técnicas y casos complejos.' },
    { day: day1, startTime: '11:00', endTime: '11:45', room: 'Sala B', title: 'Otología en práctica clínica', topic: 'Otología', level: 'Intermedio', description: 'Manejo integral del paciente.' },
    { day: day1, startTime: '12:00', endTime: '12:45', room: 'Sala B', title: 'Rinosinusitis crónica', topic: 'Rinología', level: 'Intermedio', description: 'Estrategias basadas en evidencia.' },
    { day: day1, startTime: '14:00', endTime: '14:45', room: 'Sala A', title: 'Base de cráneo y navegación', topic: 'Base de cráneo', level: 'Avanzado', description: 'Seguridad y nuevas herramientas.' },
    { day: day1, startTime: '15:00', endTime: '15:45', room: 'Sala A', title: 'Rinología pediátrica actual', topic: 'Pediatría', level: 'Intermedio', description: 'Abordajes y retos en pediatría.' },
    { day: day1, startTime: '16:00', endTime: '16:45', room: 'Sala B', title: 'Taller de casos clínicos', topic: 'Workshop', level: 'General', description: 'Discusión interactiva de casos.' },
    { day: day1, startTime: '17:00', endTime: '17:45', room: 'Sala B', title: 'Tecnologías en ORL', topic: 'Innovación', level: 'General', description: 'Herramientas digitales para especialistas.' },
    { day: day1, startTime: '18:00', endTime: '18:30', room: 'Sala A', title: 'Resumen del día 1', topic: 'Cierre', level: 'General', description: 'Conclusiones y próximos pasos.' },
    { day: day1, startTime: '08:00', endTime: '08:45', room: 'Sala C', title: 'Actualización en rinoplastia', topic: 'Estética', level: 'Avanzado', description: 'Tendencias 2026.' },
    { day: day1, startTime: '09:00', endTime: '09:45', room: 'Sala C', title: 'Manejo de apnea del sueño', topic: 'Sueño', level: 'Intermedio', description: 'Abordajes combinados.' },
    { day: day2, startTime: '08:00', endTime: '08:45', room: 'Sala A', title: 'Innovación en dispositivos ORL', topic: 'Innovación', level: 'General', description: 'Nuevos dispositivos y prácticas.' },
    { day: day2, startTime: '09:00', endTime: '09:45', room: 'Sala A', title: 'Rinología avanzada', topic: 'Rinología', level: 'Avanzado', description: 'Casos y aprendizajes.' },
    { day: day2, startTime: '10:00', endTime: '10:45', room: 'Sala A', title: 'Cirugía endoscópica 2.0', topic: 'Cirugía', level: 'Avanzado', description: 'Técnicas mínimamente invasivas.' },
    { day: day2, startTime: '11:00', endTime: '11:45', room: 'Sala B', title: 'Diagnóstico por imágenes', topic: 'Diagnóstico', level: 'Intermedio', description: 'Interpretación avanzada en ORL.' },
    { day: day2, startTime: '12:00', endTime: '12:45', room: 'Sala B', title: 'Farmacología en ORL', topic: 'Farmacología', level: 'General', description: 'Protocolos modernos.' },
    { day: day2, startTime: '14:00', endTime: '14:45', room: 'Sala A', title: 'Alergias emergentes', topic: 'Alergia', level: 'Intermedio', description: 'Tendencias y tratamientos.' },
    { day: day2, startTime: '15:00', endTime: '15:45', room: 'Sala A', title: 'Complicaciones y manejo', topic: 'Cirugía', level: 'Avanzado', description: 'Prevención y resolución.' },
    { day: day2, startTime: '16:00', endTime: '16:45', room: 'Sala B', title: 'Mesa redonda internacional', topic: 'Panel', level: 'General', description: 'Perspectivas globales en ORL.' },
    { day: day2, startTime: '17:00', endTime: '17:45', room: 'Sala B', title: 'Futuro de la especialidad', topic: 'Tendencias', level: 'General', description: 'Visión 2030.' },
    { day: day2, startTime: '18:00', endTime: '18:30', room: 'Sala A', title: 'Cierre del congreso', topic: 'Cierre', level: 'General', description: 'Palabras finales y agradecimientos.' },
    { day: day2, startTime: '10:00', endTime: '10:45', room: 'Sala C', title: 'Telemedicina en ORL', topic: 'Digital', level: 'General', description: 'Buenas prácticas y casos.' }
  ];

  const sessions = [];
  for (const data of sessionsData) {
    sessions.push(await prisma.session.create({ data }));
  }

  const speakerIds = speakers.map((speaker) => speaker.id);
  await Promise.all(
    sessions.map((session, index) =>
      prisma.sessionSpeaker.create({
        data: {
          sessionId: session.id,
          speakerId: speakerIds[index % speakerIds.length]
        }
      })
    )
  );

  await prisma.sponsor.createMany({
    data: [
      {
        name: 'MedTech Solutions',
        tier: 'Gold',
        description: 'Dispositivos de alta precisión para ORL.',
        websiteUrl: 'https://example.com/medtech',
        products: 'Endoscopios, instrumental quirúrgico'
      },
      {
        name: 'BioRino Labs',
        tier: 'Bronze',
        description: 'Innovación en tratamientos de rinitis.',
        websiteUrl: 'https://example.com/biorino',
        products: 'Sprays y terapias tópicas'
      },
      {
        name: 'AudiaCare',
        tier: 'Bronze',
        description: 'Soluciones auditivas y diagnóstico.',
        websiteUrl: 'https://example.com/audiacare',
        products: 'Audífonos y diagnósticos'
      }
    ]
  });

  await prisma.hotel.createMany({
    data: [
      {
        name: 'Hotel El Tesoro',
        rating: 4.8,
        priceMinCop: 280000,
        priceMaxCop: 320000,
        distanceKm: 0.4,
        amenities: 'WiFi, gimnasio, desayuno',
        contact: 'reservas@eltesoro.com',
        promoCode: 'RINOMED2026'
      },
      {
        name: 'Hotel Poblado Suites',
        rating: 4.5,
        priceMinCop: 220000,
        priceMaxCop: 260000,
        distanceKm: 1.2,
        amenities: 'WiFi, spa, restaurante',
        contact: 'contacto@pobladosuites.com',
        promoCode: 'RINOMED2026'
      },
      {
        name: 'Hotel Laureles',
        rating: 4.2,
        priceMinCop: 150000,
        priceMaxCop: 190000,
        distanceKm: 4.8,
        amenities: 'WiFi, desayuno',
        contact: 'info@hotellaureles.com',
        promoCode: 'RINOMED2026'
      },
      {
        name: 'Hotel Plaza Medellín',
        rating: 4.0,
        priceMinCop: 120000,
        priceMaxCop: 160000,
        distanceKm: 6.3,
        amenities: 'WiFi, café',
        contact: 'reservas@plazamedellin.com',
        promoCode: 'RINOMED2026'
      }
    ]
  });

  await prisma.tourism.createMany({
    data: [
      {
        name: 'Jardín Botánico',
        category: 'Naturaleza',
        duration: '2 horas',
        highlights: 'Orquídeas, mariposario',
        description: 'Recorrido guiado por jardines y ecosistemas.'
      },
      {
        name: 'Museo de Antioquia',
        category: 'Museo',
        duration: '2 horas',
        highlights: 'Obras de Botero',
        description: 'Visita cultural al museo principal de la ciudad.'
      },
      {
        name: 'Comuna 13 Tour',
        category: 'Cultura',
        duration: '3 horas',
        highlights: 'Graffiti, historia',
        description: 'Experiencia inmersiva en arte urbano y comunidad.'
      },
      {
        name: 'Parque Arví',
        category: 'Naturaleza',
        duration: '4 horas',
        highlights: 'Senderismo, teleférico',
        description: 'Día de naturaleza con actividades al aire libre.'
      },
      {
        name: 'Ruta Científica',
        category: 'Ciencia',
        duration: '2 horas',
        highlights: 'Planetario y parques',
        description: 'Explora ciencia y tecnología en Medellín.'
      },
      {
        name: 'Excursión Guatapé',
        category: 'Excursión',
        duration: '8 horas',
        highlights: 'Piedra del Peñol',
        description: 'Viaje de día completo a Guatapé y el embalse.'
      }
    ]
  });

  console.log(`Seed completed. Admin user: ${adminUser.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
