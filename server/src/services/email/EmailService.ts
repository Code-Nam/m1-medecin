import { Resend } from "resend";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
import type { IEmailService, AppointmentEmailData } from "./IEmailService";

const resend = new Resend(process.env.RESEND_API);

export class EmailService implements IEmailService {
    private readonly fromEmail = "onboarding@resend.dev"; // Change to your verified domain

    /**
     * Send appointment reminder email (before appointment)
     */
    async sendAppointmentReminder(data: AppointmentEmailData): Promise<void> {
        try {
            const subject = `Rappel : Rendez-vous avec ${
                data.doctorTitle || "Dr"
            } ${data.doctorName}`;
            const htmlContent = this.generateReminderEmailHTML(data);
            const textContent = this.generateReminderEmailText(data);

            const result = await resend.emails.send({
                from: this.fromEmail,
                to: data.patientEmail,
                subject: subject,
                html: htmlContent,
                text: textContent,
            });

            logger.info(
                formatLogMessage(
                    LogLayer.SERVICE,
                    LogOperation.EMAIL_SENT,
                    `Reminder email sent to ${data.patientEmail} - Email ID: ${result.data?.id}`
                )
            );
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.SERVICE,
                    LogOperation.ERROR,
                    `Failed to send reminder email to ${data.patientEmail}: ${error.message}`
                )
            );
            // Don't throw error to prevent blocking appointment operations
        }
    }

    /**
     * Send appointment recap email (after appointment)
     */
    async sendAppointmentRecap(data: AppointmentEmailData): Promise<void> {
        try {
            const subject = `Récapitulatif : Rendez-vous avec ${
                data.doctorTitle || "Dr"
            } ${data.doctorName}`;
            const htmlContent = this.generateRecapEmailHTML(data);
            const textContent = this.generateRecapEmailText(data);

            const result = await resend.emails.send({
                from: this.fromEmail,
                to: data.patientEmail,
                subject: subject,
                html: htmlContent,
                text: textContent,
            });

            logger.info(
                formatLogMessage(
                    LogLayer.SERVICE,
                    LogOperation.EMAIL_SENT,
                    `Recap email sent to ${data.patientEmail} - Email ID: ${result.data?.id}`
                )
            );
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.SERVICE,
                    LogOperation.ERROR,
                    `Failed to send recap email to ${data.patientEmail}: ${error.message}`
                )
            );
            // Don't throw error to prevent blocking appointment operations
        }
    }

    /**
     * Generate HTML content for reminder email
     */
    private generateReminderEmailHTML(data: AppointmentEmailData): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rappel de rendez-vous</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #2563eb;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 20px -30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px 0;
        }
        .info-box {
            background-color: #f0f9ff;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-row {
            margin: 10px 0;
            display: flex;
            align-items: flex-start;
        }
        .info-label {
            font-weight: bold;
            color: #1e40af;
            min-width: 140px;
        }
        .info-value {
            color: #333;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }
        .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🩺 Rappel de Rendez-vous</h1>
        </div>
        
        <div class="content">
            <p>Bonjour <strong>${data.patientName}</strong>,</p>
            
            <p>Ceci est un rappel concernant votre rendez-vous médical à venir.</p>
            
            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">📅 Date :</span>
                    <span class="info-value">${data.appointmentDate}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">🕐 Heure :</span>
                    <span class="info-value">${data.appointmentTime}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">👨‍⚕️ Praticien :</span>
                    <span class="info-value">${data.doctorTitle || "Dr"} ${
            data.doctorName
        }</span>
                </div>
                ${
                    data.doctorSpecialization
                        ? `
                <div class="info-row">
                    <span class="info-label">🏥 Spécialité :</span>
                    <span class="info-value">${data.doctorSpecialization}</span>
                </div>
                `
                        : ""
                }
                <div class="info-row">
                    <span class="info-label">📋 Motif :</span>
                    <span class="info-value">${data.reason}</span>
                </div>
                ${
                    data.notes
                        ? `
                <div class="info-row">
                    <span class="info-label">📝 Notes :</span>
                    <span class="info-value">${data.notes}</span>
                </div>
                `
                        : ""
                }
            </div>
            
            <p><strong>Recommandations :</strong></p>
            <ul>
                <li>Veuillez arriver 10 minutes avant l'heure de votre rendez-vous</li>
                <li>N'oubliez pas d'apporter votre carte vitale et votre mutuelle</li>
                <li>Apportez vos ordonnances et résultats d'examens récents</li>
            </ul>
            
            <p>Si vous ne pouvez pas vous présenter à ce rendez-vous, merci de nous prévenir au plus tôt.</p>
        </div>
        
        <div class="footer">
            <p>Cet email est un rappel automatique. Merci de ne pas répondre directement à ce message.</p>
            <p>© ${new Date().getFullYear()} M1 Médecin - Tous droits réservés</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Generate plain text content for reminder email
     */
    private generateReminderEmailText(data: AppointmentEmailData): string {
        return `
Rappel de Rendez-vous
=====================

Bonjour ${data.patientName},

Ceci est un rappel concernant votre rendez-vous médical à venir.

Détails du rendez-vous :
------------------------
Date : ${data.appointmentDate}
Heure : ${data.appointmentTime}
Praticien : ${data.doctorTitle || "Dr"} ${data.doctorName}
${data.doctorSpecialization ? `Spécialité : ${data.doctorSpecialization}` : ""}
Motif : ${data.reason}
${data.notes ? `Notes : ${data.notes}` : ""}

Recommandations :
-----------------
- Veuillez arriver 10 minutes avant l'heure de votre rendez-vous
- N'oubliez pas d'apporter votre carte vitale et votre mutuelle
- Apportez vos ordonnances et résultats d'examens récents

Si vous ne pouvez pas vous présenter à ce rendez-vous, merci de nous prévenir au plus tôt.

---
Cet email est un rappel automatique. Merci de ne pas répondre directement à ce message.
© ${new Date().getFullYear()} M1 Médecin - Tous droits réservés
        `;
    }

    /**
     * Generate HTML content for recap email
     */
    private generateRecapEmailHTML(data: AppointmentEmailData): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Récapitulatif de rendez-vous</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #10b981;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 20px -30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px 0;
        }
        .info-box {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-row {
            margin: 10px 0;
            display: flex;
            align-items: flex-start;
        }
        .info-label {
            font-weight: bold;
            color: #047857;
            min-width: 140px;
        }
        .info-value {
            color: #333;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }
        .next-steps {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Récapitulatif de Rendez-vous</h1>
        </div>
        
        <div class="content">
            <p>Bonjour <strong>${data.patientName}</strong>,</p>
            
            <p>Nous vous remercions d'avoir consulté. Voici le récapitulatif de votre rendez-vous :</p>
            
            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">📅 Date :</span>
                    <span class="info-value">${data.appointmentDate}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">🕐 Heure :</span>
                    <span class="info-value">${data.appointmentTime}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">👨‍⚕️ Praticien :</span>
                    <span class="info-value">${data.doctorTitle || "Dr"} ${
            data.doctorName
        }</span>
                </div>
                ${
                    data.doctorSpecialization
                        ? `
                <div class="info-row">
                    <span class="info-label">🏥 Spécialité :</span>
                    <span class="info-value">${data.doctorSpecialization}</span>
                </div>
                `
                        : ""
                }
                <div class="info-row">
                    <span class="info-label">📋 Motif :</span>
                    <span class="info-value">${data.reason}</span>
                </div>
                ${
                    data.notes
                        ? `
                <div class="info-row">
                    <span class="info-label">📝 Notes :</span>
                    <span class="info-value">${data.notes}</span>
                </div>
                `
                        : ""
                }
            </div>
            
            <div class="next-steps">
                <p><strong>⚠️ Prochaines étapes :</strong></p>
                <ul>
                    <li>Suivez les recommandations de votre médecin</li>
                    <li>Prenez vos médicaments prescrits selon l'ordonnance</li>
                    <li>N'hésitez pas à recontacter le cabinet en cas de questions</li>
                    <li>Prenez rendez-vous pour votre prochain contrôle si nécessaire</li>
                </ul>
            </div>
            
            <p>Nous espérons que votre consultation s'est bien déroulée. Nous restons à votre disposition pour toute question.</p>
            
            <p>Prenez soin de vous !</p>
        </div>
        
        <div class="footer">
            <p>Cet email est un récapitulatif automatique. Merci de ne pas répondre directement à ce message.</p>
            <p>© ${new Date().getFullYear()} M1 Médecin - Tous droits réservés</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Generate plain text content for recap email
     */
    private generateRecapEmailText(data: AppointmentEmailData): string {
        return `
Récapitulatif de Rendez-vous
============================

Bonjour ${data.patientName},

Nous vous remercions d'avoir consulté. Voici le récapitulatif de votre rendez-vous :

Détails du rendez-vous :
------------------------
Date : ${data.appointmentDate}
Heure : ${data.appointmentTime}
Praticien : ${data.doctorTitle || "Dr"} ${data.doctorName}
${data.doctorSpecialization ? `Spécialité : ${data.doctorSpecialization}` : ""}
Motif : ${data.reason}
${data.notes ? `Notes : ${data.notes}` : ""}

Prochaines étapes :
------------------
- Suivez les recommandations de votre médecin
- Prenez vos médicaments prescrits selon l'ordonnance
- N'hésitez pas à recontacter le cabinet en cas de questions
- Prenez rendez-vous pour votre prochain contrôle si nécessaire

Nous espérons que votre consultation s'est bien déroulée. Nous restons à votre disposition pour toute question.

Prenez soin de vous !

---
Cet email est un récapitulatif automatique. Merci de ne pas répondre directement à ce message.
© ${new Date().getFullYear()} M1 Médecin - Tous droits réservés
        `;
    }
}

export const emailService = new EmailService();
