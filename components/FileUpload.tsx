
import React, { useRef, useState, useCallback } from 'react';

declare var XLSX: any;

interface FileUploadProps {
  onFileParsed: (content: string) => void;
  setFileName: (name: string) => void;
  fileName: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileParsed, setFileName, fileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const processFile = useCallback((file: File) => {
    if (!file) {
      return;
    }

    // Check for excel file types
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
        setError("엑셀 파일(.xlsx, .xls)만 업로드할 수 있습니다.");
        onFileParsed('');
        setFileName('');
        return;
    }

    setError(null);
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        let fullContent = '';
        workbook.SheetNames.forEach((sheetName: string) => {
          const worksheet = workbook.Sheets[sheetName];
          const csvData = XLSX.utils.sheet_to_csv(worksheet);
          fullContent += `--- ${sheetName} ---\n${csvData}\n\n`;
        });
        onFileParsed(fullContent.trim());
      } catch (err) {
        console.error("Error parsing Excel file:", err);
        setError("파일을 읽는 중 오류가 발생했습니다. 파일이 손상되지 않았는지 확인해주세요.");
        onFileParsed('');
        setFileName('');
      }
    };

    reader.onerror = () => {
        setError("파일을 읽는 데 실패했습니다.");
        onFileParsed('');
        setFileName('');
    }

    reader.readAsBinaryString(file);
  }, [onFileParsed, setFileName]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset file input to allow re-uploading the same file
    event.target.value = '';
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
          processFile(files[0]);
      }
  };

  return (
     <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-3">검사 결과 업로드</h2>
        <div className="flex flex-col items-center justify-center w-full">
            <div 
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-cyan-500 bg-cyan-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                onClick={handleButtonClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                    <svg className="w-10 h-10 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">클릭하여 파일 선택</span> 또는 파일을 끌어다 놓으세요</p>
                    <p className="text-xs text-slate-500">엑셀 파일 (.xlsx, .xls)</p>
                </div>
                <input ref={fileInputRef} id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".xlsx, .xls"/>
            </div>
            {fileName && <p className="mt-4 text-sm text-green-600 font-medium">선택된 파일: {fileName}</p>}
            {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}
        </div>
    </div>
  );
};

export default FileUpload;
