# Victim/Suspect Node Graph — Design

Status: Approved by user 2026-09-08 ("make it")
Scope: `Nexus_Intel/` frontend only (no backend, no persistence)

## Problem

Today, clicking a case row opens a tabbed `VictimProfile` page (Personal Info /
Family & Kin / FIR Details / Linked Documents / Evidence Locker), and a
separate `GraphWorkspace` screen shows a flat, static 7-node suspect network
(Ramesh Kumar and his associated entities). The two are disconnected screens
that don't reflect the master solution document's framing of the victim
profile as "the root node of the case's investigation graph."

## Goal

Replace both with a single node-based graph screen, reached from every entry
point that currently opens either screen. The graph has two root nodes — the
victim and the primary suspect — each the root of its own collapsible
hierarchy, connected to each other and to each other's branches, so
investigators can visually trace how a piece of victim-side information
(e.g. traced funds) connects to a suspect-side entity (e.g. a mule account).

## Data model

Two trees, each rooted at a person, connected at the root, with a small
number of cross-tree edges representing evidentiary links.

### Victim tree — root "Ananya Sharma"

| Category node | Children (leaf nodes) |
|---|---|
| Personal Info | — (leaf category; fields only: legal name, DOB/age, address, contact, national ID, occupation, secondary email, legal rep) |
| Family & Kin | Karan Sharma (Spouse), Meenal Sharma (Mother) |
| FIR Details | — (leaf category; fields: FIR ID, date/time, station, officer, incident summary) |
| Financial Loss | — (leaf category; fields: total fraud volume, recovery freeze, unrecovered delta) |
| Linked Documents | FIR Statement (PDF), Aadhaar / KYC Verification, Phishing-Domain Correlation Report |
| Evidence Locker | Device handover / forensic dump (Ref: EVD-9041), Deposition recording (Insp. D. Miller) |

All field values are reused verbatim from the existing `VictimProfile.jsx`
content and its timeline, except the 2 family members and 3 document names,
which don't currently exist anywhere in the app and are specified here so
implementation doesn't have to invent them ad hoc:

- **Karan Sharma** — Spouse; Marine Logistics Manager; +91 98212-33410;
  primary family liaison contact.
- **Meenal Sharma** — Mother; same residence as victim; +91 98213-88820;
  informed of the Tier 1 witness-protection status.
- **FIR Statement (PDF)** — filed 18 Mar 2026 at State Central Cyber Cell;
  Ref FIR-CR-9402/2026-NZ.
- **Aadhaar / KYC Verification** — Ref KYC-UID-8941-2094-1182; cross-verified
  with the Aadhaar registry.
- **Phishing-Domain Correlation Report** — filed 23 Mar 2026; flags
  `apex-escrow-secure[.]net` as the spoofed domain used in the fraudulent
  wire-transfer request. This is the node the Hawala Shell Unit 04 cross-link
  attaches to.

### Suspect tree — root "Ramesh Kumar"

| Category node | Children (leaf nodes) |
|---|---|
| Financial | Hawala Shell Unit 04, Mule Account 02 |
| Locations | Safehouse Goregaon |
| Communications | SIM +91 98201 |
| Evidence | Seized 4TB SSD |
| Assets | Toyota Fortuner |

Reuses the existing `nodes` fixture in `GraphWorkspace.jsx` verbatim, just
regrouped under category nodes instead of flat.

### Edges

- Root ↔ root: always visible, labeled "Named in FIR."
- Cross-tree edges (drive the emphasis behavior): Financial Loss ↔ Mule
  Account 02; FIR Details ↔ Ramesh Kumar (root); "Phishing-domain correlation
  report" (under Linked Documents) ↔ Hawala Shell Unit 04.
- All other edges are within-tree, parent → child.

## Interaction model

- **Default state on load**: both roots and their direct category nodes
  (level 0 + level 1) are visible. Leaf nodes (level 2) are collapsed into
  their parent category until that category is clicked.
