export type AssignmentTabId = 'active' | 'volunteers' | 'all' | 'completed' | 'rejected'

interface AssignmentTabsProps {
  activeTab: AssignmentTabId
  counts: {
    active: number
    volunteers?: number
    all: number
    completed: number
    rejected: number
  }
  showVolunteersTab?: boolean
  onSelectTab: (tab: AssignmentTabId) => void
}

export function AssignmentTabs({
  activeTab,
  counts,
  showVolunteersTab = false,
  onSelectTab,
}: AssignmentTabsProps) {
  const tabs: { id: AssignmentTabId; label: string; count: number }[] = [
    { id: 'active', label: 'Tugas Aktif', count: counts.active },
    ...(showVolunteersTab
      ? [{ id: 'volunteers' as AssignmentTabId, label: 'Daftar Relawan', count: counts.volunteers ?? 0 }]
      : []),
    { id: 'all', label: 'Semua', count: counts.all },
    { id: 'completed', label: 'Selesai', count: counts.completed },
    { id: 'rejected', label: 'Ditolak', count: counts.rejected },
  ]

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-200/60 max-w-fit overflow-x-auto scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSelectTab(tab.id)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === tab.id
              ? 'bg-white text-neutral-900 shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <span>{tab.label}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === tab.id
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-300 text-neutral-700'
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  )
}
