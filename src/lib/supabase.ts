import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase 환경변수가 설정되지 않았습니다. 내역 조회 및 저장 기능이 작동하지 않습니다.");
}

// URL이 비어있어도 클라이언트 생성 시 에러가 나지 않도록 처리
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null as any;
