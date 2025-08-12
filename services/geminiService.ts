
import { GoogleGenAI } from "@google/genai";
import type { PatientInfo } from '../types';

if (!process.env.API_KEY) {
  // In a real app, this would be handled more gracefully.
  // For this environment, we assume the key is set.
  console.warn("API_KEY environment variable not set. Using a placeholder which will likely fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "FAKE_API_KEY" });

const generatePrompt = (patientInfo: PatientInfo, fileContent: string): string => {
  const breed = patientInfo.breed === '직접 입력' ? patientInfo.customBreed : patientInfo.breed;
  const neuteredStatus = patientInfo.isNeutered ? '중성화 완료' : '중성화 안함';

  return `
**System Instruction:** 당신은 동물의 환자 데이터 분석을 전문으로 하는 뛰어난 AI 수의사입니다. 당신의 임무는 제공된 환자 정보를 바탕으로, 마치 Gemini 웹 UI에서 직접 생성한 것처럼 풍부하고 시각적으로 매력적인 수의학 분석 보고서를 생성하는 것입니다. 최종 결과물은 이모티콘, 명확한 헤더와 푸터, 깔끔한 레이아웃을 포함한 완전한 단일 HTML 문서여야 합니다. 전문성을 유지하면서도 보호자가 이해하기 쉽도록 친근한 톤을 사용해주세요. 최종 응답은 \`<!DOCTYPE html>\`로 시작하는 순수 HTML 코드여야 하며, 다른 설명이나 마크다운 래퍼(\`\`\`html)를 포함해서는 안 됩니다. 보고서는 한국어로 작성되어야 합니다.

**환자 정보:**
- 종: ${patientInfo.species}
- 품종: ${breed || '정보 없음'}
- 이름: ${patientInfo.name || '정보 없음'}
- 나이: ${patientInfo.ageYears || '0'}살 ${patientInfo.ageMonths || '0'}개월
- 성별: ${patientInfo.sex || '정보 없음'}, ${neuteredStatus}
- 검사 날짜: ${patientInfo.testDate}
- 특이사항: ${patientInfo.specialNotes || '특이사항 없음'}
- 수의사 소견 (중점 분석 요청): ${patientInfo.vetNotes || '요청사항 없음'}

**검사 결과 (엑셀 파일에서 추출):**
\`\`\`
${fileContent || '업로드된 검사 결과 없음'}
\`\`\`

**지시사항:**
1. 제공된 모든 정보를 심층적으로 분석하십시오.
2. 시각적으로 뛰어난 보고서를 HTML 형식으로 생성하십시오.
3. 보고서 구성:
    - 🏥 병원 정보와 보고서 날짜를 포함한 멋진 헤더.
    - 🐾 환자 정보 요약 (아이콘 사용 권장).
    - 🔬 검사 결과에 대한 상세하고 이해하기 쉬운 해석.
    - 🤔 가능한 진단 또는 감별 진단 목록.
    - 💡 추가 검사 또는 치료에 대한 명확한 권장 사항.
    - 🩺 수의사의 중점 분석 요청이 있는 경우, 해당 내용을 특별히 강조하여 분석.
    - 🙏 보고서를 마무리하는 친근한 푸터 메시지.
4. 스타일링: 인라인 CSS를 사용하여 현대적이고 깔끔한 디자인(예: 부드러운 색상, 적절한 여백, 읽기 쉬운 글꼴)을 적용하십시오. 표, 목록, 아이콘/이모티콘을 적극적으로 활용하여 정보 전달력을 높여주세요.
5. 출력 형식: 전체 응답은 오직 HTML 코드여야 합니다.
  `;
};

export const analyzePatientData = async (patientInfo: PatientInfo, fileContent: string): Promise<string> => {
  try {
    const prompt = generatePrompt(patientInfo, fileContent);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    // The response is expected to be raw HTML, so we just return it.
    // We trim to remove any potential leading/trailing whitespace.
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `<h2>오류 발생</h2><p>AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p><pre>${error.message}</pre>`;
    }
    return `<h2>오류 발생</h2><p>AI 분석 중 알 수 없는 오류가 발생했습니다.</p>`;
  }
};
