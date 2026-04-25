import React, { useState } from 'react';
import { classifyInquiry } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import type { InquiryResult } from '../types/inquiry';
import { Badge } from './Badge';
import { Loader2, Send, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const InquiryForm: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !inquiry) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsSaved(false);

    try {
      const classification = await classifyInquiry(inquiry);
      setResult(classification);
    } catch (err: any) {
      setError(err.message || "분류 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !customerName || !inquiry) return;

    try {
      const { error: saveError } = await supabase
        .from('inquiries')
        .insert([{
          customer_name: customerName,
          inquiry: inquiry,
          category: result.category,
          urgency: result.urgency,
          summary: result.summary,
          department: result.department,
          script: result.script
        }]);

      if (saveError) throw saveError;
      setIsSaved(true);
      // 저장 후 필드 초기화 (선택 사항)
      // setCustomerName('');
      // setInquiry('');
    } catch (err: any) {
      alert("저장 실패: " + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleClassify} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-xl font-bold text-kb-gray">문의 입력</h2>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">고객 이름</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kb-yellow/50 focus:border-kb-yellow outline-none transition-all"
            placeholder="이름을 입력하세요"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">문의 내용</label>
          <textarea
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kb-yellow/50 focus:border-kb-yellow outline-none transition-all min-h-[150px]"
            placeholder="상세 문의 내용을 입력하세요"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !customerName || !inquiry}
          className="w-full bg-kb-yellow text-kb-gray font-bold py-4 rounded-xl hover:bg-kb-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              분류하기
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="text-sm break-all">
            <p className="font-bold mb-1">에러 발생</p>
            {error}
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-kb-yellow/30 space-y-6 animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-kb-gray">분류 결과</h3>
            <div className="flex gap-2">
              <Badge>{result.category}</Badge>
              <Badge variant="urgency" level={result.urgency}>{result.urgency}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">한 줄 요약</p>
              <p className="text-gray-900 font-medium">{result.summary}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">담당 부서</p>
              <p className="text-kb-gray font-bold">{result.department}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-gray-700">
            <p className="text-xs text-gray-400 mb-2 not-italic font-bold">응대 스크립트</p>
            "{result.script}"
          </div>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isSaved 
                ? 'bg-green-100 text-green-700 cursor-default' 
                : 'bg-kb-gray text-white hover:bg-kb-gray/90'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                저장 완료
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Supabase에 저장하기
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
