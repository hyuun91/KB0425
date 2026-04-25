export type Category = '보험금청구' | '계약변경' | '해지' | '상품문의' | '대출' | '카드' | '기타';
export type Urgency = '높음' | '보통' | '낮음';

export interface InquiryResult {
  category: Category;
  urgency: Urgency;
  summary: string;
  department: string;
  script: string;
}

export interface InquiryRecord extends InquiryResult {
  id: number;
  created_at: string;
  customer_name: string;
  inquiry: string;
}
