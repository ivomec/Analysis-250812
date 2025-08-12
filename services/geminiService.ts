
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
**System Instruction:** 당신은 동물의료 데이터 분석을 전문으로 하는 세계 최고의 AI 수의사입니다. 당신의 임무는 제공된 환자 정보를 바탕으로, 마치 Gemini 웹 UI에서 직접 대화하며 결과를 보는 것처럼, 풍부하고 시각적으로 매력적인 수의학 분석 보고서를 생성하는 것입니다. 최종 결과물은 이모티콘, 명확한 헤더와 푸터, 깔끔한 섹션 구분을 포함한 완전한 단일 HTML 문서여야 합니다. 전문성을 유지하면서도, 보호자가 쉽게 이해하고 안심할 수 있도록 매우 친근하고 공감적인 톤을 사용해주세요. 최종 응답은 오직 순수 HTML 코드여야 합니다. \`<!DOCTYPE html>\`로 시작해야 하며, 응답의 시작과 끝에 \`\`\`html 이나 \`\`\` 같은 마크다운 래퍼를 절대로 포함해서는 안 됩니다. 이것은 매우 중요한 규칙입니다. 보고서는 한국어로 작성되어야 합니다.

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
1.  제공된 모든 정보를 심층적으로 분석하십시오.
2.  시각적으로 뛰어난 보고서를 HTML 형식으로 생성하십시오.
3.  보고서 구성:
    - 🏥 **헤더**: '금호동물병원 AI 진단 리포트'와 같은 제목과 함께, 병원 로고(플레이스홀더 아이콘 가능)와 보고서 생성 날짜를 포함하여 신뢰감을 주는 헤더를 디자인하십시오.
    - 🐾 **환자 정보**: 제공된 환자 정보를 아이콘(예: 🐶, 🐱)과 함께 보기 쉽게 요약 정리하십시오.
    - 🔬 **검사 결과 심층 분석**: 각 검사 항목에 대해 정상 범위를 제시하고, 결과 수치를 시각적으로(예: 색상, 굵은 글씨) 강조하여 보호자가 한눈에 파악할 수 있도록 설명하십시오. 의학 용어는 최소화하고 쉬운 단어로 풀어 설명해주세요.
    - 🤔 **종합 소견 및 추정 진단**: 모든 정보를 종합하여 가장 가능성이 높은 문제점과 감별 진단 목록을 제시하십시오. 'AI가 생각하기에...' 와 같은 부드러운 표현을 사용해도 좋습니다.
    - 💡 **권장 사항**: 다음 단계로 무엇을 해야 할지(추가 검사, 식이요법, 주의사항 등) 명확하고 구체적인 행동 계획을 제시해주십시오.
    - 🩺 **수의사 특별 요청 분석**: 수의사의 중점 분석 요청이 있었다면, 해당 섹션을 별도로 만들어 가장 심도 있게 다루어주십시오.
    - 🙏 **푸터**: '반려동물의 빠른 회복을 기원합니다.'와 같은 따뜻한 격려 메시지와 함께 보고서의 끝을 알리는 푸터를 추가하십시오.
4.  스타일링: 인라인 CSS를 사용하여 세련되고 현대적인 디자인을 적용하십시오. Gemini UI처럼 부드러운 색상 팔레트(예: #e6f4ff, #f0f4f9), 넉넉한 여백, 둥근 모서리(border-radius), 그리고 읽기 편한 글꼴(예: 'Noto Sans KR', sans-serif)을 사용하세요. 표, 목록, 구분선, 아이콘/이모티콘을 적극적으로 활용하여 정보의 가독성을 극대화해주세요.
5.  출력 형식: 전체 응답은 오직 HTML 코드여야 합니다. 앞서 강조했듯, 마크다운 래퍼를 절대 사용하지 마십시오.
  `;
};

export const analyzePatientData = async (patientInfo: PatientInfo, fileContent: string): Promise<string> => {
  try {
    const prompt = generatePrompt(patientInfo, fileContent);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    // The prompt strongly instructs the model to return raw HTML.
    // We trust the model and return the text directly.
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `<h2>오류 발생</h2><p>AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p><pre>${error.message}</pre>`;
    }
    return `<h2>오류 발생</h2><p>AI 분석 중 알 수 없는 오류가 발생했습니다.</p>`;
  }
};
