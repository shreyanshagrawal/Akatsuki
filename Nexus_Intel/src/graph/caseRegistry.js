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

function graphNode(id, label, kind, side, fields = [], children = []) {
  return { id, label, kind, side, fields, children }
}

// New cases do not need a bespoke fixture to be useful in the graph. This
// builds a consistent investigation map from the information collected in the
// intake wizard, while retaining the richer hand-authored graphs above.
export function createCaseGraphData(caseItem) {
  const key = String(caseItem.id).replace(/[^a-z0-9]/gi, '').toLowerCase()
  const victimRoot = `v-${key}`
  const suspectRoot = `s-${key}`
  const subject = caseItem.subject || 'Unidentified subject'
  const title = caseItem.title || 'New investigation'
  const firId = caseItem.firId || 'Pending registration'
  const location = caseItem.location || 'Location pending verification'

  return {
    caseId: caseItem.id,
    title: `${caseItem.id} ${title}`,
    complainantLabel: 'Case & evidence record',
    suspectLabel: `Subject network (${subject})`,
    narrative: null,
    victimTree: graphNode(victimRoot, title, 'root', 'victim', [
      ['Case ID', caseItem.id], ['Priority', caseItem.priority || caseItem.risk || 'Medium'], ['Status', caseItem.status || 'Active'],
    ], [
      graphNode(`${victimRoot}-fir`, 'FIR Details', 'category', 'victim', [
        ['FIR ID', firId], ['Incident time', caseItem.incidentAt || 'Pending'], ['Location', location],
      ]),
      graphNode(`${victimRoot}-evidence`, 'Evidence Dossier', 'category', 'victim', [
        ['Document', caseItem.dossier?.name || 'No dossier attached'], ['Extraction status', 'AI metadata reviewed'], ['Case link', caseItem.id],
      ]),
      graphNode(`${victimRoot}-identity`, 'Identity Verification', 'category', 'victim', [
        ['KYC reference', caseItem.identityRef || 'Pending verification'], ['Status', 'Cross-reference queued'],
      ]),
    ]),
    suspectTree: graphNode(suspectRoot, subject, 'root', 'suspect', [
      ['Role', 'Primary target / subject'], ['Case', caseItem.id], ['Risk', caseItem.priority || caseItem.risk || 'Medium'],
    ], [
      graphNode(`${suspectRoot}-profile`, 'Subject Profile', 'category', 'suspect', [
        ['Name', subject], ['Identity ref', caseItem.identityRef || 'Pending verification'], ['Investigation status', 'Active review'],
      ]),
      graphNode(`${suspectRoot}-location`, 'Location Signal', 'category', 'suspect', [
        ['Last linked location', location], ['Incident time', caseItem.incidentAt || 'Pending'],
      ]),
      graphNode(`${suspectRoot}-lead`, 'Investigation Lead', 'category', 'suspect', [
        ['Assigned unit', caseItem.lead || 'Intelligence Desk'], ['Next action', 'Validate evidence correlations'],
      ]),
    ]),
    rootLinkEdge: { id: `e-cross-${key}-case-subject`, source: victimRoot, target: suspectRoot, label: 'Named in case record' },
    crossEdges: [
      { id: `e-cross-${key}-fir-subject`, source: `${victimRoot}-fir`, target: `${suspectRoot}-profile`, label: 'FIR reference' },
      { id: `e-cross-${key}-identity-subject`, source: `${victimRoot}-identity`, target: `${suspectRoot}-profile`, label: 'KYC correlation' },
      { id: `e-cross-${key}-evidence-location`, source: `${victimRoot}-evidence`, target: `${suspectRoot}-location`, label: 'Evidence location' },
    ],
  }
}

export function getCaseGraphData(caseId = 'CAS-2026-1140', caseItem = null) {
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

  if (caseId !== 'CAS-2026-1140' && caseItem) return createCaseGraphData(caseItem)

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
