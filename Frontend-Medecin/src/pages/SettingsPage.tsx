import React from 'react';
import { User, Bell, Shield, Palette, Clock, Save } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { useTheme } from '../hooks/useTheme';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { darkMode, toggleDarkMode, addToast } = useUIStore();
  const { colors } = useTheme();

  const [profileData, setProfileData] = React.useState({
    firstName: '',
    surname: '',
    specialization: '',
    email: '',
    phone: '',
    openingTime: '08:00',
    closingTime: '19:00',
    slotDuration: 30,
  });

  React.useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        surname: user.surname || '',
        specialization: user.specialization || '',
        email: user.email || '',
        phone: user.phone || '',
        openingTime: user.openingTime || '08:00',
        closingTime: user.closingTime || '19:00',
        slotDuration: user.slotDuration || 30,
      });
    }
  }, [user]);

  const [isSaving, setIsSaving] = React.useState(false);

  const handleProfileChange = (field: string, value: string | number) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { doctorsService, secretariesService } = await import('../services/api');
      const { authService } = await import('../services/authService');

      let updatedUser;
      if (user.role === 'DOCTOR') {
        updatedUser = await doctorsService.update(user.id, profileData);
      } else {
        updatedUser = await secretariesService.update(user.id, profileData);
      }

      // Update local storage and store
      const fullUser = { ...user, ...(updatedUser as any) };
      authService.storeAuth(localStorage.getItem('token') || '', fullUser);
      useAuthStore.getState().login(fullUser);

      addToast('success', 'Paramètres enregistrés avec succès');
    } catch (error: any) {
      addToast('error', error.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setIsSaving(false);
    }
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
            value={profileData.surname}
            onChange={(e) => handleProfileChange('surname', e.target.value)}
            aria-label="Nom du médecin"
          />
          <Input
            label="Prénom"
            value={profileData.firstName}
            onChange={(e) => handleProfileChange('firstName', e.target.value)}
            aria-label="Prénom du médecin"
          />
          {user?.role === 'DOCTOR' && (
            <Input
              label="Spécialisation"
              value={profileData.specialization}
              onChange={(e) => handleProfileChange('specialization', e.target.value)}
              aria-label="Spécialisation du médecin"
            />
          )}
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            aria-label="Email du médecin"
          />
          <Input
            label="Téléphone"
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            aria-label="Téléphone du médecin"
            placeholder="06..."
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
          <div className="flex items-center justify-between">
            <label htmlFor="notif-new" className="flex-1 cursor-pointer">
              <p className="font-medium" style={{ color: colors.text.primary }}>Nouveaux rendez-vous</p>
              <p className="text-sm" style={{ color: colors.text.muted }}>
                Recevoir une notification pour chaque nouvelle demande de RDV
              </p>
            </label>
            <input
              id="notif-new"
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              aria-label="Recevoir des notifications pour les nouveaux rendez-vous"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="notif-reminders" className="flex-1 cursor-pointer">
              <p className="font-medium" style={{ color: colors.text.primary }}>Rappels de RDV</p>
              <p className="text-sm" style={{ color: colors.text.muted }}>
                Recevoir un rappel 1h avant chaque rendez-vous
              </p>
            </label>
            <input
              id="notif-reminders"
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              aria-label="Recevoir des rappels de rendez-vous"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="notif-cancel" className="flex-1 cursor-pointer">
              <p className="font-medium" style={{ color: colors.text.primary }}>Annulations</p>
              <p className="text-sm" style={{ color: colors.text.muted }}>
                Être notifié quand un patient annule
              </p>
            </label>
            <input
              id="notif-cancel"
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              aria-label="Recevoir des notifications en cas d'annulation"
            />
          </div>
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
            value={profileData.openingTime}
            onChange={(e) => handleProfileChange('openingTime', e.target.value)}
            aria-label="Heure de début de journée"
          />
          <Input
            label="Fin de journée"
            type="time"
            value={profileData.closingTime}
            onChange={(e) => handleProfileChange('closingTime', e.target.value)}
            aria-label="Heure de fin de journée"
          />
          <Input
            label="Durée d'un créneau (minutes)"
            type="number"
            value={profileData.slotDuration}
            onChange={(e) => handleProfileChange('slotDuration', parseInt(e.target.value))}
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
          isLoading={isSaving}
          aria-label="Enregistrer les paramètres"
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;

