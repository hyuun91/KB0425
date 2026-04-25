# KB금융그룹 고객 문의 자동 분류 시스템

Gemini 3 Flash AI를 활용하여 고객 문의를 자동으로 분류하고 Supabase에 저장하는 웹 애플리케이션입니다.

## 🚀 시작하기

### 1. 필수 조건
- Node.js (v18 이상 권장)
- npm

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일이 이미 생성되어 있습니다. 필요에 따라 수정 가능합니다:
- `VITE_GEMINI_API_KEY`: Gemini API 키
- `VITE_SUPABASE_URL`: Supabase URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase Publishable Key

### 4. Supabase 데이터베이스 설정
1. Supabase 대시보드의 **SQL Editor**로 이동합니다.
2. 프로젝트 루트에 있는 [supabase_setup.sql](./supabase_setup.sql) 파일의 내용을 복사하여 붙여넣습니다.
3. **Run**을 클릭하여 `inquiries` 테이블을 생성합니다.

### 5. 로컬 실행
```bash
npm run dev
```

## 🛠 기술 스택
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **AI**: Google Gemini 3 Flash (@google/genai)
- **Backend/DB**: Supabase (@supabase/supabase-js)
- **Icons**: Lucide React

## 📄 라이선스
Copyright © 2026 KB Financial Group Customer AI Lab.
