import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { logger } from "../src/config/logger";

const prisma = new PrismaClient();

async function main() {
    logger.info("🌱 Seeding database...");

    // Hash du mot de passe par défaut: "password123"
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Nettoyer la base de données (optionnel - commenté pour éviter de supprimer les données existantes)
    // await prisma.appointment.deleteMany();
    // await prisma.patient.deleteMany();
    // await prisma.secretaryClinic.deleteMany();
    // await prisma.secretary.deleteMany();
    // await prisma.doctor.deleteMany();
    // await prisma.clinic.deleteMany();

    // 1. Créer les cabinets
    logger.info("📋 Creating clinics...");
    const clinic1 = await prisma.clinic.upsert({
        where: { clinicId: "clinic_001" },
        update: {},
        create: {
            clinicId: "clinic_001",
            name: "Cabinet Médical Central",
            address: "123 Rue de la Santé, 75001 Paris",
            phone: "01 23 45 67 89",
            email: "contact@cabinet-central.fr",
        },
    });

    const clinic2 = await prisma.clinic.upsert({
        where: { clinicId: "clinic_002" },
        update: {},
        create: {
            clinicId: "clinic_002",
            name: "Clinique du Nord",
            address: "456 Avenue du Nord, 69001 Lyon",
            phone: "04 12 34 56 78",
            email: "contact@clinique-nord.fr",
        },
    });

    const clinic3 = await prisma.clinic.upsert({
        where: { clinicId: "clinic_003" },
        update: {},
        create: {
            clinicId: "clinic_003",
            name: "Centre Médical Sud",
            address: "789 Boulevard du Sud, 13001 Marseille",
            phone: "04 98 76 54 32",
            email: "contact@centre-sud.fr",
        },
    });

    // 2. Créer les médecins
    logger.info("👨‍⚕️ Creating doctors...");
    const doctor1 = await prisma.doctor.upsert({
        where: { doctorId: "doc_001" },
        update: {},
        create: {
            doctorId: "doc_001",
            firstName: "Jean",
            surname: "Martin",
            email: "jean.martin@example.com",
            password: hashedPassword,
            phone: "06 12 34 56 78",
            specialization: "Cardiologie",
            clinicId: clinic1.clinicId,
        },
    });

    const doctor2 = await prisma.doctor.upsert({
        where: { doctorId: "doc_002" },
        update: {},
        create: {
            doctorId: "doc_002",
            firstName: "Marie",
            surname: "Dubois",
            email: "marie.dubois@example.com",
            password: hashedPassword,
            phone: "06 23 45 67 89",
            specialization: "Dermatologie",
            clinicId: clinic1.clinicId,
        },
    });

    const doctor3 = await prisma.doctor.upsert({
        where: { doctorId: "doc_003" },
        update: {},
        create: {
            doctorId: "doc_003",
            firstName: "Pierre",
            surname: "Bernard",
            email: "pierre.bernard@example.com",
            password: hashedPassword,
            phone: "06 34 56 78 90",
            specialization: "Médecine générale",
            clinicId: clinic2.clinicId,
        },
    });

    const doctor4 = await prisma.doctor.upsert({
        where: { doctorId: "doc_004" },
        update: {},
        create: {
            doctorId: "doc_004",
            firstName: "Sophie",
            surname: "Lefebvre",
            email: "sophie.lefebvre@example.com",
            password: hashedPassword,
            phone: "06 45 67 89 01",
            specialization: "Pédiatrie",
            clinicId: clinic2.clinicId,
        },
    });

    const doctor5 = await prisma.doctor.upsert({
        where: { doctorId: "doc_005" },
        update: {},
        create: {
            doctorId: "doc_005",
            firstName: "Catherine",
            surname: "Martin",
            email: "catherine.martin@example.com",
            password: hashedPassword,
            phone: "06 56 78 90 12",
            specialization: "Gynécologie",
            clinicId: clinic3.clinicId,
        },
    });

    // 3. Créer les secrétaires
    logger.info("👩‍💼 Creating secretaries...");
    const secretary1 = await prisma.secretary.upsert({
        where: { secretaryId: "sec_001" },
        update: {},
        create: {
            secretaryId: "sec_001",
            firstName: "Julie",
            surname: "Moreau",
            email: "julie.moreau@example.com",
            password: hashedPassword,
            phone: "06 11 22 33 44",
            clinics: {
                create: [{ clinicId: clinic1.id }, { clinicId: clinic2.id }],
            },
        },
    });

    const secretary2 = await prisma.secretary.upsert({
        where: { secretaryId: "sec_002" },
        update: {},
        create: {
            secretaryId: "sec_002",
            firstName: "Thomas",
            surname: "Petit",
            email: "thomas.petit@example.com",
            password: hashedPassword,
            phone: "06 22 33 44 55",
            clinics: {
                create: [{ clinicId: clinic2.id }, { clinicId: clinic3.id }],
            },
        },
    });

    const secretary3 = await prisma.secretary.upsert({
        where: { secretaryId: "sec_003" },
        update: {},
        create: {
            secretaryId: "sec_003",
            firstName: "Emma",
            surname: "Roux",
            email: "emma.roux@example.com",
            password: hashedPassword,
            phone: "06 33 44 55 66",
            clinics: {
                create: [{ clinicId: clinic3.id }],
            },
        },
    });

    // 4. Créer les patients
    logger.info("👤 Creating patients...");
    const patient1 = await prisma.patient.upsert({
        where: { patientId: "pat_001" },
        update: {},
        create: {
            patientId: "pat_001",
            firstName: "Alice",
            surname: "Dupont",
            email: "alice.dupont@example.com",
            password: hashedPassword,
            phone: "06 10 20 30 40",
            dateOfBirth: new Date("1990-05-15"),
            address: "10 Rue de la Paix, 75001 Paris",
            assignedDoctorId: doctor1.id,
        },
    });

    const patient2 = await prisma.patient.upsert({
        where: { patientId: "pat_002" },
        update: {},
        create: {
            patientId: "pat_002",
            firstName: "Bob",
            surname: "Durand",
            email: "bob.durand@example.com",
            password: hashedPassword,
            phone: "06 20 30 40 50",
            dateOfBirth: new Date("1985-08-22"),
            address: "25 Avenue des Champs, 69001 Lyon",
            assignedDoctorId: doctor1.id,
        },
    });

    const patient3 = await prisma.patient.upsert({
        where: { patientId: "pat_003" },
        update: {},
        create: {
            patientId: "pat_003",
            firstName: "Claire",
            surname: "Leroy",
            email: "claire.leroy@example.com",
            password: hashedPassword,
            phone: "06 30 40 50 60",
            dateOfBirth: new Date("1992-11-10"),
            address: "5 Boulevard de la République, 13001 Marseille",
            assignedDoctorId: doctor2.id,
        },
    });

    const patient4 = await prisma.patient.upsert({
        where: { patientId: "pat_004" },
        update: {},
        create: {
            patientId: "pat_004",
            firstName: "David",
            surname: "Moreau",
            email: "david.moreau@example.com",
            password: hashedPassword,
            phone: "06 40 50 60 70",
            dateOfBirth: new Date("1988-03-25"),
            address: "15 Rue Victor Hugo, 75002 Paris",
            assignedDoctorId: doctor3.id,
        },
    });

    const patient5 = await prisma.patient.upsert({
        where: { patientId: "pat_005" },
        update: {},
        create: {
            patientId: "pat_005",
            firstName: "Emma",
            surname: "Simon",
            email: "emma.simon@example.com",
            password: hashedPassword,
            phone: "06 50 60 70 80",
            dateOfBirth: new Date("1995-07-18"),
            address: "30 Place de la Mairie, 69002 Lyon",
            assignedDoctorId: doctor3.id,
        },
    });

    const patient6 = await prisma.patient.upsert({
        where: { patientId: "pat_006" },
        update: {},
        create: {
            patientId: "pat_006",
            firstName: "François",
            surname: "Laurent",
            email: "francois.laurent@example.com",
            password: hashedPassword,
            phone: "06 60 70 80 90",
            dateOfBirth: new Date("1991-12-05"),
            address: "8 Avenue de la Gare, 13002 Marseille",
            assignedDoctorId: doctor4.id,
        },
    });

    const patient7 = await prisma.patient.upsert({
        where: { patientId: "pat_007" },
        update: {},
        create: {
            patientId: "pat_007",
            firstName: "Gabrielle",
            surname: "Garcia",
            email: "gabrielle.garcia@example.com",
            password: hashedPassword,
            phone: "06 70 80 90 10",
            dateOfBirth: new Date("1987-09-30"),
            address: "12 Rue du Commerce, 75003 Paris",
            assignedDoctorId: doctor4.id,
        },
    });

    const patient8 = await prisma.patient.upsert({
        where: { patientId: "pat_008" },
        update: {},
        create: {
            patientId: "pat_008",
            firstName: "Henri",
            surname: "Rodriguez",
            email: "henri.rodriguez@example.com",
            password: hashedPassword,
            phone: "06 80 90 10 20",
            dateOfBirth: new Date("1993-04-12"),
            address: "20 Boulevard Saint-Michel, 75005 Paris",
            assignedDoctorId: doctor5.id,
        },
    });

    // 5. Créer les rendez-vous
    logger.info("📅 Creating appointments...");
    const appointments = [
        {
            appointmentId: "appt_001",
            patient: patient1,
            doctor: doctor1,
            date: new Date("2025-12-15"),
            time: "10:00 AM",
            reason: "Consultation de routine",
            status: "CONFIRMED" as const,
        },
        {
            appointmentId: "appt_002",
            patient: patient2,
            doctor: doctor1,
            date: new Date("2025-12-15"),
            time: "11:00 AM",
            reason: "Suivi cardiaque",
            status: "CONFIRMED" as const,
            notes: "Patient à risque",
        },
        {
            appointmentId: "appt_003",
            patient: patient3,
            doctor: doctor2,
            date: new Date("2025-12-15"),
            time: "02:00 PM",
            reason: "Examen de la peau",
            status: "PENDING" as const,
        },
        {
            appointmentId: "appt_004",
            patient: patient4,
            doctor: doctor3,
            date: new Date("2025-12-16"),
            time: "09:00 AM",
            reason: "Consultation générale",
            status: "CONFIRMED" as const,
        },
        {
            appointmentId: "appt_005",
            patient: patient5,
            doctor: doctor3,
            date: new Date("2025-12-16"),
            time: "10:30 AM",
            reason: "Vaccination",
            status: "DOCTOR_CREATED" as const,
            notes: "Rappel vaccin",
        },
        {
            appointmentId: "appt_006",
            patient: patient6,
            doctor: doctor4,
            date: new Date("2025-12-16"),
            time: "03:00 PM",
            reason: "Consultation pédiatrique",
            status: "CONFIRMED" as const,
        },
        {
            appointmentId: "appt_007",
            patient: patient7,
            doctor: doctor4,
            date: new Date("2025-12-17"),
            time: "09:30 AM",
            reason: "Suivi enfant",
            status: "PENDING" as const,
        },
        {
            appointmentId: "appt_008",
            patient: patient8,
            doctor: doctor5,
            date: new Date("2025-12-17"),
            time: "11:00 AM",
            reason: "Consultation gynécologique",
            status: "CONFIRMED" as const,
        },
        {
            appointmentId: "appt_009",
            patient: patient1,
            doctor: doctor1,
            date: new Date("2025-12-18"),
            time: "10:00 AM",
            reason: "Bilan annuel",
            status: "PENDING" as const,
        },
        {
            appointmentId: "appt_010",
            patient: patient2,
            doctor: doctor1,
            date: new Date("2025-12-18"),
            time: "02:30 PM",
            reason: "Contrôle tension",
            status: "CONFIRMED" as const,
        },
        {
            appointmentId: "appt_011",
            patient: patient3,
            doctor: doctor2,
            date: new Date("2025-12-19"),
            time: "10:00 AM",
            reason: "Dermatite",
            status: "PENDING" as const,
        },
        {
            appointmentId: "appt_012",
            patient: patient4,
            doctor: doctor3,
            date: new Date("2025-12-19"),
            time: "03:00 PM",
            reason: "Consultation urgente",
            status: "CONFIRMED" as const,
            notes: "Symptômes grippaux",
        },
        {
            appointmentId: "appt_013",
            patient: patient5,
            doctor: doctor3,
            date: new Date("2025-12-20"),
            time: "09:00 AM",
            reason: "Certificat médical",
            status: "PENDING" as const,
        },
        {
            appointmentId: "appt_014",
            patient: patient6,
            doctor: doctor4,
            date: new Date("2025-12-20"),
            time: "11:00 AM",
            reason: "Vaccination enfant",
            status: "CONFIRMED" as const,
        },
        {
            appointmentId: "appt_015",
            patient: patient7,
            doctor: doctor4,
            date: new Date("2025-12-21"),
            time: "10:00 AM",
            reason: "Consultation de routine",
            status: "PENDING" as const,
        },
    ];

    for (const apt of appointments) {
        await prisma.appointment.upsert({
            where: { appointmentId: apt.appointmentId },
            update: {},
            create: {
                appointmentId: apt.appointmentId,
                appointedPatientId: apt.patient.id,
                appointedDoctorId: apt.doctor.id,
                date: apt.date,
                time: apt.time,
                reason: apt.reason,
                status: apt.status,
                notes: apt.notes,
            },
        });
    }

    logger.info("✅ Seeding completed!");
    logger.info("\n📊 Summary:");
    logger.info(`   - ${await prisma.clinic.count()} clinics`);
    logger.info(`   - ${await prisma.doctor.count()} doctors`);
    logger.info(`   - ${await prisma.secretary.count()} secretaries`);
    logger.info(`   - ${await prisma.patient.count()} patients`);
    logger.info(`   - ${await prisma.appointment.count()} appointments`);
    logger.info(
        `   - ${await prisma.secretaryClinic.count()} secretary-clinic relations`
    );
    logger.info("\n🔑 Default password for all users: password123");
}

main()
    .catch((e) => {
        logger.error("❌ Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