- **Clicking any node** does two things at once:
  1. If it has children, toggles them open/closed.
  2. Expands the node's own box downward into an inline dropdown/disclosure
     showing that node's stored fields. There is no separate fixed side
     panel — the dropdown lives inside the node itself.
  Contextual actions that previously lived in `GraphWorkspace`'s right-hand
  "Selected entity" panel (Add to dossier, Trigger alert, Export graph) move
  into this per-node dropdown, scoped to whichever node is selected.
- **Cross-tree emphasis**: when a node on either side of one of the three
  cross-tree edges is selected, that edge is drawn thicker/glowing and the
  node it points to is highlighted; all other edges dim to low opacity. This
  is the visual answer to "show me how this victim-side fact connects to the
  suspect."
- **Suspect-side degree styling**: every suspect-tree node's size and color
  scale with its number of touching edges (parent + children + any
  cross-links), interpolating from a neutral amber at the low end to a
  saturated red at the high end. The suspect root (highest degree) ends up
  largest and reddest. Victim-side nodes keep one consistent neutral style
  regardless of degree — this styling is suspect-specific, not a general
  graph rule.
- Collapsing a node collapses its whole subtree back into it.

## Screen & navigation

- Implemented with **React Flow** (`@xyflow/react`), added as a new
  dependency. It replaces the hand-rolled absolute-positioned canvas
  currently in `GraphWorkspace.jsx` (custom nodes give us the
  expand/collapse + inline dropdown; custom edges give us per-edge
  color/width driven by data).
- This is the only graph screen going forward. Every current entry point
  that opens `GraphWorkspace` (clicking a case row, sidebar "Network
  Search," the dashboard's "Entities Tracked" tile, "Inspect in Graph" from
  an alert, "View in Graph" from — previously — the victim profile) opens
  this screen instead.
- `VictimProfile.jsx` is retired as a route. `App.jsx`'s `'victim'` view is
  removed; `PortalDashboard`'s `onViewVictim` now opens the graph directly.
  The component file itself can be deleted since none of its data survives
  outside the new graph fixture.
- "Key Individuals" and "Alerts" remain reachable exactly as they are today
  (`onIndividuals`, `onAlerts` from the graph screen).
- Zoom controls and the existing top header stay. The left "color coded
  entities" legend is repurposed to explain the two root colors and the
  suspect-side degree-to-color scale, rather than listing the old flat
  seven-entity-type legend.

## Layout approach

No physics/force simulation — a small hand-written tidy-tree layout function
positions each visible tree (victim on the left half of the canvas, suspect
on the right half, roots facing each other in the middle), recomputed
whenever the expand/collapse state changes so hidden nodes don't reserve
space. This keeps the layout deterministic and demoable rather than
introducing simulation jitter.

## Out of scope

- No backend, no persistence of expand state across a reload (matches the
  rest of the app).
- No changes to `AlertsCenter.jsx`, `KeyIndividuals.jsx`, `CaseIntakeWizard.jsx`,
  or `LoginPortal.jsx` beyond whatever prop wiring their navigation already
  needs (none expected).
- No multi-case support — this is still built against the single seed case.

## Verification

No automated test framework exists in the repo (confirmed in the prior
system audit). Verification is: `npm run lint`, `npm run build`, and a
manual click-through checklist:

1. Load the graph — both roots + their category nodes visible, no leaf nodes
   showing.
2. Expand each victim category — correct leaf nodes and fields appear.
3. Expand each suspect category — correct leaf nodes appear; node size/color
   visibly shifts toward red as more of the suspect branch is expanded.
4. Select "Financial Loss" — edge to "Mule Account 02" highlights, others
   dim.
5. Select "FIR Details" — root↔root edge highlights.
6. Expand "Linked Documents" → select the phishing-report child — edge to
   "Hawala Shell Unit 04" highlights.
7. Collapse everything back down — graph returns to the level-0/level-1
   default view.
8. Every previous entry point (case row, Network Search, Entities Tracked
   tile, Inspect in Graph) lands on this same screen.
