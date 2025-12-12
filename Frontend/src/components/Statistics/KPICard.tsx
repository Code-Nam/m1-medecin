import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'cyan' | 'green' | 'yellow' | 'red' | 'purple';
  suffix?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'cyan',
  suffix
}) => {
  const { colors, darkMode } = useTheme();
  
  const colorClasses = {
    cyan: darkMode ? 'from-[#4DB6AC] to-[#26A69A]' : 'from-[#43A78B] to-[#2E7D6B]', /* Couleur secondaire (teal) - Palette IIM */
    green: darkMode ? 'from-[#4DB6AC] to-[#26A69A]' : 'from-[#43A78B] to-[#2E7D6B]', /* Success - Palette IIM */
    yellow: darkMode ? 'from-[#FFD54F] to-[#FFC107]' : 'from-[#FFE082] to-[#FFC107]', /* Accentuation 1 (jaune) - Palette IIM */
    red: 'from-red-500 to-rose-600',
    purple: 'from-purple-500 to-indigo-600'
  };

  const bgColorMap = {
    cyan: { light: 'rgba(67, 167, 139, 0.1)', dark: 'rgba(77, 182, 172, 0.2)' }, /* Couleur secondaire (teal) - Palette IIM */
    green: { light: 'rgba(67, 167, 139, 0.1)', dark: 'rgba(77, 182, 172, 0.2)' }, /* Success - Palette IIM */
    yellow: { light: 'rgba(255, 224, 130, 0.2)', dark: 'rgba(255, 213, 79, 0.2)' }, /* Accentuation 1 (jaune) - Palette IIM */
    red: { light: 'rgba(230, 57, 70, 0.1)', dark: 'rgba(239, 83, 80, 0.2)' }, /* Accentuation 2 (rouge) - Palette IIM */
    purple: { light: '#FAF5FF', dark: 'rgba(139, 92, 246, 0.2)' }
  };

  return (
    <div 
      className="rounded-xl shadow-sm border p-5 transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: colors.bg.card,
        borderColor: colors.border.default
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p 
            className="text-sm font-medium"
            style={{ color: colors.text.muted }}
          >
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span 
              className="text-3xl font-bold"
              style={{ color: colors.text.primary }}
            >
              {value}
            </span>
            {suffix && (
              <span 
                className="text-lg font-medium"
                style={{ color: colors.text.muted }}
              >
                {suffix}
              </span>
            )}
          </div>
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.value === 0 ? (
                <Minus className="w-4 h-4" />
              ) : trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(trend.value)}%</span>
              <span className="ml-1" style={{ color: colors.text.muted }}>
                vs semaine dernière
              </span>
            </div>
          )}
        </div>
        <div 
          className="p-3 rounded-xl"
          style={{ backgroundColor: darkMode ? bgColorMap[color].dark : bgColorMap[color].light }}
        >
          <div className={`w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICard;

