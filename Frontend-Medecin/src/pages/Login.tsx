import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, User, Building2 } from 'lucide-react';
import { authService, type LoginCredentials } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';

export const Login = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { login } = useAuthStore();
  const [userType, setUserType] = useState<'doctor' | 'secretary'>('doctor');
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
      let response: any;
      if (userType === 'doctor') {
        response = await authService.loginDoctor(credentials);
      } else {
        response = await authService.loginSecretary(credentials);
      }

      authService.storeAuth(response.token, response.user);
      login(response.user);
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
            {userType === 'doctor' ? 'Médecin' : 'Secrétaire'}
          </p>
        </div>

        <div className="mb-6 flex gap-2" role="group" aria-label="Type d'utilisateur pour la connexion">
          <button
            type="button"
            onClick={() => setUserType('doctor')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${userType === 'doctor'
              ? ''
              : 'opacity-50'
              }`}
            style={{
              backgroundColor:
                userType === 'doctor'
                  ? colors.bg.secondary
                  : colors.bg.primary,
              color: colors.text.primary,
            }}
            aria-pressed={userType === 'doctor'}
            aria-label="Se connecter en tant que médecin"
          >
            <User size={16} className="inline mr-2" aria-hidden="true" />
            Médecin
          </button>
          <button
            type="button"
            onClick={() => setUserType('secretary')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${userType === 'secretary'
              ? ''
              : 'opacity-50'
              }`}
            style={{
              backgroundColor:
                userType === 'secretary'
                  ? colors.bg.secondary
                  : colors.bg.primary,
              color: colors.text.primary,
            }}
            aria-pressed={userType === 'secretary'}
            aria-label="Se connecter en tant que secrétaire"
          >
            <Building2 size={16} className="inline mr-2" aria-hidden="true" />
            Secrétaire
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{
                backgroundColor: (colors as any).error + '20',
                color: (colors as any).error,
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
              // @ts-ignore
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
              // @ts-ignore
              icon={<Lock size={18} />}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            style={{
              backgroundColor: (colors as any).primary,
              color: '#fff',
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t" style={{ borderColor: colors.border.default }}>
          <p className="text-sm text-center" style={{ color: colors.text.secondary }}>
            Comptes de test :
            <br />
            <span className="font-mono text-xs mt-2 block">
              {userType === 'doctor' ? (
                <>
                  Médecin: jean.martin@example.com / password123
                  <br />
                  Médecin seul: pierre.bernard@example.com / password123
                </>
              ) : (
                <>
                  Secrétaire multi-cabinet: julie.moreau@example.com / password123
                </>
              )}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

