// Two hierarchies — victim and suspect — each rooted at a person, plus the
// edges that connect them. All victim-side field values are reused from the
// existing Victim Profile content; all suspect-side field values are reused
// from the existing Graph Workspace fixture. The 2 family members and 3
// documents don't exist elsewhere in the app and are defined here.

function leaf(id, label, fields) {
  return { id, label, kind: 'leaf', side: 'victim', fields, children: [] }
}

function suspectLeaf(id, label, fields) {
  return { id, label, kind: 'leaf', side: 'suspect', fields, children: [] }
}

export const victimTree = {
  id: 'v-root',
  label: 'Ananya Sharma',
  kind: 'root',
  side: 'victim',
  fields: [
    ['Role', 'Primary Complainant / Victim'],
    ['Case', 'CAS-2026-0392'],
    ['FIR', 'FIR-CR-9402/2026-NZ'],
  ],
  children: [
    {
      id: 'v-personal',
      label: 'Personal Info',
      kind: 'category',
      side: 'victim',
      fields: [
        ['Full Legal Name', 'Ananya Ramesh Sharma'],
        ['Date of Birth / Age', '14 July 1991 (34 yrs)'],
        ['Residential Address', 'Flat 402, Sea Breeze Enclave, Bandra West, Mumbai, MH 400050'],
        ['Primary Contact', '+91 98201-44918'],
        ['National ID / KYC Ref', 'KYC-UID-8941-2094-1182'],
        ['Primary Occupation', 'Senior Financial Auditor at Apex Global Advisory'],
        ['Secondary Email', 'ananya.sharma@apexglobal.in'],
        ['Legal Representation', 'Adv. Rohan Iyer (High Court Bar Assoc. #HC-8821)'],
      ],
      children: [],
    },
    {
      id: 'v-family',
      label: 'Family & Kin',
      kind: 'category',
      side: 'victim',
      fields: [['Linked relatives', '2']],
      children: [
        leaf('v-family-karan', 'Karan Sharma', [
          ['Relation', 'Spouse'],
          ['Occupation', 'Marine Logistics Manager'],
          ['Contact', '+91 98212-33410'],
          ['Note', 'Primary family liaison contact'],
        ]),
        leaf('v-family-meenal', 'Meenal Sharma', [
          ['Relation', 'Mother'],
          ['Address', 'Same residence as victim'],
          ['Contact', '+91 98213-88820'],
          ['Note', 'Informed of Tier 1 witness-protection status'],
        ]),
      ],
    },
    {
      id: 'v-fir',
      label: 'FIR Details',
      kind: 'category',
      side: 'victim',
      fields: [
        ['FIR ID', 'FIR-CR-9402/2026-NZ'],
        ['Filed', '18 Mar 2026 • 06:15 IST'],
        ['Station', 'State Central Cyber Cell'],
        ['Investigating Officer', 'Insp. D. Miller'],
        ['Incident Summary', 'Unauthorized wire transfer of ₹45,00,000 initiated from escrow account at 02:40 IST.'],
      ],
      children: [],
    },
    {
      id: 'v-financial',
      label: 'Financial Loss',
      kind: 'category',
      side: 'victim',
      fields: [
        ['Total Fraud Volume', '₹45,00,000'],
        ['Recovery Freeze', '₹28,50,000'],
        ['Unrecovered Delta', '₹16,50,000'],
      ],
      children: [],
    },
    {
      id: 'v-documents',
      label: 'Linked Documents',
      kind: 'category',
      side: 'victim',
      fields: [['Documents on file', '3']],
      children: [
        leaf('v-doc-fir', 'FIR Statement (PDF)', [
          ['Filed', '18 Mar 2026'],
          ['Location', 'State Central Cyber Cell'],
          ['Ref', 'FIR-CR-9402/2026-NZ'],
        ]),
        leaf('v-doc-kyc', 'Aadhaar / KYC Verification', [
          ['Ref', 'KYC-UID-8941-2094-1182'],
          ['Status', 'Cross-verified with Aadhaar registry'],
        ]),
        leaf('v-doc-phish', 'Phishing-Domain Correlation Report', [
          ['Filed', '23 Mar 2026'],
          ['Finding', 'apex-escrow-secure[.]net identified as the spoofed domain used in the wire-transfer request'],
          ['Cross-reference', 'Linked to Hawala Shell Unit 04'],
        ]),
      ],
    },
    {
      id: 'v-evidence',
      label: 'Evidence Locker',
      kind: 'category',
      side: 'victim',
      fields: [['Items on file', '2']],
      children: [
        leaf('v-evd-dump', 'Forensic Device Dump', [
          ['Completed', '19 Mar 2026 • 11:30 IST'],
          ['Ref', 'EVD-9041'],
        ]),
        leaf('v-evd-deposition', 'Deposition Recording', [
          ['Taken', '21 Mar 2026 • 15:00 IST'],
          ['Officer', 'Insp. D. Miller'],
        ]),
      ],
    },
  ],
}

