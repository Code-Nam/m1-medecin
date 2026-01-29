# Email Templates Preview

## 1. Appointment Reminder Email (Rappel)

### Subject Line

```
Rappel : Rendez-vous avec Dr Robert Smith
```

### Visual Preview

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ╔══════════════════════════════════════════════════╗ │
│  ║         🩺 Rappel de Rendez-vous                 ║ │
│  ║              (Blue Header)                        ║ │
│  ╚══════════════════════════════════════════════════╝ │
│                                                        │
│  Bonjour John Doe,                                    │
│                                                        │
│  Ceci est un rappel concernant votre rendez-vous     │
│  médical à venir.                                     │
│                                                        │
│  ┌────────────────────────────────────────────────┐  │
│  │ 📅 Date :        15-02-2026                    │  │
│  │ 🕐 Heure :       10:30                         │  │
│  │ 👨‍⚕️ Praticien :  Dr Robert Smith              │  │
│  │ 🏥 Spécialité :  Cardiology                    │  │
│  │ 📋 Motif :       Consultation de routine       │  │
│  │ 📝 Notes :       Apporter résultats analyses   │  │
│  └────────────────────────────────────────────────┘  │
│                                                        │
│  Recommandations :                                    │
│  • Veuillez arriver 10 minutes avant l'heure         │
│  • N'oubliez pas d'apporter votre carte vitale       │
│  • Apportez vos ordonnances et résultats récents     │
│                                                        │
│  Si vous ne pouvez pas vous présenter, merci de      │
│  nous prévenir au plus tôt.                           │
│                                                        │
│  ────────────────────────────────────────────────     │
│  Cet email est un rappel automatique.                │
│  © 2026 M1 Médecin - Tous droits réservés            │
└────────────────────────────────────────────────────────┘
```

### Color Scheme

-   **Header:** Blue (#2563eb)
-   **Info Box:** Light blue background (#f0f9ff)
-   **Labels:** Dark blue (#1e40af)

---

## 2. Appointment Recap Email (Récapitulatif)

### Subject Line

```
Récapitulatif : Rendez-vous avec Dr Robert Smith
```

### Visual Preview

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ╔══════════════════════════════════════════════════╗ │
│  ║      ✅ Récapitulatif de Rendez-vous             ║ │
│  ║             (Green Header)                        ║ │
│  ╚══════════════════════════════════════════════════╝ │
│                                                        │
│  Bonjour John Doe,                                    │
│                                                        │
│  Nous vous remercions d'avoir consulté. Voici le     │
│  récapitulatif de votre rendez-vous :                 │
│                                                        │
│  ┌────────────────────────────────────────────────┐  │
│  │ 📅 Date :        15-02-2026                    │  │
│  │ 🕐 Heure :       10:30                         │  │
│  │ 👨‍⚕️ Praticien :  Dr Robert Smith              │  │
│  │ 🏥 Spécialité :  Cardiology                    │  │
│  │ 📋 Motif :       Consultation de routine       │  │
│  │ 📝 Notes :       Contrôle satisfaisant         │  │
│  └────────────────────────────────────────────────┘  │
│                                                        │
│  ┌────────────────────────────────────────────────┐  │
│  │ ⚠️ Prochaines étapes :                         │  │
│  │                                                 │  │
│  │ • Suivez les recommandations de votre médecin  │  │
│  │ • Prenez vos médicaments selon l'ordonnance    │  │
│  │ • N'hésitez pas à recontacter le cabinet       │  │
│  │ • Prenez RDV pour prochain contrôle si besoin  │  │
│  └────────────────────────────────────────────────┘  │
│                                                        │
│  Nous espérons que votre consultation s'est bien     │
│  déroulée. Nous restons à votre disposition.          │
│                                                        │
│  Prenez soin de vous !                                │
│                                                        │
│  ────────────────────────────────────────────────     │
│  Cet email est un récapitulatif automatique.         │
│  © 2026 M1 Médecin - Tous droits réservés            │
└────────────────────────────────────────────────────────┘
```

### Color Scheme

-   **Header:** Green (#10b981)
-   **Info Box:** Light green background (#f0fdf4)
-   **Labels:** Dark green (#047857)
-   **Warning Box:** Yellow background (#fef3c7)

---

## Email Features

### Design Elements

✅ **Professional Medical Theme**

-   Clean, modern design
-   Medical-related emojis (🩺, 👨‍⚕️, 📅, 🕐)
-   Easy-to-read typography
-   Clear information hierarchy

✅ **Responsive Layout**

-   Maximum width: 600px
-   Adapts to mobile screens
-   Readable on all devices

✅ **Visual Indicators**

-   Color-coded by type (Blue = Reminder, Green = Recap)
-   Boxed sections for easy scanning
-   Icon-based labels for quick identification

✅ **Accessibility**

-   High contrast text
-   Clear structure
-   Plain text fallback version

---

## Technical Implementation

### HTML Version

```html
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />
        <style>
            /* Inline CSS for email compatibility */
            body {
                font-family: "Segoe UI", sans-serif;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
            }
            .header {
                background-color: #2563eb;
                color: white;
            }
            .info-box {
                border-left: 4px solid #2563eb;
            }
        </style>
    </head>
    <body>
        <!-- Email content -->
    </body>
</html>
```

### Plain Text Version

```
Rappel de Rendez-vous
=====================

Bonjour John Doe,

Détails du rendez-vous :
------------------------
Date : 15-02-2026
Heure : 10:30
Praticien : Dr Robert Smith
...
```

---

## Email Flow

```
┌─────────────────────────────────────────────────────┐
│  Patient Books Appointment                          │
│  ↓                                                   │
│  POST /v1/appointments                              │
│  ↓                                                   │
│  AppointmentService.createAppointment()             │
│  ↓                                                   │
│  EmailService.sendAppointmentReminder()             │
│  ↓                                                   │
│  Resend API Call                                    │
│  ↓                                                   │
│  📧 Reminder Email Sent                             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Doctor Marks Appointment as COMPLETED              │
│  ↓                                                   │
│  PUT /v1/appointments/:id { status: "COMPLETED" }   │
│  ↓                                                   │
│  AppointmentService.updateAppointment()             │
│  ↓                                                   │
│  EmailService.sendAppointmentRecap()                │
│  ↓                                                   │
│  Resend API Call                                    │
│  ↓                                                   │
│  📧 Recap Email Sent                                │
└─────────────────────────────────────────────────────┘
```

---

## Sample Data Structure

```typescript
{
    patientName: "John Doe",
    patientEmail: "john.doe@example.com",
    doctorName: "Robert Smith",
    doctorTitle: "Dr.",
    doctorSpecialization: "Cardiology",
    appointmentDate: "15-02-2026",
    appointmentTime: "10:30",
    reason: "Consultation de routine",
    notes: "Apporter résultats d'analyses"
}
```

---

**Note:** The actual HTML emails include full styling, proper spacing, and are optimized for various email clients (Gmail, Outlook, Apple Mail, etc.)
