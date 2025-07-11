
import React, { useState, useCallback } from 'react';
import { ViewMode, AnalysisResult } from './types';
import { analyzeMenu } from './services/geminiService';
import CameraView from './components/CameraView';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingView from './components/LoadingView';
import ChefHatIcon from './components/icons/ChefHatIcon';
import CameraIcon from './components/icons/CameraIcon';
import RetryIcon from './components/icons/RetryIcon';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Welcome);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = useCallback(async (imageData: string) => {
    setViewMode(ViewMode.Loading);
    setError(null);
    try {
      const result = await analyzeMenu(imageData);
      if(result && result.analysis && result.analysis.length > 0) {
        setAnalysisResult(result);
        setViewMode(ViewMode.Results);
      } else {
        setError("Nem sikerült ételeket találni az étlapon. Próbálj meg egy tisztább képet készíteni.");
        setViewMode(ViewMode.Error);
      }
    } catch (e: any) {
      setError(e.message || "Ismeretlen hiba történt.");
      setViewMode(ViewMode.Error);
    }
  }, []);

  const handleReset = useCallback(() => {
    setViewMode(ViewMode.Welcome);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.Welcome:
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 h-full">
            <ChefHatIcon className="w-32 h-32 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold mt-4">Gastro Master</h1>
            <p className="text-lg text-gray-300 mt-2 max-w-md">
              Személyes ételpreferenciáid alapján elemzem az étlapokat.
            </p>
            <button
              onClick={() => setViewMode(ViewMode.Camera)}
              className="mt-12 flex items-center gap-3 bg-amber-500 text-gray-900 font-bold py-4 px-8 rounded-full hover:bg-amber-400 transition-colors transform hover:scale-105 text-xl"
            >
              <CameraIcon className="w-6 h-6" />
              Étlap Beolvasása
            </button>
          </div>
        );
      case ViewMode.Camera:
        return <CameraView onCapture={handleCapture} onCancel={handleReset} />;
      case ViewMode.Loading:
        return <LoadingView />;
      case ViewMode.Results:
        return analysisResult ? (
          <ResultsDisplay result={analysisResult} onReset={handleReset} />
        ) : null;
      case ViewMode.Error:
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                <h2 className="text-3xl font-bold text-red-500">Hoppá! Hiba történt.</h2>
                <p className="text-gray-300 mt-2 max-w-md">{error}</p>
                 <button
                    onClick={() => setViewMode(ViewMode.Camera)}
                    className="mt-8 flex items-center gap-3 bg-gray-600 text-white font-bold py-3 px-6 rounded-full hover:bg-gray-500 transition-colors"
                    >
                    <RetryIcon className="w-5 h-5"/>
                    Újrapróbálkozás
                </button>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-white overflow-y-auto">
        <div className="mx-auto w-full h-full max-w-4xl">
           {renderContent()}
        </div>
    </div>
  );
};

export default App;
