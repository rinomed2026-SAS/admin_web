import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/lib/auth.js';
import { Role } from '@prisma/client';

const day1 = new Date('2026-04-17T00:00:00.000Z');
const day2 = new Date('2026-04-18T00:00:00.000Z');

async function main() {
  // =========================================================
  // LIMPIEZA DE TABLAS (para evitar duplicados)
  // =========================================================
  await prisma.sessionSpeaker.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.speaker.deleteMany({});
  await prisma.eventInfo.deleteMany({});
  await prisma.sponsor.deleteMany({});
  await prisma.hotel.deleteMany({});
  await prisma.tourism.deleteMany({});

  // =========================================================
  // ADMIN
  // =========================================================
  const adminPassword = await hashPassword('Admin123*');

  await prisma.user.upsert({
    where: { email: 'admin2@rinomed2026.com' },
    update: {
      name: 'Admin Dos',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
    create: {
      name: 'Admin Dos',
      email: 'admin2@rinomed2026.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  // =========================================================
  // SPEAKERS
  // =========================================================
  const [
    froilan,
    neves,
    moreraE,
    herreraN,
    romeroG,
    roseroF,
    pedrozaC,
    ortegaS,
    bedoyaJD,
    molanoJ,
    velezS,
    vanegas,
    landinez,
    urzola,
    munozS,
    yepesA,
  ] = await Promise.all([
    prisma.speaker.create({ data: { name: 'Froilan Páez', country: 'Venezuela', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Rafael Neves', country: 'Portugal', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Eduardo Morera', country: 'España', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Noé Herrera', country: 'México', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Gustavo Romero', country: 'Colombia', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Francisco Rosero', country: 'Colombia', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Carlos Pedroza', country: 'Colombia', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Sergio Ortega', country: 'Colombia', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Juan David Bedoya', country: 'Colombia', specialty: 'Rinología', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Julián Molano', country: 'Colombia', specialty: 'Rinología', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Sara Vélez', country: 'Colombia', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Nataly Vanegas', country: 'Colombia', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Guillermo Landínez', country: 'Colombia', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Carlos Urzola', country: 'Colombia', specialty: 'Rinoplastia', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Santiago Muñoz', country: 'Colombia', specialty: 'Rinología', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
    prisma.speaker.create({ data: { name: 'Alejandro Yepes', country: 'Colombia', specialty: 'Marketing', bio: '', photoUrl: '', websiteUrl: '', instagramUrl: '' } }),
  ]);

  // =========================================================
  // SESIONES Y AGENDA
  // =========================================================
  const sessionDefs = [
    // Día 1
    { data: { day: day1, startTime: '07:00', endTime: '08:00', room: 'Registro', title: 'Apertura de registro y acreditaciones', topic: 'Institucional', level: 'General', description: 'Apertura de registro y acreditaciones del congreso.' }, speakers: [] },
    { data: { day: day1, startTime: '08:00', endTime: '08:10', room: 'Auditorio', title: 'Bienvenida e inauguración oficial RINOMED 2026', topic: 'Institucional', level: 'General', description: 'Bienvenida e inauguración oficial del evento.' }, speakers: [urzola?.id, landinez?.id].filter(Boolean) },
    { data: { day: day1, startTime: '08:10', endTime: '08:40', room: 'Auditorio', title: '¿Cómo logro que mis líneas estéticas dorsales se vean como las de Froilan?', topic: 'Rinoplastia – Preservación dorsal', level: 'Avanzado', description: 'MASTER CLASS. Preservación dorsal a mi manera. Contorno estructural en cuatro fases.' }, speakers: [froilan?.id].filter(Boolean) },
    { data: { day: day1, startTime: '08:40', endTime: '09:10', room: 'Auditorio', title: 'Creando el diamante perfecto de la punta nasal', topic: 'Rinoplastia – Punta nasal', level: 'Avanzado', description: 'El concepto del triángulo isósceles. Fusion Sling. Hook manoeuvre para soporte de punta nasal. Toolbox de suturas de punta nasal.' }, speakers: [neves?.id].filter(Boolean) },
    { data: { day: day1, startTime: '09:10', endTime: '09:30', room: 'Auditorio', title: '¿Por qué el dorso contemporáneo no necesita preservación?', topic: 'Rinoplastia – Dorso nasal', level: 'Avanzado', description: 'Análisis crítico del dorso contemporáneo y alternativas a la preservación.' }, speakers: [moreraE?.id].filter(Boolean) },
    { data: { day: day1, startTime: '09:30', endTime: '09:50', room: 'Auditorio', title: 'Técnica SPQR+ para el tratamiento de laterorrinias', topic: 'Rinoplastia – Laterorrinia', level: 'Avanzado', description: 'Técnica SPQR+ aplicada al manejo de laterorrinias.' }, speakers: [moreraE?.id].filter(Boolean) },
    { data: { day: day1, startTime: '09:50', endTime: '10:10', room: 'Auditorio', title: 'Coffee break & networking', topic: 'Pausa', level: 'General', description: 'Pausa para café y networking entre asistentes.' }, speakers: [] },
    { data: { day: day1, startTime: '10:10', endTime: '10:30', room: 'Auditorio', title: 'Colgajos de avance de filtrum: cómo y cuándo los utilizo', topic: 'Rinoplastia – Colgajos', level: 'Avanzado', description: 'Indicaciones y técnica de los colgajos de avance de filtrum.' }, speakers: [herreraN?.id].filter(Boolean) },
    { data: { day: day1, startTime: '10:30', endTime: '10:50', room: 'Auditorio', title: 'Desafiando la piel gruesa: manejo, equilibrio y refinamiento de la punta nasal', topic: 'Rinoplastia – Piel gruesa', level: 'Avanzado', description: 'Estrategias para el manejo y refinamiento de la punta nasal en piel gruesa.' }, speakers: [romeroG?.id].filter(Boolean) },
    { data: { day: day1, startTime: '10:50', endTime: '11:10', room: 'Auditorio', title: 'Por qué amputo las cruras medias en reconstrucción nasal difícil', topic: 'Reconstrucción nasal', level: 'Avanzado', description: 'Mi injerto controversial. Técnica y justificación clínica.' }, speakers: [roseroF?.id].filter(Boolean) },
    { data: { day: day1, startTime: '11:10', endTime: '11:30', room: 'Auditorio', title: 'Cirugía de la base nasal: simple, segura y efectiva', topic: 'Rinoplastia – Base nasal', level: 'Intermedio', description: 'Abordaje simplificado y seguro para la cirugía de la base nasal.' }, speakers: [pedrozaC?.id].filter(Boolean) },
    { data: { day: day1, startTime: '11:30', endTime: '11:50', room: 'Auditorio', title: 'Evolución de las tecnologías de alto poder en rinoplastia', topic: 'Innovación', level: 'Intermedio', description: 'Lo que antes era estándar y hoy ya no lo es.' }, speakers: [ortegaS?.id].filter(Boolean) },
    { data: { day: day1, startTime: '12:00', endTime: '13:00', room: 'Auditorio', title: 'Simposio GSK – ¿Qué hacer si mi paciente de rinoplastia tiene poliposis nasal?', topic: 'Simposio – Poliposis', level: 'Intermedio', description: 'Simposio patrocinado por GSK. Panelistas: Dr. Eduardo Morera (España), Dr. Juan David Bedoya (Colombia), Dr. Julián Molano (Colombia).' }, speakers: [moreraE?.id, bedoyaJD?.id, molanoJ?.id].filter(Boolean) },
    { data: { day: day1, startTime: '13:00', endTime: '17:00', room: 'Quirófano 1', title: 'Cirugía en vivo – Rinoplastia primaria con técnica de rinoplastia fusión', topic: 'Cirugía en vivo', level: 'Avanzado', description: 'Rinoplastia latinoamericana: Venezuela vs México. Ayudantía: Dra. Nataly Vanegas. Moderadores en sala: Dra. Sara Vélez, Dra. Nataly Vanegas. Moderadores en auditorio: Dr. Guillermo Landínez, Dr. Carlos Urzola.' }, speakers: [froilan?.id, vanegas?.id, velezS?.id, landinez?.id, urzola?.id].filter(Boolean) },
    { data: { day: day1, startTime: '13:00', endTime: '17:00', room: 'Quirófano 2', title: 'Cirugía en vivo – Rinoplastia primaria en piel gruesa con injerto costal', topic: 'Cirugía en vivo', level: 'Avanzado', description: 'Rinoplastia latinoamericana: Venezuela vs México. Ayudantía: Dr. Francisco Rosero. Moderadores en sala: Dra. Sara Vélez, Dra. Nataly Vanegas. Moderadores en auditorio: Dr. Guillermo Landínez, Dr. Carlos Urzola.' }, speakers: [herreraN?.id, roseroF?.id, velezS?.id, vanegas?.id, landinez?.id, urzola?.id].filter(Boolean) },
    { data: { day: day1, startTime: '17:00', endTime: '18:00', room: 'Auditorio', title: 'Mesa redonda – Manejo prequirúrgico y posquirúrgico en rinoplastia', topic: 'Mesa redonda', level: 'Avanzado', description: 'Lo que no te dicen en los congresos. Temas: antibióticos profilácticos, corticoides sistémicos y ácido tranexámico, taping y férulas, conformadores nasales, tabaquismo y nicotina, analgesia y AINEs.' }, speakers: [neves?.id, moreraE?.id, roseroF?.id, romeroG?.id, ortegaS?.id, pedrozaC?.id].filter(Boolean) },
    { data: { day: day1, startTime: '20:00', endTime: '22:00', room: 'Evento social', title: 'Cena con las estrellas – Degustando las delicias de Medellín', topic: 'Evento social', level: 'General', description: 'Evento social del congreso. Actividad con inscripción adicional.' }, speakers: [] },

    // Día 2
    { data: { day: day2, startTime: '07:00', endTime: '08:00', room: 'Auditorio', title: 'Desayuno con diamantes: una experiencia sensorial', topic: 'Simposio – Desayuno', level: 'General', description: 'Patrocinado por Sanofi Aventis.' }, speakers: [munozS?.id].filter(Boolean) },
    { data: { day: day2, startTime: '08:00', endTime: '12:00', room: 'Quirófano 1', title: 'Cirugía en vivo – Rinoplastia primaria: Estrategia "Rock Star" para el manejo de laterorrinia', topic: 'Cirugía en vivo', level: 'Avanzado', description: 'Rinoplastia europea: España vs Portugal. Ayudantía: Dr. Gustavo Romero. Moderadores en sala: Dra. Sara Vélez, Dra. Nataly Vanegas. Moderadores en auditorio: Dr. Guillermo Landínez, Dr. Carlos Urzola.' }, speakers: [moreraE?.id, romeroG?.id, velezS?.id, vanegas?.id, landinez?.id, urzola?.id].filter(Boolean) },
    { data: { day: day2, startTime: '08:00', endTime: '12:00', room: 'Quirófano 2', title: 'Cirugía en vivo – Rinoplastia primaria de preservación: Concepto Tetris', topic: 'Cirugía en vivo', level: 'Avanzado', description: 'Rinoplastia europea: España vs Portugal. Ayudantía: Dra. Sara Vélez. Moderadores en sala: Dra. Sara Vélez, Dra. Nataly Vanegas. Moderadores en auditorio: Dr. Guillermo Landínez, Dr. Carlos Urzola.' }, speakers: [neves?.id, velezS?.id, vanegas?.id, landinez?.id, urzola?.id].filter(Boolean) },
    { data: { day: day2, startTime: '12:00', endTime: '13:00', room: 'Auditorio', title: 'Blefaroplastia no quirúrgica (demostración)', topic: 'Simposio – Blefaroplastia', level: 'Intermedio', description: 'Patrocinado por GlobalTee.' }, speakers: [] },
    { data: { day: day2, startTime: '13:00', endTime: '13:30', room: 'Auditorio', title: '¿Cómo logro que mis puntas nasales se vean como las de Froilan?', topic: 'Rinoplastia – Punta nasal', level: 'Avanzado', description: 'Punta del armadillo. Desde lo poligonal hasta lo extendido.' }, speakers: [froilan?.id].filter(Boolean) },
    { data: { day: day2, startTime: '13:30', endTime: '13:50', room: 'Auditorio', title: 'LEGO Concept – La clave oculta para el control columelar', topic: 'Rinoplastia – Columela', level: 'Avanzado', description: 'LEGO Concept para el control preciso de la columela.' }, speakers: [romeroG?.id].filter(Boolean) },
    { data: { day: day2, startTime: '13:50', endTime: '14:10', room: 'Auditorio', title: 'Reconstrucción nasal con abordaje cerrado', topic: 'Reconstrucción nasal', level: 'Avanzado', description: 'Técnica de reconstrucción nasal con abordaje cerrado.' }, speakers: [herreraN?.id].filter(Boolean) },
    { data: { day: day2, startTime: '14:10', endTime: '14:30', room: 'Auditorio', title: 'Cómo resolver complicaciones en rinoplastia', topic: 'Complicaciones', level: 'Avanzado', description: 'Manejo y resolución de complicaciones en rinoplastia.' }, speakers: [ortegaS?.id].filter(Boolean) },
    { data: { day: day2, startTime: '14:30', endTime: '15:00', room: 'Auditorio', title: 'Marketing, redes sociales e inteligencia artificial en cirugía plástica facial', topic: 'Marketing y Tecnología', level: 'General', description: 'Alejandro Yepes – Cromia.' }, speakers: [yepesA?.id].filter(Boolean) },
    { data: { day: day2, startTime: '15:00', endTime: '15:30', room: 'Auditorio', title: 'Coffee break', topic: 'Pausa', level: 'General', description: 'Pausa para café.' }, speakers: [] },
    { data: { day: day2, startTime: '15:30', endTime: '16:00', room: 'Auditorio', title: 'Rinoplastia de preservación al estilo Neves – Concepto Tetris para dummies', topic: 'Rinoplastia – Preservación', level: 'Intermedio', description: 'Explicación accesible del Concepto Tetris para rinoplastia de preservación.' }, speakers: [neves?.id].filter(Boolean) },
    { data: { day: day2, startTime: '16:00', endTime: '16:30', room: 'Auditorio', title: 'DAL Split and Step-Up Manoeuvres', topic: 'Rinoplastia – DAL', level: 'Avanzado', description: 'Técnicas avanzadas DAL Split y Step-Up Manoeuvres.' }, speakers: [neves?.id].filter(Boolean) },
    { data: { day: day2, startTime: '16:30', endTime: '16:40', room: 'Auditorio', title: 'MASTER CLASS – Perlas en reconstrucción nasal: casos reales', topic: 'Reconstrucción nasal', level: 'Avanzado', description: 'Bloque de master class con casos reales de reconstrucción nasal.' }, speakers: [moreraE?.id].filter(Boolean) },
    { data: { day: day2, startTime: '16:40', endTime: '16:50', room: 'Auditorio', title: 'Perlas en reconstrucción nasal', topic: 'Reconstrucción nasal', level: 'Avanzado', description: 'Caso real presentado por Dr. Francisco Rosero (Colombia).' }, speakers: [roseroF?.id].filter(Boolean) },
    { data: { day: day2, startTime: '16:50', endTime: '17:00', room: 'Auditorio', title: 'Perlas en reconstrucción nasal', topic: 'Reconstrucción nasal', level: 'Avanzado', description: 'Caso real presentado por Dr. Noé Herrera (México).' }, speakers: [herreraN?.id].filter(Boolean) },
    { data: { day: day2, startTime: '17:00', endTime: '17:10', room: 'Auditorio', title: 'Perlas en reconstrucción nasal', topic: 'Reconstrucción nasal', level: 'Avanzado', description: 'Caso real presentado por Dr. Carlos Pedroza (Colombia).' }, speakers: [pedrozaC?.id].filter(Boolean) },
    { data: { day: day2, startTime: '17:10', endTime: '17:20', room: 'Auditorio', title: 'Perlas en reconstrucción nasal', topic: 'Reconstrucción nasal', level: 'Avanzado', description: 'Caso real presentado por Dr. Froilan Páez (Venezuela).' }, speakers: [froilan?.id].filter(Boolean) },
    { data: { day: day2, startTime: '17:20', endTime: '17:30', room: 'Auditorio', title: 'Perlas en reconstrucción nasal', topic: 'Reconstrucción nasal', level: 'Avanzado', description: 'Caso real presentado por Dr. Gustavo Romero (Colombia).' }, speakers: [romeroG?.id].filter(Boolean) },
    { data: { day: day2, startTime: '17:30', endTime: '18:30', room: 'Auditorio', title: 'Mesa redonda final – Temas controversiales en rinoplastia', topic: 'Mesa redonda', level: 'Avanzado', description: 'Temas controversiales: manejo del paciente difícil y de alto riesgo, complicaciones en redes sociales (transparencia, reputación y manejo de críticas), piel gruesa o fibrograsa (debulking, nanofat, PRP, corticoides intralesionales o aceptar límites estéticos), perforación septal concomitante (reparación simultánea o secuencial), nariz post-filler HA, CaHA, PMMA (tiempos de espera, disolución y evaluación ecográfica), camuflaje en piel fina.' }, speakers: [] },
    { data: { day: day2, startTime: '18:30', endTime: '19:00', room: 'Auditorio', title: 'Clausura oficial RINOMED 2026', topic: 'Clausura', level: 'General', description: 'Clausura oficial del congreso RINOMED 2026.' }, speakers: [urzola?.id, landinez?.id].filter(Boolean) },
    { data: { day: day2, startTime: '20:00', endTime: '23:00', room: 'La Chula', title: 'Evento de clausura RINOMED 2026 – Restaurante Show: La Chula', topic: 'Evento social', level: 'General', description: 'Actividad social del congreso. Evento con inscripción adicional.' }, speakers: [] },
  ];

  for (const def of sessionDefs) {
    const session = await prisma.session.create({ data: def.data });

    for (const speakerId of def.speakers) {
      await prisma.sessionSpeaker.create({
        data: {
          sessionId: session.id,
          speakerId,
        },
      });
    }
  }

  // =========================================================
  // ASISTENTES
  // =========================================================
  const assistantRoster = [
    { name: 'Alberto Angulo', email: 'albertoangulo118@gmail.com', cedula: '84086919', tipo: 'Asistente' },
    { name: 'Alexander Yesid Lujan Mendoza', email: 'alexander_lujan@hotmail.com', cedula: '1122396761', tipo: 'Asistente' },
    { name: 'Alison Catherine López Garcia', email: 'alisonlopez1@hotmail.com', cedula: '1130632543', tipo: 'Asistente' },
    { name: 'Alvaro Correa Jaramillo', email: 'alvarocorreaj@gmail.com', cedula: '17150412', tipo: 'Asistente' },
    { name: 'Amalia Botero', email: 'amalia.botero@hotmail.com', cedula: '39167677', tipo: 'Asistente' },
    { name: 'Ana Verónica Hernández Rodríguez', email: 'anitav0714@gmail.com', cedula: '1020752613', tipo: 'Asistente' },
    { name: 'Andres Sandoval Arango', email: 'andres_sandoval88@hotmail.com', cedula: '1098654104', tipo: 'Asistente' },
    { name: 'Andrés Felipe González Restrepo', email: 'andres_felipe_gr@hotmail.com', cedula: '14702748', tipo: 'Asistente' },
    { name: 'Antonieta Gomez', email: 'antonietagomez83@gmail.com', cedula: '1020823714', tipo: 'Asistente' },
    { name: 'Ariel Felipe Llamas García', email: 'arielllamasgarcias@gmail.com', cedula: '73191341', tipo: 'Asistente' },
    { name: 'Betsy Patricia Pareja Ibarra', email: 'paty.pareja@gmail.com', cedula: '52646358', tipo: 'Asistente' },
    { name: 'Boris Luis Martinez Arellano', email: 'martinezboris.1125@gmail.com', cedula: '73194043', tipo: 'Asistente' },
    { name: 'Carlos Alberto Gamboa Montesdeoc', email: 'doctor.gamboa@hotmail.com', cedula: '6530855', tipo: 'Asistente' },
    { name: 'Carlos Betancur Madrid', email: 'quirosolucionessas@gmail.com', cedula: '71311570', tipo: 'Asistente' },
    { name: 'Carlos Mario Rondón Pinilla', email: 'carlosrondon@gmail.com', cedula: '1032438974', tipo: 'Asistente' },
    { name: 'CARLOS ANDRES URZOLA MOSQUERA', email: 'carlosurzola36@gmail.com', cedula: '79905269', tipo: 'Asistente' },
    { name: 'Carolina Casallas', email: 'karocasallas@hotmail.com', cedula: '52858996', tipo: 'Asistente' },
    { name: 'Cesar Edwin Martínez Correa', email: 'cesarmartinezcorrea@yahoo.com', cedula: '93381089', tipo: 'Asistente con cirugía' },
    { name: 'Claudia Patricia Garcia Giraldo', email: 'consultoriocer@hotmail.com', cedula: '43557582', tipo: 'Asistente' },
    { name: 'Damian Eztala', email: 'damianeztala@gmail.com', cedula: '34324140', tipo: 'Asistente' },
    { name: 'Daniel Alejandro Montoya Castaño', email: 'damontoya.otorrino@gmail.com', cedula: '1088303633', tipo: 'Asistente' },
    { name: 'Daniel Andulce', email: 'danielandulce@gmail.com', cedula: '94441260', tipo: 'Asistente Virtual' },
    { name: 'Daniel Ruíz Manco', email: 'danielruizmanco@gmail.com', cedula: '1010218013', tipo: 'Asistente' },
    { name: 'Dany Ximena Gamez', email: 'dannyximenagamez@hotmail.com', cedula: '1112464957', tipo: 'Asistente' },
    { name: 'Denys Arteaga', email: 'gerenciageneral@clinicaisis.com', cedula: '64575796', tipo: 'Asistente' },
    { name: 'Diana Gutierrez', email: 'dianacgd.dcgd@gmail.com', cedula: '176774794', tipo: 'Asistente' },
    { name: 'Diego Fernando Suescun Gomez', email: 'diegosuescun@yahoo.es', cedula: '86062353', tipo: 'Asistente' },
    { name: 'Esteban Correa Acebedo', email: 'Ecorrea04@gmail.com', cedula: '1152447491', tipo: 'Asistente' },
    { name: 'Evert Armando Jimenez Cotes', email: 'evert_sp@hotmail.com', cedula: '1037613222', tipo: 'Asistente' },
    { name: 'Fabian Henao', email: 'dr.fabianhenao1@gmail.com', cedula: '1061693647', tipo: 'Asistente' },
    { name: 'Fabio Alejandro Motta Cortes', email: 'dr_mottac@hotmail.com', cedula: '80041841', tipo: 'Asistente' },
    { name: 'Fernando Pedroza', email: 'fpedroza@lafont.com.co', cedula: '14963860', tipo: 'Asistente' },
    { name: 'Flor de Maria Romero Reyes', email: 'draromeroreyes@yahoo.com', cedula: '1087798', tipo: 'Asistente con cirugía' },
    { name: 'Francisco Javier Franco Gonzalez', email: 'fcofdr@gmail.com', cedula: 'G28542944', tipo: 'Asistente' },
    { name: 'Fredy Dario Ortiz Ortiz', email: 'drfredyortiz@gmail.com', cedula: '87061171', tipo: 'Asistente con cirugía' },
    { name: 'Freddy Navarro Niño', email: 'freddysoad@hotmail.com', cedula: '1090375249', tipo: 'Asistente' },
    { name: 'German Bernal', email: 'dr.germanbernal@gmail.com', cedula: '80926179', tipo: 'Asistente' },
    { name: 'Germán Pablo Sandoval Ortíz', email: 'contabilidad.audiofon@gmail.com', cedula: '13844240', tipo: 'Asistente' },
    { name: 'Giovanny Linares Carreon', email: 'tathianadelrocio@gmail.com', cedula: '29470841', tipo: 'Asistente con cirugía' },
    { name: 'Guillermo Landinez', email: 'guillermoarturo.landinez@gmail.com', cedula: '79956285', tipo: 'Asistente' },
    { name: 'Gustavo Urzola', email: 'inggustavourzola@gmail.com', cedula: '1020723270', tipo: 'Asistente' },
    { name: 'Gustavo Vanegas', email: 'gusvanegasorl@gmail.com', cedula: '80092720', tipo: 'Asistente' },
    { name: 'Guzman Parra Linares', email: 'guzman1932@gmail.com', cedula: '16655771', tipo: 'Asistente con cirugía' },
    { name: 'Hugo Henando Beltran Bonilla', email: 'hugobeltranb@hotmail.com', cedula: '79999975', tipo: 'Asistente' },
    { name: 'Ileana Carolina Potes', email: 'ileanacarolinap@gmail.com', cedula: '57105426', tipo: 'Asistente' },
    { name: 'Ileana Perea Mena', email: 'ileneperea.otorrino@gmail.com', cedula: '1026269638', tipo: 'Asistente' },
    { name: 'Javier Alfonso Novoa Villamil', email: 'Javier_novoa_1@hotmail.com', cedula: '6760451', tipo: 'Asistente' },
    { name: 'Jennifer Viviana Montaña', email: 'jennivm08@gmail.com', cedula: '176758019', tipo: 'Asistente' },
    { name: 'Jeinner Alfredo Paredes Daza', email: 'jeinner2013@gmail.com', cedula: '124024858', tipo: 'Asistente Virtual' },
    { name: 'Jhonny Alexander Ortiz', email: 'drortiz.orl@gmail.com', cedula: '1085307846', tipo: 'Asistente con cirugía' },
    { name: 'Joel José Rodriguez Fernandez', email: 'joeljrodriguezf@gmail.com', cedula: '40223896594', tipo: 'Asistente Virtual' },
    { name: 'Jonathan Rozenboim Matiz', email: 'jrozenboim@gmail.com', cedula: '72285786', tipo: 'Asistente' },
    { name: 'Jorge Julian Mendoza Anguila', email: 'julian.mendoza1@udea.edu.co', cedula: '1065655575', tipo: 'Asistente' },
    { name: 'Jose Gregorio Colina', email: 'grupojcolina@gmail.com', cedula: '178662532', tipo: 'Asistente con cirugía' },
    { name: 'José Manuel Salvatierra Gonzalez', email: 'j.salvatierra@hotmail.es', cedula: '123776818', tipo: 'Asistente con cirugía' },
    { name: 'Juan Carlos Martínez Osorio', email: 'juancm10@ucm.es', cedula: 'N04527827', tipo: 'Asistente' },
    { name: 'Juan Carlos Peña Naranjo', email: 'drjuancarlosotorrino@gmail.com', cedula: '80194959', tipo: 'Asistente' },
    { name: 'Juan Fernando Gomez Lopera', email: 'jfgomezotorrino@gmail.com', cedula: '3349695', tipo: 'Asistente' },
    { name: 'Juliana Aguirre Rodas', email: 'drajulianaaguirre@outlook.com', cedula: '1088246869', tipo: 'Asistente con cirugía' },
    { name: 'Juliana Montero Cortes', email: 'julianamontero1@gmail.com', cedula: '1065569820', tipo: 'Asistente' },
    { name: 'Kristel Achio Artavia', email: 'info@draachio.com', cedula: '6-0338-0181', tipo: 'Asistente' },
    { name: 'Ladislao Higuera arends', email: 'drladislaohiguera@gmail.com', cedula: '24303138', tipo: 'Asistente' },
    { name: 'Leon Felipe Zapata Giraldo', email: 'leonfelipezapatag@gmail.com', cedula: '1128479450', tipo: 'Asistente' },
    { name: 'Liliana Gutierrez', email: 'liliguvi1967@gmail.com', cedula: '43894675', tipo: 'Asistente' },
    { name: 'Liliana Vitery', email: 'dravitery@hotmail.com', cedula: '80041841', tipo: 'Asistente' },
    { name: 'Lina Cardona', email: 'liniscardona@gmail.com', cedula: '30234707', tipo: 'Asistente' },
    { name: 'Lina Patricia Franco Chaparro', email: 'lina_franco@hotmail.com', cedula: '1013595775', tipo: 'Asistente Virtual' },
    { name: 'Lina Valero Camacho', email: 'lvaleromd@gmail.com', cedula: '31255874', tipo: 'Asistente' },
    { name: 'Lisandro Guerra', email: 'guerralisandro@gmail.com', cedula: '71755048', tipo: 'Asistente' },
    { name: 'Lizbeth Vanessa Olivera Flores', email: 'dra.vaneolivera@gmail.com', cedula: 'XE10824', tipo: 'Asistente Virtual' },
    { name: 'Luz Bibiana Florez Giraldo', email: 'luzbibiana@gmail.com', cedula: '43755493', tipo: 'Asistente' },
    { name: 'Maria Fernanda Maria', email: 'mafeguerra85@hotmail.com', cedula: '1140849467', tipo: 'Asistente' },
    { name: 'Mario Botero', email: 'mabotero70@gmail.com', cedula: '70109602', tipo: 'Asistente' },
    { name: 'Mario Montoya', email: 'Mariomontoyave@gmail.com', cedula: '1017196188', tipo: 'Asistente' },
    { name: 'Mario Rafael Osorio Ospina', email: 'mariorafael1228@hotmail.com', cedula: '9295792', tipo: 'Asistente con cirugía' },
    { name: 'Marlon de Jesús Consuegra González', email: 'drmconsuegra@gmail.com', cedula: '79934403', tipo: 'Asistente' },
    { name: 'Melissa Mayo Patiño', email: 'mayo_meli@hotmail.com', cedula: '1019041747', tipo: 'Asistente' },
    { name: 'Minor Valverde Madriz', email: 'gerencia@rinofacecr.com', cedula: '112610566', tipo: 'Asistente' },
    { name: 'Natalia Alexandra Yepes Garcia', email: 'natyyepes33@yahoo.com', cedula: '42690766', tipo: 'Asistente' },
    { name: 'Nestor Sánchez Rojas', email: 'nsanchezcp@gmail.com', cedula: '3413951', tipo: 'Asistente Virtual' },
    { name: 'Norma Andrea Mares Villaseñor', email: 'andysea89@hotmail.com', cedula: 'G37079750', tipo: 'Asistente Virtual' },
    { name: 'Paula Andrea Jaramillo Cuartas', email: 'panjacu@hotmail.com', cedula: '43155936', tipo: 'Asistente' },
    { name: 'Rafael Garcia Marquez', email: 'rggarciamarquez@gmail.com', cedula: '196627114', tipo: 'Asistente con cirugía' },
    { name: 'Ricardo Quitral', email: 'rquitral@gmail.com', cedula: '10057690-2', tipo: 'Asistente' },
    { name: 'Rocio Luna Florez', email: 'rocioluna64@yahoo.com', cedula: '39011873', tipo: 'Asistente Virtual' },
    { name: 'Rosangela Maria Moncada Orduño', email: 'rosangelamoncada26@gmail.com', cedula: '183204866', tipo: 'Asistente' },
    { name: 'Rouny Jhoel Limache Cutipa', email: 'Jhoel_lc20@hotmail.com', cedula: '42155032', tipo: 'Asistente con cirugía' },
    { name: 'Santiago Hernandez', email: 'santiagoha32@gmail.com', cedula: '1037634236', tipo: 'Asistente' },
    { name: 'Vanessa del Carmen Colina', email: 'dravanessacolina279@gmail.com', cedula: '7863082', tipo: 'Asistente' },
    { name: 'Vanessa Palencia Suarez', email: 'vanessapal2012@gmail.com', cedula: '1100395163', tipo: 'Asistente' },
    { name: 'Verónica Paola Morejón Acurio', email: 'acuvero@hotmail.com', cedula: 'A4394319', tipo: 'Asistente con cirugía' },
    { name: 'Victor Hugo Villacis Basante', email: 'drvictorvillacisb@gmail.com', cedula: '1085269782', tipo: 'Asistente con cirugía' },
    { name: 'Visnelia Alexandra Martínez Rivas', email: 'visneliam@gmail.com', cedula: '180950656', tipo: 'Asistente con cirugía' },
    { name: 'Xiomara Correa Jimenez', email: 'xiomaracorreajimenez@hotmail.com', cedula: '43588097', tipo: 'Asistente' },
    { name: 'Yorban O Bolanos G', email: 'yorban.otorrino@gmail.com', cedula: '1040181272', tipo: 'Asistente' },
    { name: 'Zelmira Palomino Alarcon', email: 'Jhoel_lc20@hotmail.com', cedula: '40215994', tipo: 'Asistente con cirugía' },
  ];

  const tipoToRole: Record<string, Role> = {
    Asistente: Role.ASSISTANT,
    'Asistente con cirugía': Role.ASSISTANT_SURGICAL,
    'Asistente Virtual': Role.ASSISTANT_VIRTUAL,
  };

  const uniqueRoster = Array.from(
    new Map(assistantRoster.map((a) => [a.email.toLowerCase(), a])).values()
  );

  const assistantUsers = await Promise.all(
    uniqueRoster.map(async (a) => ({
      name: a.name?.trim() ?? '',
      email: a.email?.trim().toLowerCase() ?? '',
      passwordHash: await hashPassword(a.cedula ?? ''),
      role: tipoToRole[(a.tipo ?? '').trim()] ?? Role.ASSISTANT,
    }))
  );

  await prisma.user.createMany({
    data: assistantUsers,
    skipDuplicates: true,
  });

  // =========================================================
  // EVENT INFO
  // =========================================================
  await prisma.eventInfo.create({
    data: {
      id: 1,
      name: 'RINOMED 2026',
      city: 'Medellín',
      dates: '17 y 18 de abril de 2026',
      venue: 'Centro de Convenciones',
      address: 'Calle 7 Sur #50-120, Medellín, Colombia',
      email: 'info@rinomed2026.com',
      phone: '+57 300 123 4567',
      whatsapp: '+57 300 123 4567',
      website: 'https://rinomed2026.com',
      mapsUrl: 'https://goo.gl/maps/xyz',
      academicHours: '16',
    },
  });

  // =========================================================
  // SPONSORS
  // =========================================================
  await prisma.sponsor.createMany({
    data: [
      { name: 'Aldental', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_aldental.png', description: '', websiteUrl: '', products: '' },
      { name: 'Amolca', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_amolca.png', description: '', websiteUrl: '', products: '' },
      { name: 'Bold', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_bold.png', description: '', websiteUrl: '', products: '' },
      { name: 'Camina', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_camina.png', description: '', websiteUrl: '', products: '' },
      { name: 'Clínica Orlant', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_clinica_orlant.png', description: '', websiteUrl: '', products: '' },
      { name: 'DF Medical', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_dfmedical.png', description: '', websiteUrl: '', products: '' },
      { name: 'Eurofarma', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_eurofarma.png', description: '', websiteUrl: '', products: '' },
      { name: 'Fepasde', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_fepasde.png', description: '', websiteUrl: '', products: '' },
      { name: 'GSK', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_gsk.png', description: 'Patrocinador del simposio de almuerzo del Día 1.', websiteUrl: '', products: 'Simposio académico' },
      { name: 'Heel', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_heel.png', description: '', websiteUrl: '', products: '' },
      { name: 'Isis', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_isis.png', description: '', websiteUrl: '', products: '' },
      { name: 'Kabati', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_kabati.png', description: '', websiteUrl: '', products: '' },
      { name: 'Kevins', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_kevins.png', description: '', websiteUrl: '', products: '' },
      { name: 'Laxel', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_laxel.png', description: '', websiteUrl: '', products: '' },
      { name: 'Neilmed', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_neilmed.png', description: '', websiteUrl: '', products: '' },
      { name: 'Nova Technology', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_nova_technology.png', description: '', websiteUrl: '', products: '' },
      { name: 'Novamed', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_novamed.png', description: '', websiteUrl: '', products: '' },
      { name: 'Poliseguros', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_poliseguros.png', description: '', websiteUrl: '', products: '' },
      { name: 'Procaps', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_procaps.png', description: '', websiteUrl: '', products: '' },
      { name: 'Promta', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_promta.png', description: '', websiteUrl: '', products: '' },
      { name: 'Renacer', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_renacer.png', description: '', websiteUrl: '', products: '' },
      { name: 'Sanofi', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_sanofi.jpg', description: 'Patrocinador oficial del bloque "Desayuno con diamantes".', websiteUrl: '', products: 'Patrocinio académico' },
      { name: 'Seguros Del Camino', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_seguros_delcamino.jpg', description: '', websiteUrl: '', products: '' },
      { name: 'TQ', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_tq.jpg', description: '', websiteUrl: '', products: '' },
      { name: 'Visión Médica', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_vision_medica.png', description: '', websiteUrl: '', products: '' },
      { name: 'GlobalTee', tier: 'Patrocinador', logoUrl: '', description: 'Patrocinador de la demostración de blefaroplastia no quirúrgica.', websiteUrl: '', products: 'Patrocinio académico' },
    ],
  });

  // =========================================================
  // HOTELES
  // =========================================================
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
        promoCode: 'RINOMED2026',
      },
      {
        name: 'Hotel Poblado Suites',
        rating: 4.5,
        priceMinCop: 220000,
        priceMaxCop: 260000,
        distanceKm: 1.2,
        amenities: 'WiFi, spa, restaurante',
        contact: 'contacto@pobladosuites.com',
        promoCode: 'RINOMED2026',
      },
      {
        name: 'Hotel Laureles',
        rating: 4.2,
        priceMinCop: 150000,
        priceMaxCop: 190000,
        distanceKm: 4.8,
        amenities: 'WiFi, desayuno',
        contact: 'info@hotellaureles.com',
        promoCode: 'RINOMED2026',
      },
      {
        name: 'Hotel Plaza Medellín',
        rating: 4.0,
        priceMinCop: 120000,
        priceMaxCop: 160000,
        distanceKm: 6.3,
        amenities: 'WiFi, café',
        contact: 'reservas@plazamedellin.com',
        promoCode: 'RINOMED2026',
      },
    ],
  });

  // =========================================================
  // TURISMO
  // =========================================================
  await prisma.tourism.createMany({
    data: [
      {
        name: 'Jardín Botánico',
        category: 'Naturaleza',
        duration: '2 horas',
        highlights: 'Orquídeas, mariposario',
        description: 'Recorrido guiado por jardines y ecosistemas.',
      },
      {
        name: 'Museo de Antioquia',
        category: 'Museo',
        duration: '2 horas',
        highlights: 'Obras de Botero',
        description: 'Visita cultural al museo principal de la ciudad.',
      },
      {
        name: 'Comuna 13 Tour',
        category: 'Cultura',
        duration: '3 horas',
        highlights: 'Graffiti, historia',
        description: 'Experiencia inmersiva en arte urbano y comunidad.',
      },
      {
        name: 'Parque Arví',
        category: 'Naturaleza',
        duration: '4 horas',
        highlights: 'Senderismo, teleférico',
        description: 'Día de naturaleza con actividades al aire libre.',
      },
      {
        name: 'Ruta Científica',
        category: 'Ciencia',
        duration: '2 horas',
        highlights: 'Planetario y parques',
        description: 'Explora ciencia y tecnología en Medellín.',
      },
      {
        name: 'Excursión Guatapé',
        category: 'Excursión',
        duration: '8 horas',
        highlights: 'Piedra del Peñol',
        description: 'Viaje de día completo a Guatapé y el embalse.',
      },
    ],
  });

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });