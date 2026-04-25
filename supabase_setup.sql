-- 1. 기존 테이블 삭제 (초기화용)
DROP TABLE IF EXISTS inquiries CASCADE;

-- 2. 문의 내역 테이블 생성
CREATE TABLE inquiries (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at timestamptz DEFAULT now(),
    customer_name text NOT NULL,
    inquiry text NOT NULL,
    category text NOT NULL,
    urgency text NOT NULL,
    summary text NOT NULL,
    department text NOT NULL,
    script text NOT NULL
);

-- 3. RLS 설정 및 모든 사용자 허용 정책 (실습용)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 누구나 저장 가능하도록 설정
CREATE POLICY "Allow anon insert" ON inquiries FOR INSERT WITH CHECK (true);

-- 누구나 조회 가능하도록 설정
CREATE POLICY "Allow anon select" ON inquiries FOR SELECT USING (true);

-- 4. SQL Editor 실행 방법 안내
-- 이 파일의 내용을 복사하여 Supabase 대시보드의 'SQL Editor'에 붙여넣고 'Run' 버튼을 클릭하세요.
