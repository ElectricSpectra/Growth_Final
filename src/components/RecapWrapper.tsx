import React from 'react';
import MonthlyGrowthRecap from './MonthlyGrowthRecap';

function RecapWrapper() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold glow-sm mb-2">Monthly Growth Recap</h1>
        <p className="text-white/60">Review your holistic growth journey this month</p>
      </div>
      <MonthlyGrowthRecap />
    </div>
  );
}

export default RecapWrapper;