
import React, { useMemo } from 'react';
import { AnalysisResult, Category, AnalysisItem } from '../types';
import { CATEGORY_DETAILS } from '../constants';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultCard: React.FC<{ item: AnalysisItem }> = ({ item }) => {
    const details = CATEGORY_DETAILS[item.category];
    return (
        <div className={`border-l-4 ${details.color} ${details.background} p-4 rounded-r-lg mb-4 shadow-lg`}>
            <h3 className="text-xl font-bold text-white">{item.dishName}</h3>
            <p className="text-gray-300 mt-2">{item.reasoning}</p>
            {item.suggestion && (
                <p className="text-amber-300 mt-2 font-semibold bg-black/20 p-2 rounded-md">
                    Javaslat: {item.suggestion}
                </p>
            )}
        </div>
    );
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
    const groupedResults = useMemo(() => {
        const groups: Record<Category, AnalysisItem[]> = {
            top: [],
            recommended: [],
            interesting: [],
            caution: [],
            avoid: [],
        };
        result.analysis.forEach(item => {
            if (groups[item.category]) {
                groups[item.category].push(item);
            }
        });
        return groups;
    }, [result]);

    const orderedCategories: Category[] = ['top', 'recommended', 'interesting', 'caution', 'avoid'];

  return (
    <div className="p-4 bg-gray-900 min-h-full">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-400">Gastro Master Ajánlása</h1>
            <p className="text-gray-300 mt-2">Pi személyes étlap elemzése</p>
        </div>
        
        {orderedCategories.map(categoryKey => {
            const items = groupedResults[categoryKey];
            const details = CATEGORY_DETAILS[categoryKey];
            if (items.length === 0) return null;

            return (
                <div key={categoryKey} className="mb-8">
                    <h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${details.color.replace('border', 'text')}`}>
                        <span className="text-3xl">{details.icon}</span>
                        {details.title}
                    </h2>
                    {items.map((item, index) => (
                        <ResultCard key={`${categoryKey}-${index}`} item={item} />
                    ))}
                </div>
            );
        })}

        <div className="mt-12 text-center">
            <button 
                onClick={onReset}
                className="bg-amber-500 text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-amber-400 transition-colors transform hover:scale-105 text-lg"
            >
                Új Étlap Elemzése
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
