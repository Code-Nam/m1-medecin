import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';

interface AppointmentsPerDayChartProps {
  data: Array<{
    day: string;
    appointments: number;
  }>;
}

export const AppointmentsPerDayChart: React.FC<AppointmentsPerDayChartProps> = ({ data }) => {
  const { darkMode, colors } = useTheme();

  return (
    <div 
      className="rounded-xl shadow-sm border p-5"
      style={{
        backgroundColor: colors.bg.card,
        borderColor: colors.border.default
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
        Rendez-vous par jour (7 derniers jours)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
            <XAxis
              dataKey="day"
              tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: darkMode ? '#374151' : '#E5E7EB' }}
            />
            <YAxis
              tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: darkMode ? '#374151' : '#E5E7EB' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                borderRadius: '8px',
                color: darkMode ? '#FFFFFF' : '#1F2937'
              }}
            />
            <Bar
              dataKey="appointments"
              name="Rendez-vous"
              fill={darkMode ? '#4DB6AC' : '#43A78B'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface ReasonsChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

// Palette IIM
const COLORS_LIGHT = ['#43A78B', '#FFE082', '#E63946', '#FFD54F', '#4DB6AC']; /* Couleur secondaire, Accentuation 1, Accentuation 2, Jaune clair, Teal clair */
const COLORS_DARK = ['#4DB6AC', '#FFD54F', '#EF5350', '#FFC107', '#26A69A']; /* Teal clair, Jaune clair, Rouge clair, Jaune, Teal moyen */

export const ReasonsChart: React.FC<ReasonsChartProps> = ({ data }) => {
  const { darkMode, colors } = useTheme();
  const COLORS = darkMode ? COLORS_DARK : COLORS_LIGHT;

  return (
    <div 
      className="rounded-xl shadow-sm border p-5"
      style={{
        backgroundColor: colors.bg.card,
        borderColor: colors.border.default
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
        Motifs de consultation (Top 5)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={{ stroke: darkMode ? '#9CA3AF' : '#6B7280' }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                borderRadius: '8px',
                color: darkMode ? '#FFFFFF' : '#1F2937'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface PresenceRateChartProps {
  data: Array<{
    day: string;
    rate: number;
  }>;
}

export const PresenceRateChart: React.FC<PresenceRateChartProps> = ({ data }) => {
  const { darkMode, colors } = useTheme();

  return (
    <div 
      className="rounded-xl shadow-sm border p-5"
      style={{
        backgroundColor: colors.bg.card,
        borderColor: colors.border.default
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
        Taux de présence (7 derniers jours)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
            <XAxis
              dataKey="day"
              tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: darkMode ? '#374151' : '#E5E7EB' }}
            />
            <YAxis
              tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: darkMode ? '#374151' : '#E5E7EB' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                borderRadius: '8px',
                color: darkMode ? '#FFFFFF' : '#1F2937'
              }}
              formatter={(value: number) => [`${value}%`, 'Taux de présence']}
            />
            <Line
              type="monotone"
              dataKey="rate"
              name="Taux de présence"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default { AppointmentsPerDayChart, ReasonsChart, PresenceRateChart };

