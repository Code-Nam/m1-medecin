# Email Notification System - Documentation

## Vue d'ensemble

Le système d'envoi d'emails automatiques a été intégré au service de gestion des rendez-vous. Il utilise **Resend** pour envoyer des emails en français aux patients.

---

## 📧 Types d'emails

### 1. Email de Rappel (Reminder)

**Quand:** Envoyé automatiquement lors de la **création d'un rendez-vous**  
**Destinataire:** Patient  
**Objet:** `Rappel : Rendez-vous avec Dr [Nom du médecin]`

**Contenu:**

-   📅 Date du rendez-vous
-   🕐 Heure du rendez-vous
-   👨‍⚕️ Nom et titre du praticien
-   🏥 Spécialité du médecin
-   📋 Motif de la consultation
-   📝 Notes éventuelles
-   Recommandations (arriver 10 min à l'avance, apporter carte vitale, etc.)

### 2. Email de Récapitulatif (Recap)

**Quand:** Envoyé automatiquement quand le rendez-vous passe au statut **COMPLETED**  
**Destinataire:** Patient  
**Objet:** `Récapitulatif : Rendez-vous avec Dr [Nom du médecin]`

**Contenu:**

-   Récapitulatif de la consultation passée
-   Détails du rendez-vous (date, heure, praticien)
-   📋 Motif et notes de consultation
-   ⚠️ Prochaines étapes (suivi des recommandations, prise de médicaments, etc.)
-   Message de remerciement

---

## 🏗️ Architecture

### Fichiers créés

```
server/src/services/email/
├── EmailService.ts         # Service principal d'envoi d'emails
└── IEmailService.ts        # Interface TypeScript
```

### Structure du service

```typescript
class EmailService implements IEmailService {
    // Méthodes publiques
    sendAppointmentReminder(data: AppointmentEmailData): Promise<void>;
    sendAppointmentRecap(data: AppointmentEmailData): Promise<void>;

    // Méthodes privées (génération de contenu)
    generateReminderEmailHTML(data: AppointmentEmailData): string;
    generateReminderEmailText(data: AppointmentEmailData): string;
    generateRecapEmailHTML(data: AppointmentEmailData): string;
    generateRecapEmailText(data: AppointmentEmailData): string;
}
```

---

## 🔗 Intégration

### AppointmentService

Le service d'envoi d'emails a été intégré dans `AppointmentService.ts`:

#### Lors de la création d'un rendez-vous

```typescript
async createAppointment(data: any) {
    // ... création du rendez-vous ...

    // Envoi automatique de l'email de rappel
    await emailService.sendAppointmentReminder({
        patientName: `${patient.firstName} ${patient.surname}`,
        patientEmail: patient.email,
        doctorName: `${doctor.firstName} ${doctor.surname}`,
        doctorTitle: doctor.title ?? undefined,
        doctorSpecialization: doctor.specialization ?? undefined,
        appointmentDate: this.formatDateForResponse(appointment.date),
        appointmentTime: appointment.time,
        reason: appointment.reason,
        notes: appointment.notes ?? undefined,
    });

    return appointment;
}
```

#### Lors de la mise à jour au statut COMPLETED

```typescript
async updateAppointment(id: string, data: any) {
    // ... mise à jour du rendez-vous ...

    // Envoi de l'email récapitulatif si statut = COMPLETED
    if (data.status === "COMPLETED") {
        await emailService.sendAppointmentRecap({
            // ... données du rendez-vous ...
        });
    }

    return updatedAppointment;
}
```

---

## ⚙️ Configuration

### Variables d'environnement

Le service utilise la clé API Resend configurée dans `.env`:

```env
RESEND_API=re_K4PJVCM6_KmYyiSMdRvTRYG6kM5DbAxnE
```

### Configuration de l'expéditeur

Par défaut, l'email est envoyé depuis:

```typescript
private readonly fromEmail = "onboarding@resend.dev";
```

⚠️ **Important:** Pour la production, vous devez:

1. Vérifier votre domaine dans Resend
2. Mettre à jour `fromEmail` avec votre adresse email vérifiée

---

## 📝 Interface TypeScript

```typescript
export interface AppointmentEmailData {
    patientName: string; // Nom complet du patient
    patientEmail: string; // Email du patient
    doctorName: string; // Nom complet du médecin
    doctorTitle?: string; // Titre (Dr., Pr., etc.)
    doctorSpecialization?: string; // Spécialité du médecin
    appointmentDate: string; // Date (format: dd-MM-yyyy)
    appointmentTime: string; // Heure (format: HH:mm)
    reason: string; // Motif de consultation
    notes?: string; // Notes supplémentaires
}
```

---

## 🎨 Design des emails

### Caractéristiques visuelles

#### Email de Rappel (Reminder)

-   **Couleur primaire:** Bleu (#2563eb)
-   **Icône:** 🩺
-   **Style:** Professionnel et informatif

#### Email de Récapitulatif (Recap)

-   **Couleur primaire:** Vert (#10b981)
-   **Icône:** ✅
-   **Style:** Remerciement et suivi

### Responsive Design

-   Largeur maximale: 600px
-   Police: Segoe UI, sans-serif
-   Optimisé pour mobile et desktop
-   Versions HTML et texte brut

---

## 📊 Logging

Tous les envois d'emails sont loggés avec Winston:

### Succès

```
[2026-01-29T12:00:00.000Z] info: [SERVICE][EMAIL_SENT] Reminder email sent to patient@example.com - Email ID: abc123
```

### Erreur

```
[2026-01-29T12:00:00.000Z] error: [SERVICE][ERROR] Failed to send reminder email to patient@example.com: API error
```

### Log Operations ajoutées

```typescript
enum LogOperation {
    EMAIL_SENT = "EMAIL_SENT",
    EMAIL_FAILED = "EMAIL_FAILED",
}
```

---

## 🛡️ Gestion des erreurs

### Comportement non-bloquant

Les erreurs d'envoi d'emails **ne bloquent PAS** les opérations de rendez-vous:

```typescript
try {
    await resend.emails.send({...});
    logger.info("Email sent successfully");
} catch (error) {
    logger.error("Email failed");
    // ⚠️ Pas de throw - l'opération continue
}
```

**Raison:** Un échec d'envoi d'email ne doit pas empêcher la création/mise à jour du rendez-vous.

---

## 🧪 Tests

### Test manuel

1. **Créer un rendez-vous:**

```bash
POST /v1/appointments
{
    "appointedPatient": "patient-id",
    "appointedDoctor": "doctor-id",
    "date": "15-02-2026",
    "time": "10:30",
    "reason": "Consultation de routine"
}
```

2. **Vérifier l'email de rappel** dans la boîte mail du patient

3. **Marquer le rendez-vous comme complété:**

```bash
PUT /v1/appointments/:id
{
    "status": "COMPLETED"
}
```

4. **Vérifier l'email récapitulatif** dans la boîte mail du patient

### Vérifier les logs

```bash
# Voir les logs d'envoi d'emails
grep "EMAIL_SENT" logs/application.log
```

---

## 📋 TODO / Améliorations futures

### Court terme

-   [ ] Configurer un domaine vérifié dans Resend
-   [ ] Personnaliser l'adresse d'expéditeur
-   [ ] Ajouter le logo du cabinet dans les emails

### Moyen terme

-   [ ] Email de confirmation d'annulation de rendez-vous
-   [ ] Email de rappel automatique 24h avant le rendez-vous
-   [ ] Templates d'emails personnalisables par médecin
-   [ ] Support multilingue (français/anglais)

### Long terme

-   [ ] Notification par SMS via Twilio
-   [ ] Pièces jointes (ordonnances, résultats d'examens)
-   [ ] Calendrier ICS attaché aux emails
-   [ ] Statistiques d'ouverture des emails
-   [ ] Tests A/B sur les templates

---

## 📚 Ressources

-   [Documentation Resend](https://resend.com/docs)
-   [API Resend Node.js](https://resend.com/docs/send-with-nodejs)
-   [Best practices emails transactionnels](https://resend.com/docs/best-practices)

---

## 🔧 Dépannage

### L'email n'est pas envoyé

1. **Vérifier la clé API:**

```bash
echo $RESEND_API
```

2. **Vérifier les logs:**

```bash
grep "EMAIL" logs/application.log | tail -20
```

3. **Tester manuellement Resend:**

```typescript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API);
await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "test@example.com",
    subject: "Test",
    html: "<p>Test email</p>",
});
```

### Erreur "Domain not verified"

**Solution:** Vérifier votre domaine dans le dashboard Resend et utiliser une adresse email du domaine vérifié.

### Emails en spam

**Recommandations:**

-   Configurer SPF, DKIM et DMARC
-   Utiliser un domaine vérifié
-   Éviter les mots-clés spam
-   Inclure un lien de désinscription

---

## 👥 Support

Pour toute question sur le système d'emails:

1. Consulter cette documentation
2. Vérifier les logs de l'application
3. Consulter la documentation Resend
4. Contacter l'équipe de développement

---

**Dernière mise à jour:** 29 janvier 2026  
**Version:** 1.0.0  
**Statut:** ✅ Production Ready
