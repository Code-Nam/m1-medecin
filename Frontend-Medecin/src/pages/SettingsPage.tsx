import React from 'react';
import { User, Bell, Shield, Palette, Clock, Save } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { useTheme } from '../hooks/useTheme';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';

export const SettingsPage: React.FC = () => {
  const { doctor } = useAuthStore();
  const { darkMode, toggleDarkMode, addToast } = useUIStore();
  const { colors } = useTheme();

  const handleSave = () => {
    addToast('success', 'Paramètres enregistrés');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Paramètres
        </h2>
        <p 
          className="text-sm"
          style={{ color: colors.text.secondary }}
        >
          Configurez votre compte et vos préférences
        </p>
      </div>

      {/* Profile Section */}
      <section 
        className="rounded-xl shadow-sm border p-6"
        style={{
          backgroundColor: colors.bg.card,
          borderColor: colors.border.default
        }}
      >
        <h2 
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: colors.text.primary }}
        >
          <User className="w-5 h-5 text-cyan-600" />
          Profil
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom"
            value={doctor?.Surname || ''}
            readOnly
            aria-label="Nom du médecin"
          />
          <Input
            label="Prénom"
            value={doctor?.FirstName || ''}
            readOnly
            aria-label="Prénom du médecin"
          />
          <Input
            label="Spécialisation"
            value={doctor?.specialization || ''}
            readOnly
            aria-label="Spécialisation du médecin"
          />
          <Input
            label="Email"
            type="email"
            value={doctor?.email || ''}
            readOnly
            aria-label="Email du médecin"
          />
          <Input
            label="Téléphone"
            type="tel"
            value={doctor?.phone || ''}
            readOnly
            aria-label="Téléphone du médecin"
          />
        </div>
      </section>

      {/* Appearance Section */}
      <section 
        className="rounded-xl shadow-sm border p-6"
        style={{
          backgroundColor: colors.bg.card,
          borderColor: colors.border.default
        }}
      >
        <h2 
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: colors.text.primary }}
        >
          <Palette className="w-5 h-5 text-cyan-600" />
          Apparence
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" style={{ color: colors.text.primary }}>Mode sombre</p>
              <p className="text-sm" style={{ color: colors.text.muted }}>
                Basculer entre le thème clair et sombre
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="relative w-14 h-7 rounded-full transition-colors duration-200"
              style={{
                backgroundColor: darkMode ? '#0891B2' : '#D1D5DB'
              }}
              role="switch"
              aria-checked={darkMode}
              aria-label="Activer le mode sombre"
            >
              <span
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                style={{
                  left: darkMode ? '2rem' : '0.25rem'
                }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section 
        className="rounded-xl shadow-sm border p-6"
        style={{
          backgroundColor: colors.bg.card,
          borderColor: colors.border.default
        }}
      >
        <h2 
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: colors.text.primary }}
        >
          <Bell className="w-5 h-5 text-cyan-600" />
          Notifications
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium" style={{ color: colors.text.primary }}>Nouveaux rendez-vous</p>
              <p className="text-sm" style={{ color: colors.text.muted }}>
                Recevoir une notification pour chaque nouvelle demande de RDV
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium" style={{ color: colors.text.primary }}>Rappels de RDV</p>
              <p className="text-sm" style={{ color: colors.text.muted }}>
                Recevoir un rappel 1h avant chaque rendez-vous
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium" style={{ color: colors.text.primary }}>Annulations</p>
              <p className="text-sm" style={{ color: colors.text.muted }}>
                Être notifié quand un patient annule
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
            />
          </label>
        </div>
      </section>

      {/* Working hours Section */}
      <section 
        className="rounded-xl shadow-sm border p-6"
        style={{
          backgroundColor: colors.bg.card,
          borderColor: colors.border.default
        }}
      >
        <h2 
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: colors.text.primary }}
        >
          <Clock className="w-5 h-5 text-cyan-600" />
          Horaires de travail
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Début de journée"
            type="time"
            defaultValue="08:00"
            aria-label="Heure de début de journée"
          />
          <Input
            label="Fin de journée"
            type="time"
            defaultValue="19:00"
            aria-label="Heure de fin de journée"
          />
          <Input
            label="Durée d'un créneau (minutes)"
            type="number"
            defaultValue="30"
            min="15"
            max="120"
            step="15"
            aria-label="Durée d'un créneau de rendez-vous"
          />
        </div>
      </section>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSave}
          aria-label="Enregistrer les paramètres"
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;

