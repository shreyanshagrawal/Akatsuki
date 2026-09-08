import { useMemo, useRef, useState } from 'react'
import { Bell, FolderOpen, Network, Plus, Search, Shield, Siren } from 'lucide-react'
import { CaseDirectory } from './CaseDirectory'
import { DashboardSidebar } from './DashboardSidebar'
import { alertSeed } from '../dashboardData'

const filterChips = ['All Cases', 'High Risk Only', 'Active', 'Cold', 'Closed']

export function PortalDashboard({ onSignOut, onCreateCase, onEditCase, onSelectCase, onGraph, onIntel, onAlerts, cases, justAddedId }) {
  const activeCount = cases.filter((item) => item.status === 'Active').length
  const updatedTodayCount = cases.filter((item) => item.updated.startsWith('Today')).length
  const metrics = [
    { label: 'Active Cases', value: String(activeCount).padStart(2, '0'), icon: FolderOpen, action: 'cases' },
    { label: 'High-Priority Alerts', value: String(alertSeed.length).padStart(2, '0'), icon: Siren, action: 'alerts' },
    { label: 'Updated Today', value: String(updatedTodayCount).padStart(2, '0'), icon: Shield, action: 'cases' },
    { label: 'Entities Tracked', value: '26', icon: Network, action: 'graph' },
  ]
  const [activeNav, setActiveNav] = useState('Dashboard'); const [filter, setFilter] = useState('All Cases'); const [query, setQuery] = useState('')
  const casesRef = useRef(null)
  const filteredCases = useMemo(() => cases.filter((item) => `${item.id} ${item.title} ${item.subject} ${item.alias || ''}`.toLowerCase().includes(query.toLowerCase())), [cases, query])
  const scrollToCases = () => casesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const runMetric = (action) => (action === 'alerts' ? onAlerts() : action === 'graph' ? onGraph() : scrollToCases())
  const navigate = (name) => {
    setActiveNav(name)
    if (name === 'Network Search') return onGraph()
    if (name === 'Case Graph') return onGraph()
    if (name === 'Intelligence') return onIntel()
    if (name === 'Alerts') return onAlerts()
    if (name === 'Cases') return scrollToCases()
  }
  return <div className="min-h-screen bg-[#f5f1ea] text-[#171511]"><DashboardSidebar active={activeNav} onNavigate={navigate}/><div className="md:pl-60"><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#e5e0d8] bg-white/95 px-4 backdrop-blur sm:px-8"><div className="relative w-full max-w-md"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8a8578]"/><input className="h-10 w-full rounded-full border border-[#e5e0d8] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#171511]" placeholder="Search cases, people, identifiers…" value={query} onChange={(event)=>setQuery(event.target.value)}/></div><div className="ml-4 flex items-center gap-3"><button onClick={onAlerts} className="relative"><Bell className="size-5 text-[#777166]"/><i className="absolute right-0 top-0 size-1.5 rounded-full bg-[#c0362c]"/></button><button className="rounded-full border border-[#e5e0d8] px-3 py-1.5 text-xs" onClick={onSignOut}>Sign out</button></div></header><main className="p-4 sm:p-8"><section className="animate-rise-in"><span className="rounded-full border border-[#171511] bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-wider">Case intelligence // overview</span><div className="mt-3 flex flex-col justify-between gap-3 lg:flex-row lg:items-end"><div><h1 className="font-serif text-[30px]">Good morning, <em>Investigator Roy</em></h1><p className="mt-1 text-sm text-[#8a8578]">Your active dossier summary and high-priority lead activity across 14 jurisdictions.</p></div><span className="w-fit rounded-full bg-[#ece8e1] px-3 py-2 font-mono text-[10px]">THREAT LEVEL II</span></div></section><section className="animate-rise-in-delay mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({label,value,icon:Icon,action})=><button key={label} onClick={()=>runMetric(action)} className="rounded-xl border border-[#e5e0d8] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"><Icon className={`size-5 ${action==='alerts'?'text-[#c0362c]':''}`}/><p className="mt-5 font-serif text-3xl">{value}</p><p className="mt-1 text-sm font-semibold">{label}</p></button>)}</section><section ref={casesRef} className="mt-7 scroll-mt-20"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-[22px]">Recent & Active Investigations</h2><div className="flex flex-wrap gap-2"><button className="rounded-full border border-[#e5e0d8] bg-white px-3 py-2 text-xs" onClick={onGraph}>Graph Workspace</button>{filterChips.map(name=><button key={name} className={`rounded-full px-3 py-2 text-xs ${filter===name?'bg-[#111] text-white':'bg-white'}`} onClick={()=>setFilter(name)}>{name}</button>)}<button className="inline-flex items-center gap-1 rounded-full bg-[#111] px-4 py-2 text-xs font-medium text-white" onClick={onCreateCase}><Plus className="size-4"/>New Case</button></div></div><CaseDirectory cases={filteredCases} filter={filter} onSelect={onSelectCase} onEdit={onEditCase} justAddedId={justAddedId}/></section></main></div></div>
}
