
import React, { useMemo } from 'react';
import type { PatientInfo } from '../types';
import { Species } from '../types';
import { DOG_BREEDS, CAT_BREEDS } from '../constants';

interface PatientInfoFormProps {
  patientInfo: PatientInfo;
  setPatientInfo: React.Dispatch<React.SetStateAction<PatientInfo>>;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({ patientInfo, setPatientInfo }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setPatientInfo(prev => ({ ...prev, [name]: checked }));
    } else {
        setPatientInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const breeds = useMemo(() => {
    return patientInfo.species === Species.DOG ? DOG_BREEDS : CAT_BREEDS;
  }, [patientInfo.species]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-3">환자 정보 입력</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* 종 */}
        <div>
          <label htmlFor="species" className="block text-sm font-medium text-slate-700 mb-1">종</label>
          <select id="species" name="species" value={patientInfo.species} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
            <option value={Species.DOG}>개</option>
            <option value={Species.CAT}>고양이</option>
          </select>
        </div>
        
        {/* 품종 */}
        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-slate-700 mb-1">품종</label>
          <select id="breed" name="breed" value={patientInfo.breed} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
            {breeds.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* 직접 입력 품종 */}
        {patientInfo.breed === '직접 입력' && (
           <div className="md:col-span-2">
             <label htmlFor="customBreed" className="block text-sm font-medium text-slate-700 mb-1">품종 직접 입력</label>
             <input type="text" id="customBreed" name="customBreed" value={patientInfo.customBreed} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="품종명을 입력하세요"/>
           </div>
        )}

        {/* 환자 이름 */}
        <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">환자 이름</label>
            <input type="text" id="name" name="name" value={patientInfo.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="환자 이름"/>
        </div>
        
        {/* 나이 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">나이</label>
          <div className="flex items-center gap-2">
            <input type="number" name="ageYears" value={patientInfo.ageYears} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="--"/>
            <span className="text-slate-600">살</span>
            <input type="number" name="ageMonths" value={patientInfo.ageMonths} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="--"/>
            <span className="text-slate-600">개월</span>
          </div>
        </div>
        
        {/* 성별 및 중성화 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">성별 / 중성화 여부</label>
          <div className="flex items-center gap-4 h-full">
            <select name="sex" value={patientInfo.sex} onChange={handleChange} className="w-1/2 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="">선택</option>
                <option value="수">수</option>
                <option value="암">암</option>
            </select>
            <div className="flex items-center">
                <input id="isNeutered" name="isNeutered" type="checkbox" checked={patientInfo.isNeutered} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"/>
                <label htmlFor="isNeutered" className="ml-2 block text-sm text-gray-900">중성화</label>
            </div>
          </div>
        </div>
        
        {/* 검사 날짜 */}
        <div>
          <label htmlFor="testDate" className="block text-sm font-medium text-slate-700 mb-1">검사 날짜</label>
          <input type="date" id="testDate" name="testDate" value={patientInfo.testDate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
        </div>

        {/* 특이사항 */}
        <div className="md:col-span-2">
          <label htmlFor="specialNotes" className="block text-sm font-medium text-slate-700 mb-1">특이사항 (증상, 검사 이유 등)</label>
          <textarea id="specialNotes" name="specialNotes" value={patientInfo.specialNotes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="환자의 현재 증상이나 검사를 요청한 이유를 기입해주세요."></textarea>
        </div>

        {/* 수의사 소견 */}
        <div className="md:col-span-2">
          <label htmlFor="vetNotes" className="block text-sm font-medium text-slate-700 mb-1">수의사 소견 (중점 분석 요청)</label>
          <textarea id="vetNotes" name="vetNotes" value={patientInfo.vetNotes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="AI가 특히 중점적으로 분석해야 할 부분을 기입해주세요."></textarea>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoForm;
