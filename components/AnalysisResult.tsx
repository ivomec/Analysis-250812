
import React, { useRef } from 'react';
import LoadingIcon from './LoadingIcon';

declare var html2canvas: any;

interface AnalysisResultProps {
  result: string;
  isLoading: boolean;
  error: string | null;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, isLoading, error }) => {
  const resultRef = useRef<HTMLDivElement>(null);

  const downloadHTML = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ai_vet_report.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadImage = () => {
    if (!resultRef.current) return;
    html2canvas(resultRef.current, {
        useCORS: true,
        scale: 2 // Higher scale for better resolution
    }).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'ai_vet_report.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 mt-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-3">AI 분석 결과</h2>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-10 text-center">
            <LoadingIcon className="w-12 h-12 text-cyan-600" />
            <p className="mt-4 text-lg font-semibold text-slate-700">AI가 분석 중입니다...</p>
            <p className="text-sm text-slate-500">잠시만 기다려주세요. 결과 생성에 몇 분 정도 소요될 수 있습니다.</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-bold text-red-800">오류</h3>
            <p className="text-red-700">{error}</p>
        </div>
      )}

      {!isLoading && !error && result && (
        <div>
          <div className="flex justify-end gap-3 mb-4">
            <button
              onClick={downloadHTML}
              className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition-all"
            >
              HTML로 다운로드
            </button>
            <button
              onClick={downloadImage}
              className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-75 transition-all"
            >
              이미지로 다운로드
            </button>
          </div>
          <div 
            ref={resultRef}
            className="prose prose-sm sm:prose-base max-w-none p-4 border border-slate-200 rounded-lg bg-slate-50"
            dangerouslySetInnerHTML={{ __html: result }} 
          />
        </div>
      )}

      {!isLoading && !error && !result && (
        <div className="text-center py-10">
          <p className="text-slate-500">환자 정보와 검사 결과 파일을 업로드한 후 '분석 시작' 버튼을 눌러주세요.</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
