import { initialCases } from '../dashboardData'

// Case id -> case record, so every panel below can resolve a title/subject
// from just a caseId without re-importing dashboardData everywhere.
export const caseById = Object.fromEntries(initialCases.map((item) => [item.id, item]))
export const CASE_ORDER = initialCases.map((item) => item.id)

// ---------------------------------------------------------------------------
// Clusters (auto-detected communities) + ranked suspects
// ---------------------------------------------------------------------------

export const clusters = [
  { id: 'cluster-pier44', name: 'Pier 44 Logistics Cell', color: '#3b82f6', summary: 'Freight diversion and vehicle staging around the maritime terminal.' },
  { id: 'cluster-hawala', name: 'Hawala Clearing Ring', color: '#a855f7', summary: 'Offshore clearing and cross-border value transfer.' },
  { id: 'cluster-cyberfraud', name: 'Cyber Fraud Front', color: '#ef4444', summary: 'Phishing-led escrow drains and downstream mule liquidity.' },
]

export const rankedSuspects = [
  {
    id: 'ramesh-kumar', name: 'Ramesh Kumar', alias: 'Wire', score: 94.8,
    clusterIds: ['cluster-pier44', 'cluster-hawala', 'cluster-cyberfraud'], isBridge: true,
    reason: "Central node across all three active clusters — the network's structural hub.",
    degree: 0.94, betweenness: 0.89, pagerank: 0.91,
  },
  {
    id: 'marcus-vance', name: 'Marcus Vance', alias: 'The Chancellor', score: 88.2,
    clusterIds: ['cluster-cyberfraud'], isBridge: false,
    reason: 'Controls outbound liquidity routing for the fraud front.',
    degree: 0.88, betweenness: 0.61, pagerank: 0.85,
  },
  {
    id: 'elena-rostova', name: 'Elena Rostova', alias: 'Specter-7', score: 82.5,
    clusterIds: ['cluster-hawala'], isBridge: false,
    reason: 'Encrypted communications gateway between cells.',
    degree: 0.82, betweenness: 0.55, pagerank: 0.79,
  },
  {
    id: 'salim-qureshi', name: 'Salim Qureshi', alias: 'Munshi', score: 79.1,
    clusterIds: ['cluster-pier44', 'cluster-hawala'], isBridge: true,
    reason: "Never a named suspect anywhere, yet surfaces as a peripheral record in 5 of 6 open cases — the network's real intermediary.",
    degree: 0.71, betweenness: 0.68, pagerank: 0.74,
  },
  {
    id: 'vikram-malhotra', name: 'Vikram Malhotra', alias: 'Skipper', score: 76.4,
    clusterIds: ['cluster-pier44'], isBridge: false,
    reason: 'Maritime freight drop-point custodian.',
    degree: 0.76, betweenness: 0.31, pagerank: 0.68,
  },
  {
    id: 'thomas-sterling', name: 'Thomas Sterling', alias: 'Ledger-3', score: 71.0,
    clusterIds: ['cluster-cyberfraud'], isBridge: false,
    reason: 'Micro-structuring deposit coordinator.',
    degree: 0.71, betweenness: 0.24, pagerank: 0.62,
  },
  {
    id: 'devendra-roy', name: 'Devendra Roy', alias: 'Alchemist', score: 64.9,
    clusterIds: ['cluster-hawala'], isBridge: false,
    reason: 'Synthetic bullion paperwork broker.',
    degree: 0.64, betweenness: 0.18, pagerank: 0.55,
  },
]

// ---------------------------------------------------------------------------
// Activity monitor — reverse-chronological, across all watched individuals
// ---------------------------------------------------------------------------

