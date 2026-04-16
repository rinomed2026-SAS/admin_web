import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/lib/auth.js';
import { Role } from '@prisma/client';

const day1 = new Date('2026-04-17T00:00:00.000Z');
const day2 = new Date('2026-04-18T00:00:00.000Z');

async function main() {
  // ...
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

  // Usuario de revisión
  await prisma.user.upsert({
    where: { email: 'review@rinomed2026.com' },
    update: {
      name: 'Reviewer Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Reviewer Admin',
      email: 'review@rinomed2026.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    }
  });

  // Admins adicionales
  await prisma.user.upsert({
    where: { email: 'admin1@rinomed2026.com' },
    update: {
      name: 'Admin Uno',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Admin Uno',
      email: 'admin1@rinomed2026.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    }
  });
  await prisma.user.upsert({
    where: { email: 'admin2@rinomed2026.com' },
    update: {
      name: 'Admin Dos',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Admin Dos',
      email: 'admin2@rinomed2026.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    }
  });



  // --- GENERADO AUTOMÁTICAMENTE DESDE CSV ---
  // Actualizado desde el CSV, ahora incluye el campo 'tipo'
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
  { name: 'Zelmira Palomino Alarcon', email: 'Jhoel_lc20@hotmail.com', cedula: '40215994', tipo: 'Asistente con cirugía' }
];
  // Deduplicate by email, hash each user's cedula as su password y asignar role según tipo
  const tipoToRole: Record<string, Role> = {
    'Asistente': Role.ASSISTANT,
    'Asistente con cirugía': Role.ASSISTANT_SURGICAL,
    'Asistente Virtual': Role.ASSISTANT_VIRTUAL,
  };

  const uniqueRoster = Array.from(
    new Map(
      assistantRoster.map((a) => [a.email.toLowerCase(), a])
    ).values()
  );


  const assistantUsers = await Promise.all(
    uniqueRoster.map(async (a) => ({
      name: a.name?.trim() ?? '',
      email: a.email?.trim().toLowerCase() ?? '',
      passwordHash: await hashPassword(a.cedula ?? ''),
      role: tipoToRole[(a.tipo ?? '').trim()] ?? Role.ASSISTANT,
    }))
  );

  // Crear usuarios asistentes, omitiendo duplicados
  await prisma.user.createMany({
    data: assistantUsers,
    skipDuplicates: true,
  });

  // ...

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
      { name: 'Sanofi', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_sanofi.jpg', description: 'Patrocinador oficial del bloque “Desayuno con diamantes”.', websiteUrl: '', products: 'Patrocinio académico' },
      { name: 'Seguros Del Camino', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_seguros_delcamino.jpg', description: '', websiteUrl: '', products: '' },
      { name: 'TQ', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_tq.jpg', description: '', websiteUrl: '', products: '' },
      { name: 'Visión Médica', tier: 'Patrocinador', logoUrl: '/assets/logos/logo_vision_medica.png', description: '', websiteUrl: '', products: '' },
      { name: 'GlobalTee', tier: 'Patrocinador', logoUrl: '', description: 'Patrocinador de la demostración de blefaroplastia no quirúrgica.', websiteUrl: '', products: 'Patrocinio académico' }
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
