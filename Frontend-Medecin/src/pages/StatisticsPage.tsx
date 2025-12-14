import React from 'react';
import { StatsBoard } from '../components/Statistics/StatsBoard';

export const StatisticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <StatsBoard />
    </div>
  );
};

export default StatisticsPage;

