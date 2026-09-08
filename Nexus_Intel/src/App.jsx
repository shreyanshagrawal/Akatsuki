
import { useState } from 'react'
import { LoginPortal } from './components/LoginPortal'
import { PortalDashboard } from './components/PortalDashboard'
import { CaseIntakeWizard } from './components/CaseIntakeWizard'
import { GraphWorkspace } from './components/GraphWorkspace'
import { KeyIndividuals } from './components/KeyIndividuals'
import { AlertsCenter } from './components/AlertsCenter'
import { CaseOverview } from './intel/CaseOverview'
import { IntelligenceHub } from './intel/IntelligenceHub'
import { initialCases } from './dashboardData'

const GRAPH_SUPPORTED_CASES = new Set(['CAS-2026-1140', 'CAS-2026-0392'])

function App() {
  const [session, setSession] = useState(null)
  const [view, setView] = useState('dashboard')
  const [cases, setCases] = useState(initialCases)
  const [editingCase, setEditingCase] = useState(null)
  const [selectedCase, setSelectedCase] = useState(null)
  const [justAddedId, setJustAddedId] = useState(null)
  const [intelEntry, setIntelEntry] = useState(null)

  if (!session) return <LoginPortal onAuthenticate={(user) => { setSession(user); setView('dashboard') }} />

  const flashAdded = (id) => {
    setJustAddedId(id)
    window.setTimeout(() => setJustAddedId((current) => (current === id ? null : current)), 4000)
  }

  const openCase = (item) => {
    setSelectedCase(item)
    setView(GRAPH_SUPPORTED_CASES.has(item.id) ? 'graph' : 'case-overview')
  }

  const startNewCase = () => { setEditingCase(null); setView('intake') }
  const startEditCase = (item) => { setEditingCase(item); setView('intake') }

  const finishIntake = (form) => {
    if (editingCase) {
      setCases((current) => current.map((item) => (item.id === editingCase.id ? { ...item, ...form, id: item.id } : item)))
    } else {
      const created = { ...form, id: form.caseId, status: 'Active', risk: form.priority, lead: 'Insp. D. Miller', updated: 'Today, just now', type: 'dossier', ai: true }
      setCases((current) => [created, ...current])
      flashAdded(created.id)
    }
    setEditingCase(null)
    setView('dashboard')
  }

  const openIntelFromCase = () => {
    setIntelEntry({ tab: 'cross-case', query: selectedCase?.subject || '' })
    setView('intel')
  }

  if (view === 'intake') {
    return <CaseIntakeWizard initialCase={editingCase} onComplete={finishIntake} onExit={() => { setEditingCase(null); setView('dashboard') }} />
  }

  if (view === 'graph') return <GraphWorkspace initialCaseId={selectedCase?.id || 'CAS-2026-1140'} onAlerts={() => setView('alerts')} onExit={() => setView('dashboard')} onIndividuals={() => setView('individuals')} onIntel={() => { setIntelEntry(null); setView('intel') }} />
  if (view === 'individuals') return <KeyIndividuals caseId={selectedCase?.id || 'CAS-2026-1140'} onExit={() => setView('graph')} />
  if (view === 'alerts') return <AlertsCenter onExit={() => setView('dashboard')} onGraph={() => setView('graph')} />
  if (view === 'case-overview') return <CaseOverview caseItem={selectedCase} onExit={() => setView('dashboard')} onIntel={openIntelFromCase} />
  if (view === 'intel') return <IntelligenceHub initialTab={intelEntry?.tab} initialQuery={intelEntry?.query} onExit={() => { setIntelEntry(null); setView('dashboard') }} />

  return <PortalDashboard
    session={session}
    cases={cases}
    justAddedId={justAddedId}
    onAlerts={() => setView('alerts')}
    onCreateCase={startNewCase}
    onEditCase={startEditCase}
    onGraph={() => setView('graph')}
    onIntel={() => { setIntelEntry(null); setView('intel') }}
    onSignOut={() => { setSession(null); setView('dashboard') }}
    onSelectCase={openCase}
  />
}

export default App
