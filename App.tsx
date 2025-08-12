
import React, { useState, useCallback } from 'react';
import type { PatientInfo } from './types';
import { Species } from './types';
import { DOG_BREEDS } from './constants';
import PatientInfoForm from './components/PatientInfoForm';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import { analyzePatientData } from './services/geminiService';
import LoadingIcon from './components/LoadingIcon';

const App: React.FC = () => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    species: Species.DOG,
    breed: DOG_BREEDS[0],
    customBreed: '',
    name: '',
    ageYears: '',
    ageMonths: '',
    sex: '',
    isNeutered: false,
    testDate: new Date().toISOString().split('T')[0],
    specialNotes: '',
    vetNotes: '',
  });

  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult('');
    try {
      const result = await analyzePatientData(patientInfo, fileContent);
      // Gemini might return markdown ````html ... ```` block, so we need to clean it
      const cleanedResult = result.replace(/^```html\s*|```$/g, '').trim();
      setAnalysisResult(cleanedResult);
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('An unknown error occurred during analysis.');
        }
    } finally {
      setIsLoading(false);
    }
  }, [patientInfo, fileContent]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white shadow-md">
        <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.364 2.277l-1.364-1.364a1 1 0 00-1.414 0l-6.288 6.288a1 1 0 000 1.414l7.778 7.778a1 1 0 001.414 0l6.288-6.288a1 1 0 000-1.414l-6.414-6.414zM8 9a1 1 0 11-2 0 1 1 0 012 0z"/>
                <path d="M18 9a1 1 0 01-1 1h-5a1 1 0 110-2h5a1 1 0 011 1z"/>
            </svg>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">금호동물병원 AI 진료 보조 시스템</h1>
                <p className="text-sm text-slate-500">환자 정보와 검사 결과를 입력하여 AI 분석 보고서를 받아보세요.</p>
            </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <PatientInfoForm patientInfo={patientInfo} setPatientInfo={setPatientInfo} />
        
        <FileUpload onFileParsed={setFileContent} fileName={fileName} setFileName={setFileName} />

        <div className="mt-8 flex justify-center">
            <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full md:w-1/2 flex items-center justify-center px-8 py-4 bg-cyan-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-cyan-700 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50"
            >
                {isLoading ? (
                    <>
                        <LoadingIcon className="w-6 h-6 mr-3"/>
                        분석 중...
                    </>
                ) : "분석 시작"}
            </button>
        </div>

        <div className="mt-8">
            <AnalysisResult result={analysisResult} isLoading={isLoading} error={error} />
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Kumho Animal Hospital. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
