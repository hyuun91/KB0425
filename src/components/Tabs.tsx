import React from 'react';

interface TabsProps {
  activeTab: 'input' | 'history';
  onTabChange: (tab: 'input' | 'history') => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200 mb-8">
      <button
        onClick={() => onTabChange('input')}
        className={`px-6 py-3 font-medium text-sm transition-colors relative ${
          activeTab === 'input' 
            ? 'text-kb-gray' 
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        문의 입력
        {activeTab === 'input' && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-kb-yellow" />
        )}
      </button>
      <button
        onClick={() => onTabChange('history')}
        className={`px-6 py-3 font-medium text-sm transition-colors relative ${
          activeTab === 'history' 
            ? 'text-kb-gray' 
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        문의 내역
        {activeTab === 'history' && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-kb-yellow" />
        )}
      </button>
    </div>
  );
};