export const suspectTree = {
  id: 's-root',
  label: 'Ramesh Kumar',
  kind: 'root',
  side: 'suspect',
  fields: [
    ['Alias', '"Wire"'],
    ['Risk', 'Critical'],
    ['Summary', 'Primary suspect and central bridge. Eighteen encrypted VoIP calls preceded a ₹28.5L RTGS dispatch.'],
  ],
  children: [
    {
      id: 's-financial',
      label: 'Financial',
      kind: 'category',
      side: 'suspect',
      fields: [['Linked accounts/entities', '2']],
      children: [
        suspectLeaf('s-hawala', 'Hawala Shell Unit 04', [
          ['Type', 'Organization / Shell'],
          ['Risk', 'High'],
          ['Detail', 'Offshore clearing entity identified in 41 connected ledger entries.'],
        ]),
        suspectLeaf('s-mule', 'Mule Account 02', [
          ['Type', 'Financial Account'],
          ['Risk', 'Critical'],
          ['Detail', 'HDFC destination account currently frozen by court order.'],
        ]),
      ],
    },
    {
      id: 's-locations',
      label: 'Locations',
      kind: 'category',
      side: 'suspect',
      fields: [['Linked sites', '1']],
      children: [
        suspectLeaf('s-safehouse', 'Safehouse Goregaon', [
          ['Type', 'Location / Site'],
          ['Risk', 'Medium'],
          ['Detail', 'Unregistered lease with eleven recurring geolocation pings.'],
        ]),
      ],
    },
    {
      id: 's-communications',
      label: 'Communications',
      kind: 'category',
      side: 'suspect',
      fields: [['Linked lines', '1']],
      children: [
        suspectLeaf('s-sim', 'SIM +91 98201', [
          ['Type', 'Phone / SIM'],
          ['Risk', 'High'],
          ['Detail', 'Encrypted hotline with 42 matched call records.'],
        ]),
      ],
    },
    {
      id: 's-evidence',
      label: 'Evidence',
      kind: 'category',
      side: 'suspect',
      fields: [['Items seized', '1']],
      children: [
        suspectLeaf('s-ssd', 'Seized 4TB SSD', [
          ['Type', 'Physical Evidence'],
          ['Risk', 'Medium'],
          ['Detail', 'Evidence item EVD-209 with encrypted call-log archive.'],
        ]),
      ],
    },
    {
      id: 's-assets',
      label: 'Assets',
      kind: 'category',
      side: 'suspect',
      fields: [['Vehicles', '1']],
      children: [
        suspectLeaf('s-vehicle', 'Toyota Fortuner', [
          ['Type', 'Vehicle / Asset'],
          ['Risk', 'Medium'],
          ['Detail', 'Vehicle observed near Goregaon location twice.'],
        ]),
      ],
    },
  ],
}

export const rootLinkEdge = { id: 'e-root-link', source: 'v-root', target: 's-root', label: 'Named in FIR' }

export const crossEdges = [
  { id: 'e-cross-financial', source: 'v-financial', target: 's-mule', label: 'Traced funds' },
  { id: 'e-cross-fir', source: 'v-fir', target: 's-root', label: 'Named suspect' },
  { id: 'e-cross-doc', source: 'v-doc-phish', target: 's-hawala', label: 'Domain correlation' },
]
