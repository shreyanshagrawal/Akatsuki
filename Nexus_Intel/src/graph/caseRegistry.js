// Nexus_Intel/src/graph/caseRegistry.js
import { crossEdges, rootLinkEdge, suspectTree, victimTree } from './data'
import {
  case1140CrossEdges,
  case1140RootLinkEdge,
  case1140SuspectTree,
  case1140VictimTree,
  CASE_1140_NARRATIVE,
} from './case1140'

export const AVAILABLE_CASES = [
  {
    id: 'CAS-2026-1140',
    title: 'The 11:40 Murder',
    subtitle: 'Hriday vs Akshay Kumar Singh • 6-Entity Homicide Network',
    victim: 'Hriday',
    suspect: 'Akshay Kumar Singh',
    featured: true,
  },
  {
    id: 'CAS-2026-0392',
    title: 'Operation Dark Ledger',
    subtitle: 'Ananya Sharma vs Ramesh Kumar • Financial Cyber Crime',
    victim: 'Ananya Sharma',
    suspect: 'Ramesh Kumar',
    featured: false,
  },
]

export function getCaseGraphData(caseId = 'CAS-2026-1140') {
  if (caseId === 'CAS-2026-0392') {
    return {
      caseId: 'CAS-2026-0392',
      title: 'CAS-2026-0392 Operation Dark Ledger',
      victimTree,
      suspectTree,
      rootLinkEdge,
      crossEdges,
      narrative: null,
      complainantLabel: 'Complainant Branch (Ananya Sharma)',
      suspectLabel: 'Suspect Network (Ramesh Kumar)',
    }
  }

  return {
    caseId: 'CAS-2026-1140',
    title: 'CAS-2026-1140 Case 11:40 — The Warehouse Murder',
    victimTree: case1140VictimTree,
    suspectTree: case1140SuspectTree,
    rootLinkEdge: case1140RootLinkEdge,
    crossEdges: case1140CrossEdges,
    narrative: CASE_1140_NARRATIVE,
    complainantLabel: 'Victim Record (Hriday)',
    suspectLabel: 'Perpetrator & Accomplice Ring (Akshay Kumar Singh)',
  }
}
