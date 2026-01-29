# Backend Server - M1 Medecin

Backend complet pour la gestion de rendez-vous médicaux avec support multi-praticien et gestion des secrétaires.

## Fonctionnalités

- **Authentification JWT** pour patients, médecins et secrétaires
- **Gestion des patients** (CRUD complet)
- **Gestion des médecins** (CRUD complet)
- **Gestion des rendez-vous** (CRUD complet)
- **Gestion des cabinets** (clinics) avec support multi-praticien
- **Gestion des secrétaires** pouvant gérer plusieurs cabinets
- **Pagination** sur toutes les listes
- **Validation** des données avec Zod
- **Gestion d'erreurs** centralisée

## Prérequis

- Node.js 18+ ou Bun
- PostgreSQL
- Variables d'environnement configurées (voir `.env.example`)

## Installation

```bash
# Installer les dépendances
bun install

# Configurer la base de données
# Créer un fichier .env avec les variables nécessaires
cp .env.example .env

# Générer le client Prisma
bun run db:generate

# Créer/mettre à jour la base de données
bun run db:push

# Ou utiliser les migrations
bun run db:migrate
```

## Configuration

Créer un fichier `.env` à la racine du dossier `server` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/m1_medecin?schema=public"
HTTP_PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

## Démarrage

```bash
# Mode développement
bun run dev

# Mode production
bun run start
```

## Structure de l'API

### Base URL
`http://localhost:3000/v1`

### Endpoints

#### Authentification
- `POST /v1/auth/patients/login` - Connexion patient
- `POST /v1/auth/doctors/login` - Connexion médecin
- `POST /v1/auth/secretaries/login` - Connexion secrétaire

#### Patients
- `GET /v1/patients` - Liste des patients (avec pagination)
- `GET /v1/patients/:patientId` - Détails d'un patient
- `POST /v1/patients` - Créer un patient
- `PUT /v1/patients/:patientId` - Mettre à jour un patient
- `DELETE /v1/patients/:patientId` - Supprimer un patient

#### Médecins
- `GET /v1/doctors` - Liste des médecins (avec pagination)
- `GET /v1/doctors/:doctorId` - Détails d'un médecin
- `POST /v1/doctors` - Créer un médecin
- `PUT /v1/doctors/:doctorId` - Mettre à jour un médecin
- `DELETE /v1/doctors/:doctorId` - Supprimer un médecin

#### Rendez-vous
- `GET /v1/appointments/:id` - Récupérer les rendez-vous (patient ou médecin)
- `POST /v1/appointments` - Créer un rendez-vous
- `PUT /v1/appointments/:appointmentId` - Mettre à jour un rendez-vous
- `DELETE /v1/appointments/:appointmentId` - Supprimer un rendez-vous

#### Cabinets
- `GET /v1/clinics` - Liste des cabinets
- `GET /v1/clinics/:clinicId` - Détails d'un cabinet
- `POST /v1/clinics` - Créer un cabinet
- `PUT /v1/clinics/:clinicId` - Mettre à jour un cabinet
- `DELETE /v1/clinics/:clinicId` - Supprimer un cabinet

#### Secrétaires
- `GET /v1/secretaries` - Liste des secrétaires
- `GET /v1/secretaries/:secretaryId` - Détails d'un secrétaire
- `POST /v1/secretaries` - Créer un secrétaire
- `PUT /v1/secretaries/:secretaryId` - Mettre à jour un secrétaire
- `DELETE /v1/secretaries/:secretaryId` - Supprimer un secrétaire
- `POST /v1/secretaries/:secretaryId/clinics` - Ajouter un secrétaire à un cabinet
- `DELETE /v1/secretaries/:secretaryId/clinics/:clinicId` - Retirer un secrétaire d'un cabinet

## Authentification

Tous les endpoints (sauf login et création) nécessitent un token JWT dans le header :

```
Authorization: Bearer <token>
```

## Multi-praticien et Secrétaires

- **Cabinets** : Un cabinet peut avoir plusieurs médecins
- **Secrétaires** : Un secrétaire peut gérer plusieurs cabinets
- **Médecins** : Un médecin peut être associé à un cabinet
- **Gestion autonome** : Les cabinets peuvent se gérer seuls sans secrétaire

## Base de données

Le schéma Prisma est défini dans `prisma/schema.prisma`. Pour visualiser la base de données :

```bash
bun run db:studio
```
## To Do

- [ ] Tests unitaires et d'intégration
- [x] Séparer routes du fichier app
- [ ] Documentation Swagger
- [ ] email de confirmation prise de rendez-vous
- [ ] email de rappel de rendez-vous
- [x] Refactorisation architecture
- [ ] Ajouter collection Bruno
- [ ] Support i18n
- [ ] Lint & formatage du code
- [x] Data Access Layer à ajouter pour isoler Prisma du reste de l'application
- [ ] JSDoc pour documenter les fonctions et classes
- [ ] Typesafe API sur les controllers
- [x] Replace logger with winston
- [x] Appliquer le logger sur l'ensemble du projet
- [ ] Rate limiting pour prévenir les abus
- [ ] Sécurité renforcée (Helmet, CSP, etc.)
- [ ] Monitoring et alerting
- [x] Erreurs personnalisées pour la gestion des exceptions
