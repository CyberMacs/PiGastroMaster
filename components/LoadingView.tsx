
import React from 'react';
import ChefHatIcon from './icons/ChefHatIcon';

const LoadingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-800/50 backdrop-blur-sm">
      <ChefHatIcon className="w-24 h-24 text-amber-400 animate-pulse" />
      <h2 className="text-2xl font-bold mt-4 text-white">Étlap elemzése...</h2>
      <p className="text-gray-300 mt-2">Pillanat, a Gastro Master már dolgozik!</p>
    </div>
  );
};

export default LoadingView;
