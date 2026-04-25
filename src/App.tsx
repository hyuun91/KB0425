import { useState } from 'react'
import { Tabs } from './components/Tabs'
import { InquiryForm } from './components/InquiryForm'
import { InquiryHistory } from './components/InquiryHistory'
import { Layout } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState<'input' | 'history'>('input')

  return (
    <div className="min-h-screen bg-kb-light-gray">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-kb-yellow rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5 text-kb-gray" />
            </div>
            <h1 className="text-lg font-bold text-kb-gray">
              KB금융그룹 <span className="font-normal text-gray-400 ml-1">고객 문의 자동 분류 시스템</span>
            </h1>
          </div>
          <div className="text-xs font-bold px-2 py-1 bg-kb-yellow text-kb-gray rounded uppercase tracking-tighter">
            Gemini 3 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'input' ? (
          <InquiryForm />
        ) : (
          <InquiryHistory />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 text-center border-t border-gray-200 mt-12">
        <p className="text-sm text-gray-400">
          &copy; 2026 KB Financial Group Customer AI Lab. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default App