export const activityEvents = [
  { id: 'a1', time: '09:42 IST', severity: 'High', person: 'Ramesh Kumar', event: 'SIM +91 98201-XXXXX reactivated after 41 days dormant', caseId: 'CAS-2026-0392', source: 'CDR feed' },
  { id: 'a2', time: '08:15 IST', severity: 'Critical', person: 'Devendra Roy', event: 'Crossed Nepal border at the Sunauli checkpoint', caseId: 'CAS-2025-0771', source: 'Immigration API' },
  { id: 'a3', time: '07:03 IST', severity: 'Medium', person: 'Marcus Vance', event: '₹12.4L transferred to Apex Escrow AG', caseId: 'CAS-2026-0114', source: 'FIU feed' },
  { id: 'a4', time: 'Yesterday, 22:10', severity: 'High', person: 'Salim Qureshi', event: 'Toyota Fortuner MH-02-EQ-4821 (registered to Qureshi) ANPR hit near the Goregaon safehouse', caseId: 'CAS-2026-0392', source: 'ANPR network' },
  { id: 'a5', time: 'Yesterday, 19:40', severity: 'Medium', person: 'Vikram Malhotra', event: 'Vessel MV Coral Horizon departed Berth 6 without manifest filing', caseId: 'CAS-2026-0203', source: 'Port authority log' },
  { id: 'a6', time: 'Yesterday, 14:02', severity: 'Critical', person: 'Elena Rostova', event: 'Encrypted relay node resumed traffic after 7 months of silence', caseId: 'CAS-2024-1183', source: 'Tower dump' },
  { id: 'a7', time: '2 days ago', severity: 'Medium', person: 'Thomas Sterling', event: '24 sub-threshold transfers logged across six mule accounts', caseId: 'CAS-2025-0588', source: 'FIU feed' },
  { id: 'a8', time: '2 days ago', severity: 'Low', person: 'Salim Qureshi', event: 'KYC introduction filed for a dormant escrow account reactivation', caseId: 'CAS-2024-1183', source: 'Bank compliance log' },
  { id: 'a9', time: '3 days ago', severity: 'High', person: 'Ramesh Kumar', event: 'Eighteen encrypted VoIP calls within 12 minutes, preceding an RTGS dispatch', caseId: 'CAS-2026-0392', source: 'CDR feed' },
  { id: 'a10', time: '4 days ago', severity: 'Medium', person: 'Marcus Vance', event: 'New shell entity "Apex Global Advisory Ltd" incorporated in Mauritius', caseId: 'CAS-2026-0114', source: 'Corporate registry' },
  { id: 'a11', time: '5 days ago', severity: 'Low', person: 'Vikram Malhotra', event: 'Routine berth-side co-location with Ramesh Kumar, 14 minutes', caseId: 'CAS-2026-0203', source: 'CCTV log' },
  { id: 'a12', time: '6 days ago', severity: 'High', person: 'Devendra Roy', event: 'Bonded warehouse lease renewed under an alias entity', caseId: 'CAS-2025-0771', source: 'Property registry' },
  { id: 'a13', time: '9 days ago', severity: 'Medium', person: 'Salim Qureshi', event: 'Witness statement filed, contradicts the prior deposition timeline', caseId: 'CAS-2025-0588', source: 'FIR statement' },
  { id: 'a14', time: '11 days ago', severity: 'Critical', person: 'Elena Rostova', event: 'IMSI pinged Bandra and Deira cell towers with a sub-second interval', caseId: 'CAS-2024-1183', source: 'Tower dump' },
]

// ---------------------------------------------------------------------------
// Cross-case entities — the "repeated in multiple cases, even as an edge" view
// ---------------------------------------------------------------------------

