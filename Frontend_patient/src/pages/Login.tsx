import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';
import { authService, type LoginCredentials } from '../services/authService';
import { usePatientStore } from '../store/patientStore';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';

export const Login = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { fetchPatient } = usePatientStore();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(credentials);
      authService.storeAuth(response.token, response.user);
      await fetchPatient(response.user.patientId);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de connexion';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.bg.primary }}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-8"
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
            <LogIn size={32} style={{ color: colors.text.primary }} />
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            Connexion
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Accédez à votre espace patient
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

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text.primary }}
            >
              Email
            </label>
            <Input
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              placeholder="votre.email@example.com"
              required
              icon={<Mail size={18} />}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text.primary }}
            >
              Mot de passe
            </label>
            <Input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="••••••••"
              required
              icon={<Lock size={18} />}
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
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: colors.border.default }}>
          <p className="text-sm mb-2" style={{ color: colors.text.secondary }}>
            Pas encore de compte ?
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: colors.primary }}
          >
            <UserPlus size={16} />
            Créer un compte
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t" style={{ borderColor: colors.border.default }}>
          <p className="text-sm text-center" style={{ color: colors.text.secondary }}>
            Compte de test :
            <br />
            <span className="font-mono text-xs mt-2 block">
              alice.dupont@example.com / password123
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

