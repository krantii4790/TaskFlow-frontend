export default function Navigation({ activeTab, setActiveTab, darkMode }) {
  const tabs = ['dashboard', 'todos', 'timetable', 'history']

  return (
    <div className={`border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-6 flex gap-8">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-2 font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? `border-blue-500 ${darkMode ? 'text-white' : 'text-slate-900'}`
                : `border-transparent ${darkMode ? 'text-slate-500 hover:text-slate-400' : 'text-slate-500 hover:text-slate-600'}`
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
