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
    const assistantRoster = [
        { name: 'CARLOS ANDRES URZOLA MOSQUERA', email: 'carlosurzola36@gmail.com', cedula: '7990526' },
        { name: 'Sebastian Orozco', email: 'sebastian.orozcoa@udea.edu.co', cedula: '1037582186' },
        { name: 'Mariana Velez Garces', email: 'mariana.velez1@udea.edu.co', cedula: '1152216203' },
        { name: 'Manuela Alejandra Rodríguez Cortés', email: 'manuelaroco1@gmail.com', cedula: '1020821066' },
        { name: 'Lisandro Guerra', email: 'guerralisandro@gmail.com', cedula: '71755048' },
        { name: 'Santiago Hernandez', email: 'santiagoha32@gmail.com', cedula: '1037634236' },
        { name: 'Claudia Paola Gonzalez Saboya', email: 'paogon19@hotmail.com', cedula: '1032430003' },
        { name: 'Gustavo Vanegas', email: 'gusvanegasorl@gmail.com', cedula: '80092720' },
        { name: 'Natalia Alexandra Yepes Garcia', email: 'natyyepes33@yahoo.com', cedula: '42690766' },
        { name: 'Ana Verónica Hernández Rodríguez', email: 'anitav0714@gmail.com', cedula: '1020752613' },
        { name: 'Isis', email: 'glandinez16@hotmail.com', cedula: '79963939' },
        { name: 'Nataly Vanegas Bustamante', email: 'natyv104@hotmail.com', cedula: '1020406286' },
        { name: 'Aury Palacios Abadia Palacios Abadía', email: 'aury0812@hotmail.com', cedula: '32298644' },
        { name: 'Juan Gabriel Salinas', email: 'juangasalinas@gmail.com', cedula: '80110031' },
        { name: 'Juan carlos borja', email: 'juancarlos.borja@hotmail.com', cedula: '73182970' },
        { name: 'Alison Catherine López Garcia', email: 'alisonlopez1@hotmail.com', cedula: '1130632543' },
        { name: 'Daniel Alejandro Montoya Castaño', email: 'damontoya.otorrino@gmail.com', cedula: '1088303633' },
        { name: 'Anamaria Salamanca Guerrero', email: 'anamariasalamanca02@gmail.com', cedula: '1098768019' },
        { name: 'Alejandro Jose Banegas', email: 'ajbanegas94@gmail.com', cedula: 'F837480' },
        { name: 'Ladislao Higuera arends', email: 'drladislaohiguera@gmail.com', cedula: '24303138' },
        { name: 'Naynel Milano', email: 'dramilanonaynel08@gmail.com', cedula: '18264692' },
        { name: 'Guillermina Tizi', email: 'draguillerminatizi@gmail.com', cedula: '8216597' },
        { name: 'Dayana Silva Escobar', email: 'comercial2@dme.com.co', cedula: '1006423909' },
        { name: 'Adriana Giraldo', email: 'agm0719@gmail.com', cedula: '1152187944' },
        { name: 'Cesar Edwin Martínez Correa', email: 'cesarmartinezcorrea@yahoo.com', cedula: '93381089' },
        { name: 'Andrés González Gonzalez', email: 'andres_felipe_gr@hotmail.com', cedula: '14702748' },
        { name: 'Mario Rafael Osorio Ospina', email: 'mariorafael1228@hotmail.com', cedula: '9295792' },
        { name: 'Roy Acosta Valerín', email: 'dracostaorl@gmail.com', cedula: '205150497' },
        { name: 'Gustavo Urzola', email: 'inggustavourzola@gmail.com', cedula: '1020723270' },
        { name: 'JUAN CARLOS PEÑA NARANJO', email: 'drjuancarlosotorrino@gmail.com', cedula: '80194959' },
        { name: 'FREDY DARIO ORTIZ ORTIZ', email: 'drfredyortiz@gmail.com', cedula: '87061171' },
        { name: 'DAMIAN AZTALA', email: 'damianeztala@gmail.com', cedula: '34324140' },
        { name: 'Juliana Aguirre', email: 'drajulianaaguirre@outlook.com', cedula: '1088246869' },
        { name: 'Dra. Katherine Mora', email: 'katherinemoraorl@gmail.com', cedula: '1016056100' },
        { name: 'CLAUDIA PATRICIA GARCIA GIRALDO', email: 'consultoriocer@hotmail.com', cedula: '43557582' },
        { name: 'JUAN FERNANDO GÓMEZ LOPERA', email: 'jfgomezotorrino@gmail.com', cedula: '3349695' },
        { name: 'Yorban O Bolanos G', email: 'yorban.otorrino@gmail.com', cedula: '1040181272' },
        { name: 'Daniel Ruíz Manco', email: 'danielruizmanco@gmail.com', cedula: '1010218013' },
        { name: 'DIEGO FERNANDO SUESCUN GOMEZ', email: 'diegosuescun@yahoo.es', cedula: '86062353' },
        { name: 'Amalia Botero', email: 'amalia.botero@hotmail.com', cedula: '39167677' },
        { name: 'GERMAN BERNAL', email: 'dr.germanbernal@gmail.com', cedula: '80926179' },
        { name: 'LEON FELIPE ZAPATA GIRALDO', email: 'leonfelipezapatag@gmail.com', cedula: '1128479450' },
        { name: 'ANTONIETA GOMEZ', email: 'antonietagomez83@gmail.com', cedula: '1020823714' },
        { name: 'FRANCISCO JAVIER FRANCO GONZALEZ', email: 'fcofdr@gmail.com', cedula: 'G28542944' },
        { name: 'Giovanny Linares Carreon', email: 'tathianadelrocio@gmail.com', cedula: '29470841' },
        { name: 'julissa micaela quispe', email: 'jmicaelaql@gmail.com', cedula: '48266447' },
        { name: 'Minor Valverde Madriz', email: 'gerencia@rinofacecr.com', cedula: '112610566' },
        { name: 'FABIO ALEJANDRO MOTTA CORTES', email: 'dr_mottac@hotmail.com', cedula: '80041841' },
        { name: 'XIOMARA CORREA JIMENEZ', email: 'xiomaracorreajimenez@hotmail.com', cedula: '43588097' },
        { name: 'LILIANA VITERY', email: 'dravitery@hotmail.com', cedula: '3208379930' },
        { name: 'Ileana Carolina Potes', email: 'ileanacarolinap@gmail.com', cedula: '57105426' },
        { name: 'KRISTEL ACHIO ARTAVIA', email: 'info@draachio.com', cedula: '603380181' },
        { name: 'ALBERTO ANGULO', email: 'albertoangulo118@gmail.com', cedula: '84086919' },
        { name: 'DIANA GUTIERREZ', email: 'dianacgd.dcgd@gmail.com', cedula: '176774794' },
        { name: 'GUZMAN PARRA LINARES', email: 'guzman1932@gmail.com', cedula: '16655771' },
        { name: 'ROSANGELA MARIA MONCADA ORDUÑO', email: 'rosangelamoncada26@gmail.com', cedula: '183204866' },
        { name: 'VANESSA DEL CARMEN COLINA', email: 'dravanessacolina279@gmail.com', cedula: '7863082' },
        { name: 'PAULA ANDREA JARAMILLO CUARTAS', email: 'panjacu@hotmail.com', cedula: '43155936' },
        { name: 'Jhonny Alexander Ortiz', email: 'drortiz.orl@gmail.com', cedula: '1085307846' },
        { name: 'Jonathan Rozenboim Matiz', email: 'jrozenboim@gmail.com', cedula: '72285786' },
        { name: 'Betsy Patricia Pareja Ibarra', email: 'paty.pareja@gmail.com', cedula: '52646358' },
        { name: 'Jose Gregorio Colina', email: 'grupojcolina@gmail.com', cedula: '178662532' },
        { name: 'Visnelia Alexandra Martínez Rivas', email: 'visneliam@gmail.com', cedula: '180950656' },
        { name: 'HUGO HENANDO BELTRAN BONILLA', email: 'hugobeltranb@hotmail.com', cedula: '79999975' },
        { name: 'FREDDY NAVARRO NIÑO', email: 'freddysoad@hotmail.com', cedula: '1090375249' },
        { name: 'FABIAN HENAO', email: 'dr.fabianhenao1@gmail.com', cedula: '1061693647' },
        { name: 'DANY XIMENA GAMEZ', email: 'dannyximenagamez@hotmail.com', cedula: '1112464957' },
        { name: 'PAOLA VALLEJO SIERRA', email: 'doc.paolavallejos@gmail.com', cedula: '43608897' },
        { name: 'Manuel Piza', email: 'drpiza@medicos.cr', cedula: '204810880' },
        { name: 'Erika Gutierrez', email: 'erika.gu.ro@gmail.com', cedula: '52957646' },
        { name: 'LILIANA GUTIERREZ', email: 'liliguvi1967@gmail.com', cedula: '43894675' },
        { name: 'Boris Luis Martinez Arellano', email: 'martinezboris.1125@gmail.com', cedula: '73194043' },
        { name: 'Alexander Yesid Lujan Mendoza', email: 'alexander_lujan@hotmail.com', cedula: '1122396761' },
        { name: 'Victor Hugo Villacis Basante', email: 'drvictorvillacisb@gmail.com', cedula: '1085269782' },
        { name: 'Flor de Maria Romero Reyes', email: 'draromeroreyes@yahoo.com', cedula: 'C 01087798' },
        { name: 'José Manuel Salvatierra Gonzales', email: 'j.salvatierra@hotmail.es', cedula: '123776818' },
        { name: 'Carolina Casallas', email: 'karocasallas@hotmail.com', cedula: '52858996' },
        { name: 'MELANIE LISSETH Quispe garces', email: 'quispegarcesmelanie@gmail.com', cedula: '46290598' }
    ];
    // Deduplicate by email, hash each user's cedula as their password
    const uniqueRoster = Array.from(new Map(assistantRoster.map((a) => [a.email.toLowerCase(), a])).values());
    const assistantUsers = await Promise.all(uniqueRoster.map(async (a) => ({
        name: a.name.trim(),
        email: a.email.trim().toLowerCase(),
        passwordHash: await hashPassword(a.cedula),
        role: 'ASSISTANT'
    })));
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
    await prisma.user.createMany({
        data: assistantUsers,
        skipDuplicates: true
    });
    await prisma.eventInfo.create({
        data: {
            id: 1,
            name: 'RINOMED 2026 – Curso Internacional de Rinoplastia y Cirugía Plástica Facial',
            city: 'Medellín',
            dates: '17–18 de abril de 2026',
            venue: 'Medellín, Colombia',
            address: 'Medellín, Colombia',
            email: 'info@rinomed2026.com',
            phone: '+57 604 0000000',
            whatsapp: '+57 300 0000000',
            website: 'https://rinomed2026.com',
            mapsUrl: 'https://maps.google.com/?q=Medellin+Colombia',
            academicHours: '20 horas académicas'
        }
    });
    // ── SPEAKERS ────────────────────────────────────────────────────────────────
    const [froilan, neves, moreraE, herreraN, romeroG, roseroF, pedrozaC, ortegaS, bedoyaJD, molanoJ, velezS, vanegas, landinez, urzola, munozS, yepesA] = await Promise.all([
        prisma.speaker.create({ data: { name: 'Dr. Froilan Páez', country: 'Venezuela', specialty: 'Rinoplastia', bio: 'Experto en preservación dorsal y técnicas de punta nasal.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dr. José Carlos Neves', country: 'Portugal', specialty: 'Rinoplastia de preservación', bio: 'Creador del Concepto Tetris y técnicas de DAL Split.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dr. Eduardo Morera', country: 'España', specialty: 'Rinoplastia avanzada', bio: 'Desarrollador de la técnica SPQR+ para laterorrinias y estrategia Rock Star.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dr. Noé Herrera', country: 'México', specialty: 'Rinoplastia en piel gruesa', bio: 'Especialista en colgajos de filtrum y reconstrucción con abordaje cerrado.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dr. Gustavo Romero', country: 'Colombia', specialty: 'Rinoplastia', bio: 'Experto en piel gruesa, LEGO Concept y control columelar.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dr. Francisco Rosero', country: 'Colombia', specialty: 'Reconstrucción nasal', bio: 'Especialista en técnicas controversiales de reconstrucción nasal difícil.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dr. Carlos Pedroza', country: 'Colombia', specialty: 'Cirugía de base nasal', bio: 'Referente en cirugía de base nasal segura y efectiva.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dra. Sandra Ortega', country: 'Colombia', specialty: 'Tecnologías en rinoplastia', bio: 'Experta en innovación tecnológica y manejo de complicaciones.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dr. Juan David Bedoya', country: 'Colombia', specialty: 'Otorrinolaringología', bio: 'Especialista en poliposis nasal y rinoplastia con patología asociada.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dr. Julián Molano', country: 'Colombia', specialty: 'Otorrinolaringología', bio: 'Panelista en manejo de rinoplastia con poliposis nasal.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dra. Sara Vélez', country: 'Colombia', specialty: 'Cirugía Plástica Facial', bio: 'Moderadora y asistente quirúrgica en cirugías en vivo.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dra. Nataly Vanegas', country: 'Colombia', specialty: 'Cirugía Plástica Facial', bio: 'Asistente quirúrgica en cirugías en vivo y moderadora.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dr. Guillermo Landínez', country: 'Colombia', specialty: 'Cirugía Plástica Facial', bio: 'Co-director de RINOMED 2026 y moderador del evento.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dr. Carlos Urzola', country: 'Colombia', specialty: 'Cirugía Plástica Facial', bio: 'Co-director de RINOMED 2026 y moderador del evento.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Dr. Samuel Muñoz', country: 'Colombia', specialty: 'Cirugía Plástica Facial', bio: 'Conferencista en experiencia sensorial – Desayuno con diamantes.', photoUrl: 'https://placehold.co/300x300' } }),
        prisma.speaker.create({ data: { name: 'Alejandro Yepes', country: 'Colombia', specialty: 'Marketing y Tecnología', bio: 'Especialista en marketing, redes sociales e IA en cirugía plástica. Cromia.', photoUrl: 'https://placehold.co/300x300' } })
    ]);
    // ── SESSIONS ────────────────────────────────────────────────────────────────
    // Each entry: { sessionData, speakerIds[] }
    const sessionDefs = [
        // DÍA 1 ─────────────────────────────────────────────────────────────────
        {
            data: { day: day1, startTime: '07:00', endTime: '08:00', room: 'Registro', title: 'Apertura de registro y acreditaciones', topic: 'Institucional', level: 'General', description: 'Apertura de registro y acreditaciones del congreso.' },
            speakers: []
        },
        {
            data: { day: day1, startTime: '08:00', endTime: '08:10', room: 'Auditorio', title: 'Bienvenida e inauguración oficial RINOMED 2026', topic: 'Institucional', level: 'General', description: 'Bienvenida e inauguración oficial del evento.' },
            speakers: [urzola.id, landinez.id]
        },
        // SESIÓN MASTER
        {
            data: { day: day1, startTime: '08:10', endTime: '08:40', room: 'Auditorio', title: '¿Cómo logro que mis líneas estéticas dorsales se vean como las de Froilan?', topic: 'Rinoplastia – Preservación dorsal', level: 'Avanzado', description: 'MASTER CLASS. Preservación dorsal a mi manera. Contorno estructural en cuatro fases.' },
            speakers: [froilan.id]
        },
        {
            data: { day: day1, startTime: '08:40', endTime: '09:10', room: 'Auditorio', title: 'Creando el diamante perfecto de la punta nasal', topic: 'Rinoplastia – Punta nasal', level: 'Avanzado', description: 'El concepto del triángulo isósceles. Fusion Sling. Hook manoeuvre para soporte de punta nasal. Toolbox de suturas de punta nasal.' },
            speakers: [neves.id]
        },
        {
            data: { day: day1, startTime: '09:10', endTime: '09:30', room: 'Auditorio', title: '¿Por qué el dorso contemporáneo no necesita preservación?', topic: 'Rinoplastia – Dorso nasal', level: 'Avanzado', description: 'Análisis crítico del dorso contemporáneo y alternativas a la preservación.' },
            speakers: [moreraE.id]
        },
        {
            data: { day: day1, startTime: '09:30', endTime: '09:50', room: 'Auditorio', title: 'Técnica SPQR+ para el tratamiento de laterorrinias', topic: 'Rinoplastia – Laterorrinia', level: 'Avanzado', description: 'Técnica SPQR+ aplicada al manejo de laterorrinias.' },
            speakers: [moreraE.id]
        },
        {
            data: { day: day1, startTime: '09:50', endTime: '10:10', room: 'Auditorio', title: 'Coffee break & networking', topic: 'Pausa', level: 'General', description: 'Pausa para café y networking entre asistentes.' },
            speakers: []
        },
        // TÉCNICAS AVANZADAS
        {
            data: { day: day1, startTime: '10:10', endTime: '10:30', room: 'Auditorio', title: 'Colgajos de avance de filtrum: cómo y cuándo los utilizo', topic: 'Rinoplastia – Colgajos', level: 'Avanzado', description: 'Indicaciones y técnica de los colgajos de avance de filtrum.' },
            speakers: [herreraN.id]
        },
        {
            data: { day: day1, startTime: '10:30', endTime: '10:50', room: 'Auditorio', title: 'Desafiando la piel gruesa: manejo, equilibrio y refinamiento de la punta nasal', topic: 'Rinoplastia – Piel gruesa', level: 'Avanzado', description: 'Estrategias para el manejo y refinamiento de la punta nasal en piel gruesa.' },
            speakers: [romeroG.id]
        },
        {
            data: { day: day1, startTime: '10:50', endTime: '11:10', room: 'Auditorio', title: 'Por qué amputo las cruras medias en reconstrucción nasal difícil', topic: 'Reconstrucción nasal', level: 'Avanzado', description: 'Mi injerto controversial. Técnica y justificación clínica.' },
            speakers: [roseroF.id]
        },
        {
            data: { day: day1, startTime: '11:10', endTime: '11:30', room: 'Auditorio', title: 'Cirugía de la base nasal: simple, segura y efectiva', topic: 'Rinoplastia – Base nasal', level: 'Intermedio', description: 'Abordaje simplificado y seguro para la cirugía de la base nasal.' },
            speakers: [pedrozaC.id]
        },
        {
            data: { day: day1, startTime: '11:30', endTime: '11:50', room: 'Auditorio', title: 'Evolución de las tecnologías de alto poder en rinoplastia', topic: 'Innovación', level: 'Intermedio', description: 'Lo que antes era estándar y hoy ya no lo es.' },
            speakers: [ortegaS.id]
        },
        // SIMPOSIO ALMUERZO DÍA 1
        {
            data: { day: day1, startTime: '12:00', endTime: '13:00', room: 'Auditorio', title: 'Simposio GSK – ¿Qué hacer si mi paciente de rinoplastia tiene poliposis nasal?', topic: 'Simposio – Poliposis', level: 'Intermedio', description: 'Simposio patrocinado por GSK. Panelistas: Dr. Eduardo Morera (España), Dr. Juan David Bedoya (Colombia), Dr. Julián Molano (Colombia).' },
            speakers: [moreraE.id, bedoyaJD.id, molanoJ.id]
        },
        // CIRUGÍAS EN VIVO DÍA 1
        {
            data: { day: day1, startTime: '13:00', endTime: '17:00', room: 'Quirófano 1', title: 'Cirugía en vivo – Rinoplastia primaria con técnica de rinoplastia fusión', topic: 'Cirugía en vivo', level: 'Avanzado', description: 'Rinoplastia latinoamericana: Venezuela vs México. Ayudantía: Dra. Nataly Vanegas. Moderadores en sala: Dra. Sara Vélez, Dra. Nataly Vanegas. Moderadores en auditorio: Dr. Guillermo Landínez, Dr. Carlos Urzola.' },
            speakers: [froilan.id, vanegas.id, velezS.id, landinez.id, urzola.id]
        },
        {
            data: { day: day1, startTime: '13:00', endTime: '17:00', room: 'Quirófano 2', title: 'Cirugía en vivo – Rinoplastia primaria en piel gruesa con injerto costal', topic: 'Cirugía en vivo', level: 'Avanzado', description: 'Rinoplastia latinoamericana: Venezuela vs México. Ayudantía: Dr. Francisco Rosero. Moderadores en sala: Dra. Sara Vélez, Dra. Nataly Vanegas. Moderadores en auditorio: Dr. Guillermo Landínez, Dr. Carlos Urzola.' },
            speakers: [herreraN.id, roseroF.id, velezS.id, vanegas.id, landinez.id, urzola.id]
        },
        // MESA REDONDA DÍA 1
        {
            data: { day: day1, startTime: '17:00', endTime: '18:00', room: 'Auditorio', title: 'Mesa redonda – Manejo prequirúrgico y posquirúrgico en rinoplastia', topic: 'Mesa redonda', level: 'Avanzado', description: 'Lo que no te dicen en los congresos. Temas: antibióticos profilácticos, corticoides sistémicos y ácido tranexámico, taping y férulas, conformadores nasales, tabaquismo y nicotina, analgesia y AINEs.' },
            speakers: [neves.id, moreraE.id, roseroF.id, romeroG.id, ortegaS.id, pedrozaC.id]
        },
        // CENA DÍA 1
        {
            data: { day: day1, startTime: '20:00', endTime: '22:00', room: 'Evento social', title: 'Cena con las estrellas – Degustando las delicias de Medellín', topic: 'Evento social', level: 'General', description: 'Evento social del congreso. Actividad con inscripción adicional.' },
            speakers: []
        },
        // DÍA 2 ─────────────────────────────────────────────────────────────────
        {
            data: { day: day2, startTime: '07:00', endTime: '08:00', room: 'Auditorio', title: 'Desayuno con diamantes: una experiencia sensorial', topic: 'Simposio – Desayuno', level: 'General', description: 'Patrocinado por Sanofi Aventis.' },
            speakers: [munozS.id]
        },
        // CIRUGÍAS EN VIVO DÍA 2
        {
            data: { day: day2, startTime: '08:00', endTime: '12:00', room: 'Quirófano 1', title: 'Cirugía en vivo – Rinoplastia primaria: Estrategia "Rock Star" para el manejo de laterorrinia', topic: 'Cirugía en vivo', level: 'Avanzado', description: 'Rinoplastia europea: España vs Portugal. Ayudantía: Dr. Gustavo Romero. Moderadores en sala: Dra. Sara Vélez, Dra. Nataly Vanegas. Moderadores en auditorio: Dr. Guillermo Landínez, Dr. Carlos Urzola.' },
            speakers: [moreraE.id, romeroG.id, velezS.id, vanegas.id, landinez.id, urzola.id]
        },
        {
            data: { day: day2, startTime: '08:00', endTime: '12:00', room: 'Quirófano 2', title: 'Cirugía en vivo – Rinoplastia primaria de preservación: Concepto Tetris', topic: 'Cirugía en vivo', level: 'Avanzado', description: 'Rinoplastia europea: España vs Portugal. Ayudantía: Dra. Sara Vélez. Moderadores en sala: Dra. Sara Vélez, Dra. Nataly Vanegas. Moderadores en auditorio: Dr. Guillermo Landínez, Dr. Carlos Urzola.' },
            speakers: [neves.id, velezS.id, vanegas.id, landinez.id, urzola.id]
        },
        // SIMPOSIO ALMUERZO DÍA 2
        {
            data: { day: day2, startTime: '12:00', endTime: '13:00', room: 'Auditorio', title: 'Blefaroplastia no quirúrgica (demostración)', topic: 'Simposio – Blefaroplastia', level: 'Intermedio', description: 'Patrocinado por GlobalTee.' },
            speakers: []
        },
        // TÉCNICAS AVANZADAS DÍA 2
        {
            data: { day: day2, startTime: '13:00', endTime: '13:30', room: 'Auditorio', title: '¿Cómo logro que mis puntas nasales se vean como las de Froilan?', topic: 'Rinoplastia – Punta nasal', level: 'Avanzado', description: 'Punta del armadillo. Desde lo poligonal hasta lo extendido.' },
            speakers: [froilan.id]
        },
        {
            data: { day: day2, startTime: '13:30', endTime: '13:50', room: 'Auditorio', title: 'LEGO Concept – La clave oculta para el control columelar', topic: 'Rinoplastia – Columela', level: 'Avanzado', description: 'LEGO Concept para el control preciso de la columela.' },
            speakers: [romeroG.id]
        },
        {
            data: { day: day2, startTime: '13:50', endTime: '14:10', room: 'Auditorio', title: 'Reconstrucción nasal con abordaje cerrado', topic: 'Reconstrucción nasal', level: 'Avanzado', description: 'Técnica de reconstrucción nasal con abordaje cerrado.' },
            speakers: [herreraN.id]
        },
        {
            data: { day: day2, startTime: '14:10', endTime: '14:30', room: 'Auditorio', title: 'Cómo resolver complicaciones en rinoplastia', topic: 'Complicaciones', level: 'Avanzado', description: 'Manejo y resolución de complicaciones en rinoplastia.' },
            speakers: [ortegaS.id]
        },
        {
            data: { day: day2, startTime: '14:30', endTime: '15:00', room: 'Auditorio', title: 'Marketing, redes sociales e inteligencia artificial en cirugía plástica facial', topic: 'Marketing y Tecnología', level: 'General', description: 'Alejandro Yepes – Cromia.' },
            speakers: [yepesA.id]
        },
        {
            data: { day: day2, startTime: '15:00', endTime: '15:30', room: 'Auditorio', title: 'Coffee break', topic: 'Pausa', level: 'General', description: 'Pausa para café.' },
            speakers: []
        },
        {
            data: { day: day2, startTime: '15:30', endTime: '16:00', room: 'Auditorio', title: 'Rinoplastia de preservación al estilo Neves – Concepto Tetris para dummies', topic: 'Rinoplastia – Preservación', level: 'Intermedio', description: 'Explicación accesible del Concepto Tetris para rinoplastia de preservación.' },
            speakers: [neves.id]
        },
        {
            data: { day: day2, startTime: '16:00', endTime: '16:30', room: 'Auditorio', title: 'DAL Split and Step-Up Manoeuvres', topic: 'Rinoplastia – DAL', level: 'Avanzado', description: 'Técnicas DAL Split y Step-Up Manoeuvres.' },
            speakers: [neves.id]
        },
        // MASTER CLASS FINAL
        {
            data: { day: day2, startTime: '16:30', endTime: '17:30', room: 'Auditorio', title: 'MASTER CLASS – Perlas en reconstrucción nasal: casos reales', topic: 'Reconstrucción nasal', level: 'Avanzado', description: 'Casos reales presentados por: Dr. Eduardo Morera (16:30), Dr. Francisco Rosero (16:40), Dr. Noé Herrera (16:50), Dr. Carlos Pedroza (17:00), Dr. Froilan Páez (17:10), Dr. Gustavo Romero (17:20).' },
            speakers: [moreraE.id, roseroF.id, herreraN.id, pedrozaC.id, froilan.id, romeroG.id]
        },
        // MESA REDONDA FINAL
        {
            data: { day: day2, startTime: '17:30', endTime: '18:30', room: 'Auditorio', title: 'Mesa redonda final – Temas controversiales en rinoplastia', topic: 'Mesa redonda', level: 'Avanzado', description: 'Temas: manejo del paciente difícil, complicaciones en redes sociales, piel gruesa o fibrograsa, perforación septal concomitante, nariz post-filler, camuflaje en piel fina.' },
            speakers: [froilan.id, neves.id, moreraE.id, herreraN.id, romeroG.id, roseroF.id, pedrozaC.id, ortegaS.id]
        },
        // CLAUSURA
        {
            data: { day: day2, startTime: '18:30', endTime: '18:30', room: 'Auditorio', title: 'Clausura oficial RINOMED 2026', topic: 'Clausura', level: 'General', description: 'Clausura oficial del congreso.' },
            speakers: [urzola.id, landinez.id]
        },
        {
            data: { day: day2, startTime: '20:00', endTime: '23:59', room: 'Evento social', title: 'Evento de clausura RINOMED 2026', topic: 'Evento social', level: 'General', description: 'Evento social de cierre del congreso. Actividad con inscripción adicional.' },
            speakers: []
        }
    ];
    for (const def of sessionDefs) {
        const session = await prisma.session.create({ data: def.data });
        for (const speakerId of def.speakers) {
            await prisma.sessionSpeaker.create({ data: { sessionId: session.id, speakerId } });
        }
    }
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
