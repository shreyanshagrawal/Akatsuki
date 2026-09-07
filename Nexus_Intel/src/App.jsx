

import { useState } from 'react'
import { LoginPortal } from './components/LoginPortal'
import { PortalDashboard } from './components/PortalDashboard'
import { CaseIntakeWizard } from './components/CaseIntakeWizard'
import { VictimProfile } from './components/VictimProfile'
import { GraphWorkspace } from './components/GraphWorkspace'
import { KeyIndividuals } from './components/KeyIndividuals'
import { AlertsCenter } from './components/AlertsCenter'

function App() {
  const [session, setSession] = useState(null)
  const [view, setView] = useState('dashboard')

  if (!session) return <LoginPortal onAuthenticate={(user) => { setSession(user); setView('dashboard') }} />

  if (view === 'intake') {
    return <CaseIntakeWizard onComplete={() => setView('graph')} onExit={() => setView('dashboard')} />
  }

  if (view === 'victim') return <VictimProfile onExit={() => setView('dashboard')} onGraph={() => setView('graph')} />
  if (view === 'graph') return <GraphWorkspace onAlerts={() => setView('alerts')} onExit={() => setView('dashboard')} onIndividuals={() => setView('individuals')} />
  if (view === 'individuals') return <KeyIndividuals onExit={() => setView('graph')} />
  if (view === 'alerts') return <AlertsCenter onExit={() => setView('dashboard')} onGraph={() => setView('graph')} />

  return <PortalDashboard session={session} onAlerts={() => setView('alerts')} onCreateCase={() => setView('intake')} onGraph={() => setView('graph')} onSignOut={() => { setSession(null); setView('dashboard') }} onViewVictim={() => setView('victim')} />
}

export default App
