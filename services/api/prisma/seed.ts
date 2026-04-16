import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/lib/auth.js';

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
  await prisma.user.upsert({
    where: { email: 'admin3@rinomed2026.com' },
    update: {
      name: 'Admin Tres',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Admin Tres',
      email: 'admin3@rinomed2026.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    }
  });

  // Usuario de revisión
  await prisma.user.create({
    data: {
      name: 'Reviewer Admin',
      email: 'review@rinomed2026.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    }
  });

  // Admins adicionales
  await prisma.user.create({
    data: {
      name: 'Admin Uno',
      email: 'admin1@rinomed2026.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    }
  });
  await prisma.user.create({
    data: {
      name: 'Admin Dos',
      email: 'admin2@rinomed2026.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    }
  });
  await prisma.user.create({
    data: {
      name: 'Admin Tres',
      email: 'admin3@rinomed2026.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    }
  });

  // --- GENERADO AUTOMÁTICAMENTE DESDE CSV ---
  // Actualizado desde el CSV, ahora incluye el campo 'tipo'
  const assistantRoster = [
    { name: 'Lisandro Guerra', cedula: '71755048', email: 'guerralisandro@gmail.com', tipo: 'Asistente' },
    { name: 'Santiago Hernandez', cedula: '1037634236', email: 'santiagoha32@gmail.com', tipo: 'Asistente' },
    { name: 'Gustavo Vanegas', cedula: '80092720', email: 'gusvanegasorl@gmail.com', tipo: 'Asistente' },
    { name: 'Natalia Alexandra Yepes Garcia', cedula: '42690766', email: 'natyyepes33@yahoo.com', tipo: 'Asistente' },
    { name: 'Ana Verónica Hernández Rodríguez', cedula: '1020752613', email: 'anitav0714@gmail.com', tipo: 'Asistente' },
    { name: 'Alison Catherine López Garcia', cedula: '1130632543', email: 'alisonlopez1@hotmail.com', tipo: 'Asistente' },
    { name: 'Daniel Alejandro Montoya Castaño', cedula: '1088303633', email: 'damontoya.otorrino@gmail.com', tipo: 'Asistente' },
    { name: 'Ladislao Higuera arends', cedula: '24303138', email: 'drladislaohiguera@gmail.com', tipo: 'Asistente' },
    { name: 'Cesar Edwin Martínez Correa', cedula: '93381089', email: 'cesarmartinezcorrea@yahoo.com', tipo: 'Asistente con cirugía' },
    { name: 'Andrés Felipe González Restrepo', cedula: '14702748', email: 'andres_felipe_gr@hotmail.com', tipo: 'Asistente' },
    { name: 'Mario Rafael Osorio Ospina', cedula: '9295792', email: 'mariorafael1228@hotmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Juan Carlos Peña Naranjo', cedula: '80194959', email: 'drjuancarlosotorrino@gmail.com', tipo: 'Asistente' },
    { name: 'Fredy Dario Ortiz Ortiz', cedula: '87061171', email: 'drfredyortiz@gmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Damian Eztala', cedula: '34324140', email: 'damianeztala@gmail.com', tipo: 'Asistente' },
    { name: 'Juliana Aguirre Rodas', cedula: '1088246869', email: 'drajulianaaguirre@outlook.com', tipo: 'Asistente con cirugía' },
    { name: 'Claudia Patricia Garcia Giraldo', cedula: '43557582', email: 'consultoriocer@hotmail.com', tipo: 'Asistente' },
    { name: 'Juan Fernando Gomez Lopera', cedula: '3349695', email: 'jfgomezotorrino@gmail.com', tipo: 'Asistente' },
    { name: 'Yorban O Bolanos G', cedula: '1040181272', email: 'yorban.otorrino@gmail.com', tipo: 'Asistente' },
    { name: 'Daniel Ruíz Manco', cedula: '1010218013', email: 'danielruizmanco@gmail.com', tipo: 'Asistente' },
    { name: 'Diego Fernando Suescun Gomez', cedula: '86062353', email: 'diegosuescun@yahoo.es', tipo: 'Asistente' },
    { name: 'Amalia Botero', cedula: '39167677', email: 'amalia.botero@hotmail.com', tipo: 'Asistente' },
    { name: 'German Bernal', cedula: '80926179', email: 'dr.germanbernal@gmail.com', tipo: 'Asistente' },
    { name: 'Leon Felipe Zapata Giraldo', cedula: '1128479450', email: 'leonfelipezapatag@gmail.com', tipo: 'Asistente' },
    { name: 'Antonieta Gomez', cedula: '1020823714', email: 'antonietagomez83@gmail.com', tipo: 'Asistente' },
    { name: 'Francisco Javier Franco Gonzalez', cedula: 'G28542944', email: 'fcofdr@gmail.com', tipo: 'Asistente' },
    { name: 'Giovanny Linares Carreon', cedula: '29470841', email: 'tathianadelrocio@gmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Minor Valverde Madriz', cedula: '112610566', email: 'gerencia@rinofacecr.com', tipo: 'Asistente' },
    { name: 'Fabio Alejandro Motta Cortes', cedula: '80041841', email: 'dr_mottac@hotmail.com', tipo: 'Asistente' },
    { name: 'Xiomara Correa Jimenez', cedula: '43588097', email: 'xiomaracorreajimenez@hotmail.com', tipo: 'Asistente' },
    { name: 'Liliana Vitery', cedula: '80041841', email: 'dravitery@hotmail.com', tipo: 'Asistente' },
    { name: 'Ileana Carolina Potes', cedula: '57105426', email: 'ileanacarolinap@gmail.com', tipo: 'Asistente' },
    { name: 'Kristel Achio Artavia', cedula: '6-0338-0181', email: 'info@draachio.com', tipo: 'Asistente' },
    { name: 'Vanessa del Carmen Colina', cedula: '7863082', email: 'dravanessacolina279@gmail.com', tipo: 'Asistente' },
    { name: 'Fernando Pedroza', cedula: '14963860', email: 'fpedroza@lafont.com.co', tipo: 'Asistente' },
    { name: 'Lina Valero Camacho', cedula: '31255874', email: 'lvaleromd@gmail.com', tipo: 'Asistente' },
    { name: 'Alberto Angulo', cedula: '84086919', email: 'albertoangulo118@gmail.com', tipo: 'Asistente' },
    { name: 'Diana Gutierrez', cedula: '176774794', email: 'dianacgd.dcgd@gmail.com', tipo: 'Asistente' },
    { name: 'Guzman Parra Linares', cedula: '16655771', email: 'guzman1932@gmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Rosangela Maria Moncada Orduño', cedula: '183204866', email: 'rosangelamoncada26@gmail.com', tipo: 'Asistente' },
    { name: 'Paula Andrea Jaramillo Cuartas', cedula: '43155936', email: 'panjacu@hotmail.com', tipo: 'Asistente' },
    { name: 'Jhonny Alexander Ortiz', cedula: '1085307846', email: 'drortiz.orl@gmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Jonathan Rozenboim Matiz', cedula: '72285786', email: 'jrozenboim@gmail.com', tipo: 'Asistente' },
    { name: 'Betsy Patricia Pareja Ibarra', cedula: '52646358', email: 'paty.pareja@gmail.com', tipo: 'Asistente' },
    { name: 'Jose Gregorio Colina', cedula: '178662532', email: 'grupojcolina@gmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Hugo Henando Beltran Bonilla', cedula: '79999975', email: 'hugobeltranb@hotmail.com', tipo: 'Asistente' },
    { name: 'Freddy Navarro Niño', cedula: '1090375249', email: 'freddysoad@hotmail.com', tipo: 'Asistente' },
    { name: 'Fabian Henao', cedula: '1061693647', email: 'dr.fabianhenao1@gmail.com', tipo: 'Asistente' },
    { name: 'Dany Ximena Gamez', cedula: '1112464957', email: 'dannyximenagamez@hotmail.com', tipo: 'Asistente' },
    { name: 'Alvaro Correa Jaramillo', cedula: '17150412', email: 'alvarocorreaj@gmail.com', tipo: 'Asistente' },
    { name: 'Liliana Gutierrez', cedula: '43894675', email: 'liliguvi1967@gmail.com', tipo: 'Asistente' },
    { name: 'Boris Luis Martinez Arellano', cedula: '73194043', email: 'martinezboris.1125@gmail.com', tipo: 'Asistente' },
    { name: 'Alexander Yesid Lujan Mendoza', cedula: '1122396761', email: 'alexander_lujan@hotmail.com', tipo: 'Asistente' },
    { name: 'Victor Hugo Villacis Basante', cedula: '1085269782', email: 'drvictorvillacisb@gmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Flor de Maria Romero Reyes', cedula: '1087798', email: 'draromeroreyes@yahoo.com', tipo: 'Asistente con cirugía' },
    { name: 'José Manuel Salvatierra Gonzalez', cedula: '123776818', email: 'j.salvatierra@hotmail.es', tipo: 'Asistente con cirugía' },
    { name: 'Zelmira Palomino Alarcon', cedula: '40215994', email: 'Jhoel_lc20@hotmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Rouny Jhoel Limache Cutipa', cedula: '42155032', email: 'Jhoel_lc20@hotmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Marlon de Jesús Consuegra González', cedula: '79934403', email: 'drmconsuegra@gmail.com', tipo: 'Asistente' },
    { name: 'Verónica Paola Morejón Acurio', cedula: 'A4394319', email: 'acuvero@hotmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Jennifer Viviana Montaña', cedula: '176758019', email: 'jennivm08@gmail.com', tipo: 'Asistente' },
    { name: 'Mario Montoya', cedula: '1017196188', email: 'Mariomontoyave@gmail.com', tipo: 'Asistente' },
    { name: 'Javier Alfonso Novoa Villamil', cedula: '6760451', email: 'Javier_novoa_1@hotmail.com', tipo: 'Asistente' },
    { name: 'Andres Sandoval Arango', cedula: '1098654104', email: 'andres_sandoval88@hotmail.com', tipo: 'Asistente' },
    { name: 'Visnelia Alexandra Martínez Rivas', cedula: '180950656', email: 'visneliam@gmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Ileana Perea Mena', cedula: '1026269638', email: 'ileneperea.otorrino@gmail.com', tipo: 'Asistente' },
    { name: 'Luz Bibiana Florez Giraldo', cedula: '43755493', email: 'luzbibiana@gmail.com', tipo: 'Asistente' },
    { name: 'Evert Armando Jimenez Cotes', cedula: '1037613222', email: 'evert_sp@hotmail.com', tipo: 'Asistente' },
    { name: 'Mario Botero', cedula: '70109602', email: 'mabotero70@gmail.com', tipo: 'Asistente' },
    { name: 'Carolina Casallas', cedula: '52858996', email: 'karocasallas@hotmail.com', tipo: 'Asistente' },
    { name: 'Esteban Correa Acebedo', cedula: '1152447491', email: 'Ecorrea04@gmail.com', tipo: 'Asistente' },
    { name: 'Carlos Betancur Madrid', cedula: '71311570', email: 'quirosolucionessas@gmail.com', tipo: 'Asistente' },
    { name: 'Denys Arteaga', cedula: '64575796', email: 'gerenciageneral@clinicaisis.com', tipo: 'Asistente' },
    { name: 'Carlos Alberto Gamboa Montesdeoc', cedula: '6530855', email: 'doctor.gamboa@hotmail.com', tipo: 'Asistente' },
    { name: 'Vanessa Palencia Suarez', cedula: '1100395163', email: 'vanessapal2012@gmail.com', tipo: 'Asistente' },
    { name: 'Ariel Felipe Llamas García', cedula: '73191341', email: 'arielllamasgarcias@gmail.com', tipo: 'Asistente' },
    { name: 'Carlos Mario Rondón Pinilla', cedula: '1032438974', email: 'carlosrondon@gmail.com', tipo: 'Asistente' },
    { name: 'Rafael Garcia Marquez', cedula: '196627114', email: 'rggarciamarquez@gmail.com', tipo: 'Asistente con cirugía' },
    { name: 'Melissa Mayo Patiño', cedula: '1019041747', email: 'mayo_meli@hotmail.com', tipo: 'Asistente' },
    { name: 'Lina Cardona', cedula: '30234707', email: 'liniscardona@gmail.com', tipo: 'Asistente' },
    { name: 'Maria Fernanda Maria', cedula: '1140849467', email: 'mafeguerra85@hotmail.com', tipo: 'Asistente' },
    { name: 'Jorge Julian Mendoza Anguila', cedula: '1065655575', email: 'julian.mendoza1@udea.edu.co', tipo: 'Asistente' },
    { name: 'Germán Pablo Sandoval Ortíz', cedula: '13844240', email: 'contabilidad.audiofon@gmail.com', tipo: 'Asistente' },
    { name: 'Ricardo Quitral', cedula: '10057690-2', email: 'rquitral@gmail.com', tipo: 'Asistente' },
    { name: 'Juan Carlos Martínez Osorio', cedula: 'N04527827', email: 'juancm10@ucm.es', tipo: 'Asistente' },
    { name: 'Juliana Montero Cortes', cedula: '1065569820', email: 'julianamontero1@gmail.com', tipo: 'Asistente' },
    { name: 'Lizbeth Vanessa Olivera Flores', cedula: 'XE10824', email: 'dra.vaneolivera@gmail.com', tipo: 'Asistente Virtual' },
    { name: 'Lina Patricia Franco Chaparro', cedula: '1013595775', email: 'lina_franco@hotmail.com', tipo: 'Asistente Virtual' },
    { name: 'Joel José Rodriguez Fernandez', cedula: '40223896594', email: 'joeljrodriguezf@gmail.com', tipo: 'Asistente Virtual' },
    { name: 'Norma Andrea Mares Villaseñor', cedula: 'G37079750', email: 'andysea89@hotmail.com', tipo: 'Asistente Virtual' },
    { name: 'Nestor Sánchez Rojas', cedula: '3413951', email: 'nsanchezcp@gmail.com', tipo: 'Asistente Virtual' },
    { name: 'Jeinner Alfredo Paredes Daza', cedula: '124024858', email: 'jeinner2013@gmail.com', tipo: 'Asistente Virtual' },
    { name: 'CARLOS ANDRES URZOLA MOSQUERA', cedula: '79905269',email: 'carlosurzola36@gmail.com', tipo: 'Asistente' },
    { name: 'Gustavo Urzola', cedula: '1020723270',email: 'inggustavourzola@gmail.com',  tipo: 'Asistente' },
    { name: 'Guillermo Landinez', cedula: '79956285', email: 'guillermoarturo.landinez@gmail.com',  tipo: 'Asistente' },
    { name: 'Rocio Luna Florez', cedula: '39011873', email: 'rocioluna64@yahoo.com', tipo: 'Asistente Virtual' },
    { name: 'María Carolina Caulier Femenia', cedula: '9037646-2', email: 'Ccaulier@yahoo.com', tipo: 'Asistente' }
  ]
  // Deduplicate by email, hash each user's cedula as su password y asignar role según tipo
  const tipoToRole = {
    'Asistente': 'ASSISTANT',
    'Asistente con cirugía': 'ASSISTANT_SURGICAL',
    'Asistente Virtual': 'ASSISTANT_VIRTUAL',
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
      role: tipoToRole[(a.tipo ?? '').trim() as keyof typeof tipoToRole] ?? 'ASSISTANT',
    }))
  );

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
