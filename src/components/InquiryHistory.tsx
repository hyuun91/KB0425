import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { InquiryRecord } from '../types/inquiry';
import { Badge } from './Badge';
import { Download, RefreshCcw, Search } from 'lucide-react';

export const InquiryHistory: React.FC = () => {
  const [records, setRecords] = useState<InquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err: any) {
      console.error("조회 실패:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const downloadCSV = () => {
    if (records.length === 0) return;

    const headers = ["시간", "이름", "요약", "카테고리", "긴급도", "담당부서"];
    const rows = records.map(r => [
      new Date(r.created_at).toLocaleString(),
      r.customer_name,
      r.summary,
      r.category,
      r.urgency,
      r.department
    ]);

    const csvContent = [
      "\uFEFF" + headers.join(","), // UTF-8 BOM
      ...rows.map(e => e.map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kb_inquiry_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(r => 
    r.customer_name.includes(searchTerm) || 
    r.summary.includes(searchTerm) || 
    r.category.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-kb-gray">문의 내역 관리</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="검색 (이름, 요약, 카테고리)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-kb-yellow/50 focus:border-kb-yellow outline-none text-sm transition-all"
            />
          </div>
          <button
            onClick={fetchHistory}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="새로고침"
          >
            <RefreshCcw className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={downloadCSV}
            disabled={records.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-kb-gray text-white rounded-lg hover:bg-kb-gray/90 disabled:opacity-50 text-sm font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            CSV 다운로드
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-kb-gray">시간</th>
                <th className="px-6 py-4 font-bold text-kb-gray">이름</th>
                <th className="px-6 py-4 font-bold text-kb-gray">요약</th>
                <th className="px-6 py-4 font-bold text-kb-gray">카테고리</th>
                <th className="px-6 py-4 font-bold text-kb-gray">긴급도</th>
                <th className="px-6 py-4 font-bold text-kb-gray">담당부서</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4 h-12 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(record.created_at).toLocaleString('ko-KR', { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-kb-gray">{record.customer_name}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{record.summary}</td>
                    <td className="px-6 py-4">
                      <Badge>{record.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="urgency" level={record.urgency}>{record.urgency}</Badge>
                    </td>
                    <td className="px-6 py-4 text-kb-gray font-medium">{record.department}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
