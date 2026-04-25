import { GoogleGenerativeAI } from "@google/generative-ai";
import type { InquiryResult } from "../types/inquiry";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

if (!API_KEY) {
  console.warn("환경변수 VITE_GEMINI_API_KEY가 설정되지 않았습니다. 분류 기능이 작동하지 않습니다.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const classifyInquiry = async (inquiryText: string): Promise<InquiryResult> => {
  if (!API_KEY) {
    throw new Error("Gemini API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
KB금융그룹 고객 문의 자동 분류 시스템입니다.
아래 고객 문의 내용을 분석하여 JSON 형식으로 응답해주세요.

[분류 규칙]
카테고리: 보험금청구 / 계약변경 / 해지 / 상품문의 / 대출 / 카드 / 기타
긴급도:
- 높음: 사고, 분실, 도난, 긴급 의료, 해외 사고 등 즉시 처리 필요
- 보통: 일반 문의, 상품 가입, 변경 요청
- 낮음: 단순 확인, 정보 요청

담당부서:
- 보험금 관련 -> 보상심사팀
- 대출 관련 -> 여신심사팀
- 카드 분실/도난 -> 카드관리팀
- 적금/예금 -> 수신팀
- 그 외 일반 -> 고객지원팀

[고객 문의 내용]
"${inquiryText}"

응답은 아래 JSON 형식으로만. 마크다운 코드블록이나 설명 텍스트 없이 순수 JSON만 출력.

{
  "category": "카테고리",
  "urgency": "높음|보통|낮음",
  "summary": "한 줄 요약",
  "department": "담당부서",
  "script": "응대 스크립트"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // JSON 부분만 추출 (마크다운 코드 블록 등이 포함될 경우 대비)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    try {
      return JSON.parse(text) as InquiryResult;
    } catch (parseError) {
      console.error("JSON 파싱 실패:", text);
      throw new Error(`JSON 파싱 실패: ${text.substring(0, 200)}...`);
    }
  } catch (error) {
    console.error("Gemini API 호출 에러:", error);
    throw error;
  }
};
