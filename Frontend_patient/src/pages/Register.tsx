import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, Calendar, MapPin } from 'lucide-react';
import { authService, type RegisterCredentials } from '../services/authService';
import { usePatientStore } from '../store/patientStore';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';

export const Register = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { fetchPatient } = usePatientStore();
  const [formData, setFormData] = useState<RegisterCredentials>({
    firstName: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    address: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);
      authService.storeAuth(response.token, response.user);
      await fetchPatient(response.user.patientId);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-8"
      style={{ backgroundColor: colors.bg.primary }}
    >
      <div
        className="w-full max-w-2xl rounded-lg shadow-lg p-8"
        style={{
          backgroundColor: colors.bg.card,
          borderColor: colors.border.default,
          borderWidth: '1px',
        }}
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: colors.bg.secondary }}
          >
            <UserPlus size={32} style={{ color: colors.text.primary }} />
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            Créer un compte
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Inscrivez-vous pour prendre rendez-vous
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{
                backgroundColor: colors.error + '20',
                color: colors.error,
              }}
            >
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Prénom *
              </label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Jean"
                required
                icon={<User size={18} />}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Nom *
              </label>
              <Input
                type="text"
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
                placeholder="Dupont"
                required
                icon={<User size={18} />}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text.primary }}
            >
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="votre.email@example.com"
              required
              icon={<Mail size={18} />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Mot de passe *
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                required
                icon={<Lock size={18} />}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Confirmer le mot de passe *
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                icon={<Lock size={18} />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Téléphone
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="06 12 34 56 78"
                icon={<Phone size={18} />}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Date de naissance
              </label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                icon={<Calendar size={18} />}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text.primary }}
            >
              Adresse
            </label>
            <Input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="123 Rue de la Paix, 75001 Paris"
              icon={<MapPin size={18} />}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            style={{
              backgroundColor: colors.primary,
              color: '#fff',
            }}
          >
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: colors.border.default }}>
          <p className="text-sm mb-2" style={{ color: colors.text.secondary }}>
            Déjà un compte ?
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: colors.primary }}
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