export const crossCaseEntities = [
  {
    id: 'salim-qureshi', name: 'Salim Qureshi', alias: '"Munshi"', kind: 'person', neverNamedSuspect: true,
    appearances: [
      { caseId: 'CAS-2026-0392', role: 'Registered owner of the Toyota Fortuner observed at the Goregaon safehouse', recordType: 'Vehicle record' },
      { caseId: 'CAS-2026-0114', role: 'Subscriber of a SIM that called Hawala Shell Unit 04 twenty-two times', recordType: 'Telecom record' },
      { caseId: 'CAS-2025-0771', role: 'Co-signatory on the bonded warehouse lease at Sunauli', recordType: 'Property record' },
      { caseId: 'CAS-2025-0588', role: 'Listed as a witness in the FIR statement', recordType: 'FIR record' },
      { caseId: 'CAS-2024-1183', role: 'KYC introducer on the dormant escrow account', recordType: 'Bank record' },
    ],
  },
  {
    id: 'marcus-vance', name: 'Marcus Vance', alias: '"The Chancellor"', kind: 'person', neverNamedSuspect: false,
    appearances: [
      { caseId: 'CAS-2026-0114', role: 'Named primary suspect', recordType: 'FIR record' },
      { caseId: 'CAS-2026-0392', role: 'Recipient of two RTGS transfers traced from the escrow drain', recordType: 'Financial record' },
      { caseId: 'CAS-2025-0588', role: 'Beneficial owner of one of the six mule accounts', recordType: 'Bank record' },
    ],
  },
  {
    id: 'elena-rostova', name: 'Elena Rostova', alias: '"Specter-7"', kind: 'person', neverNamedSuspect: false,
    appearances: [
      { caseId: 'CAS-2024-1183', role: 'Named primary suspect', recordType: 'FIR record' },
      { caseId: 'CAS-2026-0392', role: 'Operator of the encrypted comms relay used on the hotline', recordType: 'Telecom record' },
      { caseId: 'CAS-2026-0114', role: 'Co-located with Marcus Vance in the BKC financial district, 3 occurrences', recordType: 'CCTV log' },
    ],
  },
  {
    id: 'veh-fortuner-4821', name: 'Toyota Fortuner MH-02-EQ-4821', kind: 'vehicle', neverNamedSuspect: null,
    appearances: [
      { caseId: 'CAS-2026-0392', role: 'Observed near the Goregaon safehouse, twice', recordType: 'ANPR log' },
      { caseId: 'CAS-2026-0203', role: 'Logged at Pier 44 Berth 6 during a cargo transfer window', recordType: 'ANPR log' },
    ],
  },
  {
    id: 'sim-98201', name: 'SIM +91 98201-XXXXX', kind: 'phone', neverNamedSuspect: null,
    appearances: [
      { caseId: 'CAS-2026-0392', role: 'Primary hotline, 42 matched call records', recordType: 'CDR' },
      { caseId: 'CAS-2026-0114', role: 'Twenty-two calls to Hawala Shell Unit 04', recordType: 'CDR' },
      { caseId: 'CAS-2024-1183', role: "Roaming co-registration with Elena Rostova's device", recordType: 'CDR' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Entity dossiers — single-search background history
// ---------------------------------------------------------------------------

export const entityDossiers = {
  'ramesh-kumar': {
    id: 'ramesh-kumar', kind: 'person', name: 'Ramesh Kumar', alias: 'Wire',
    identity: { legalName: 'Ramesh Kumar', dob: 'c. 1985 (estimated)', nationality: 'Indian', knownAliases: ['Wire'] },
    neverNamedSuspect: false,
    timeline: [
      { caseId: 'CAS-2026-0392', role: 'Primary named suspect', date: '18 Mar 2026' },
      { caseId: 'CAS-2026-0114', role: 'Linked associate — bridges into Cyber Fraud Front', date: '22 Jan 2026' },
      { caseId: 'CAS-2025-0771', role: 'Linked associate — bridges into Hawala Clearing Ring', date: '02 Nov 2025' },
      { caseId: 'CAS-2026-0203', role: 'Linked associate — bridges into Pier 44 Logistics Cell', date: '11 Feb 2026' },
    ],
    associates: [
      { name: 'Salim Qureshi', count: 5, note: 'Recurring peripheral contact across the network' },
      { name: 'Vikram Malhotra', count: 3, note: 'Co-located at Pier 44, multiple occurrences' },
      { name: 'Marcus Vance', count: 2, note: 'Shared financial trail via Apex Escrow AG' },
      { name: 'Elena Rostova', count: 2, note: 'Shared comms relay usage' },
    ],
    assets: ['Toyota Fortuner MH-02-EQ-4821 (registered to associate S. Qureshi, frequently observed with)', 'SIM +91 98201-XXXXX (primary hotline)'],
    priorRecord: ['2019 — Detained for questioning in a separate smuggling inquiry, released without charge.', '2022 — Named in an intelligence report on maritime freight diversion; no formal case opened.'],
    aiAssessment: "Ramesh Kumar is the only individual bridging all three detected clusters. His connection pattern — high betweenness relative to his direct degree — is consistent with a coordinating role rather than a hands-on operator. Cross-case correlation places him adjacent to four of the six open investigations, formally named a suspect in only one.",
  },
  'salim-qureshi': {
    id: 'salim-qureshi', kind: 'person', name: 'Salim Qureshi', alias: 'Munshi',
    identity: { legalName: 'Salim Qureshi', dob: 'c. 1979 (estimated)', nationality: 'Indian', knownAliases: ['Munshi'] },
    neverNamedSuspect: true,
    timeline: [
      { caseId: 'CAS-2026-0392', role: 'Registered owner of the Toyota Fortuner observed at the Goregaon safehouse', date: '19 Mar 2026' },
      { caseId: 'CAS-2026-0114', role: 'Subscriber of a SIM that called Hawala Shell Unit 04 twenty-two times', date: '24 Jan 2026' },
      { caseId: 'CAS-2025-0771', role: 'Co-signatory on the bonded warehouse lease at Sunauli', date: '05 Nov 2025' },
      { caseId: 'CAS-2025-0588', role: 'Listed as a witness in the FIR statement', date: '20 Aug 2025' },
      { caseId: 'CAS-2024-1183', role: 'KYC introducer on the dormant escrow account', date: '02 Jul 2024' },
    ],
    associates: [
      { name: 'Ramesh Kumar', count: 5, note: 'Present alongside Kumar in every one of his 5 case appearances' },
      { name: 'Devendra Roy', count: 2, note: 'Shared warehouse and freight documentation' },
      { name: 'Elena Rostova', count: 1, note: 'Shared device co-registration' },
    ],
    assets: ['Toyota Fortuner MH-02-EQ-4821', 'SIM +91 98201-XXXXX (co-registration)'],
    priorRecord: ['No prior criminal record on file.', 'Flagged only after cross-case correlation — no single case file identifies him as a person of interest.'],
    aiAssessment: 'Salim Qureshi has never been named a suspect, witness of interest, or person of concern in any single case file. Correlated across all six open investigations, he appears five times as a secondary record — vehicle owner, SIM subscriber, lease co-signatory, witness, KYC introducer — always adjacent to the primary suspect, never named. This is the strongest indicator in the network of an unlisted intermediary role, and the exact pattern cross-case analysis exists to surface.',
  },
  'marcus-vance': {
    id: 'marcus-vance', kind: 'person', name: 'Marcus Vance', alias: 'The Chancellor',
    identity: { legalName: 'Marcus Vance', dob: 'c. 1981 (estimated)', nationality: 'British', knownAliases: ['The Chancellor'] },
    neverNamedSuspect: false,
    timeline: [
      { caseId: 'CAS-2026-0114', role: 'Named primary suspect', date: '22 Jan 2026' },
      { caseId: 'CAS-2026-0392', role: 'Recipient of two RTGS transfers traced from the escrow drain', date: '18 Mar 2026' },
      { caseId: 'CAS-2025-0588', role: 'Beneficial owner of one of the six mule accounts', date: '14 Aug 2025' },
    ],
    associates: [
      { name: 'Ramesh Kumar', count: 2, note: 'Shared financial trail via Apex Escrow AG' },
      { name: 'Thomas Sterling', count: 2, note: 'Co-signatory on mule account structuring' },
      { name: 'Elena Rostova', count: 3, note: 'Co-located in BKC financial district' },
    ],
    assets: ['Apex Global Advisory Ltd (Mauritius shell, incorporated 2026)', 'Escrow control account, Apex Escrow AG'],
    priorRecord: ['2021 — UK FCA inquiry into unregistered payment facilitation, no charges filed.'],
    aiAssessment: 'Controls the outbound liquidity leg of the Cyber Fraud Front cluster. Financial trail links him directly to the Dark Ledger escrow drain despite being formally named a suspect in a separate case.',
  },
  'elena-rostova': {
    id: 'elena-rostova', kind: 'person', name: 'Elena Rostova', alias: 'Specter-7',
    identity: { legalName: 'Elena Rostova', dob: 'c. 1988 (estimated)', nationality: 'Unconfirmed', knownAliases: ['Specter-7'] },
    neverNamedSuspect: false,
    timeline: [
      { caseId: 'CAS-2024-1183', role: 'Named primary suspect', date: '30 Jun 2024' },
      { caseId: 'CAS-2026-0392', role: 'Operator of the encrypted comms relay used on the hotline', date: '18 Mar 2026' },
      { caseId: 'CAS-2026-0114', role: 'Co-located with Marcus Vance in the BKC financial district, 3 occurrences', date: '22 Jan 2026' },
    ],
    associates: [
      { name: 'Ramesh Kumar', count: 2, note: 'Shared comms relay usage' },
      { name: 'Marcus Vance', count: 3, note: 'Repeated co-location' },
      { name: 'Salim Qureshi', count: 1, note: 'Shared device co-registration' },
    ],
    assets: ['Encrypted relay node, Deira Comms Exchange'],
    priorRecord: ['2020 — Flagged in an inter-agency comms-intercept advisory, no domestic case opened until 2024.'],
    aiAssessment: 'A dormant node reactivated after seven months of silence. Her comms infrastructure underlies contact patterns in two other active cases, suggesting she supplies communications cover rather than acting as a financial principal.',
  },
  'vikram-malhotra': {
    id: 'vikram-malhotra', kind: 'person', name: 'Vikram Malhotra', alias: 'Skipper',
    identity: { legalName: 'Vikram Malhotra', dob: 'c. 1976 (estimated)', nationality: 'Indian', knownAliases: ['Skipper'] },
    neverNamedSuspect: false,
    timeline: [{ caseId: 'CAS-2026-0203', role: 'Named primary suspect', date: '11 Feb 2026' }],
    associates: [{ name: 'Ramesh Kumar', count: 3, note: 'Co-located at Pier 44, multiple occurrences' }],
    assets: ['MV Coral Horizon (freight vessel, operational custody)'],
    priorRecord: ['2023 — Customs manifest discrepancy, administrative fine only.'],
    aiAssessment: 'Custodian of the maritime drop point used across the Pier 44 Logistics Cell. Low betweenness suggests a fixed operational role rather than a coordinating one.',
  },
  'thomas-sterling': {
    id: 'thomas-sterling', kind: 'person', name: 'Thomas Sterling', alias: 'Ledger-3',
    identity: { legalName: 'Thomas Sterling', dob: 'c. 1990 (estimated)', nationality: 'American', knownAliases: ['Ledger-3'] },
    neverNamedSuspect: false,
    timeline: [{ caseId: 'CAS-2025-0588', role: 'Named primary suspect', date: '14 Aug 2025' }],
    associates: [{ name: 'Marcus Vance', count: 2, note: 'Co-signatory on mule account structuring' }],
    assets: ['Six mule accounts, HDFC/ICICI network'],
    priorRecord: ['No prior record on file.'],
    aiAssessment: 'Coordinates sub-threshold structuring across a fixed set of mule accounts. Case is formally closed; financial trail remains cross-referenced against the active Cyber Fraud Front cluster.',
  },
  'devendra-roy': {
    id: 'devendra-roy', kind: 'person', name: 'Devendra Roy', alias: 'Alchemist',
    identity: { legalName: 'Devendra Roy', dob: 'c. 1983 (estimated)', nationality: 'Indian', knownAliases: ['Alchemist'] },
    neverNamedSuspect: false,
    timeline: [{ caseId: 'CAS-2025-0771', role: 'Named primary suspect', date: '02 Nov 2025' }],
    associates: [{ name: 'Salim Qureshi', count: 2, note: 'Shared warehouse and freight documentation' }],
    assets: ['Bonded Warehouse 7, Sunauli Border Freight Yard'],
    priorRecord: ['2018 — Named in a separate bullion-smuggling inquiry, case closed for insufficient evidence.'],
    aiAssessment: 'Brokers paperwork for synthetic bullion movement through the Hawala Clearing Ring. Case has gone cold; border-crossing activity today reopens the trail.',
  },
}
