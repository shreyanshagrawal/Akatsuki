import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, FileText, FolderUp, Save, ShieldCheck, Sparkles, Upload } from 'lucide-react'

const stepLabels = ['Case Info', 'Upload Dossier', 'Review Extracted', 'Confirm & Link']
const blankForm = { title: '', subject: '', caseId: '', priority: 'Medium', firId: '', incidentAt: '', identityRef: '', location: '' }
const extractedFieldMeta = [
  ['Primary target / suspect', 'subject'],
  ['FIR registry identifier', 'firId'],
  ['Incident occurrence timestamp', 'incidentAt'],
  ['Linked identity UID / KYC ref', 'identityRef'],
  ['Primary incident location', 'location'],
]

function formFromCase(initialCase) {
  if (!initialCase) return blankForm
  return {
    title: initialCase.title || '',
    subject: initialCase.subject || '',
    caseId: initialCase.id || '',
    priority: initialCase.priority || initialCase.risk || 'Medium',
    firId: initialCase.firId || '',
    incidentAt: initialCase.incidentAt || '',
    identityRef: initialCase.identityRef || '',
    location: initialCase.location || '',
  }
}

export function CaseIntakeWizard({ initialCase, onComplete, onExit }) {
  const isEdit = Boolean(initialCase)
  const [step, setStep] = useState(1)
  const [saved, setSaved] = useState(false)
  const [dossier, setDossier] = useState(null)
  const [form, setForm] = useState(() => formFromCase(initialCase))

  const update = (name, value) => { setForm((current) => ({ ...current, [name]: value })); setSaved(false) }
  const canContinue = step !== 1 || (form.title.trim() && form.subject.trim() && form.caseId.trim())
  const next = () => {
    if (!canContinue) return
    if (step < 4) setStep((current) => current + 1)
    else onComplete({ ...form, dossier })
  }

  return <div className="min-h-screen bg-[#f5f1ea] text-[#171511]">
    <header className="sticky top-0 z-20 border-b border-[#e5e0d8] bg-[#f5f1ea]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded bg-[#111] text-white"><Sparkles className="size-4" /></span><p className="text-[13px] font-semibold uppercase tracking-wider">Nexus // Intel</p><span className="hidden rounded-full bg-[#ece8e1] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#666052] sm:inline">{isEdit ? 'Case edit // wizard' : 'Case initiation // wizard'}</span></div>
        <button className="inline-flex items-center gap-2 text-xs text-[#666052] transition hover:text-[#171511]" onClick={onExit}><ArrowLeft className="size-4" /> Exit to dashboard</button>
      </div>
    </header>

    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <Progress step={step} />
      <section className="animate-rise-in mb-7"><h1 className="font-serif text-[30px] leading-tight sm:text-[36px]">{step === 1 ? (isEdit ? <>Edit <em>case details</em></> : <>Start a new <em>investigation</em></>) : step === 2 ? <>Upload the <em>dossier</em></> : step === 3 ? <>Verify extracted <em>intelligence</em></> : (isEdit ? <>Confirm & <em>save</em> changes</> : <>Confirm & <em>link</em> the case</>)}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#777166]">{step === 1 ? (isEdit ? "Update the case record's core details." : 'Create the case record before evidence enters the intelligence ledger.') : step === 2 ? 'Attach an FIR or supporting evidence file for extraction and review.' : step === 3 ? 'Cross-reference automated annotations before they are added to the master graph.' : (isEdit ? 'Review the updated case package before saving it.' : 'Review the case package before publishing it to the investigation graph.')}</p></section>

      <section className="animate-rise-in-delay rounded-xl bg-white p-5 shadow-md sm:p-7">
        {step === 1 && <CaseInfo form={form} update={update} />}
        {step === 2 && <UploadDossier dossier={dossier} setDossier={setDossier} />}
        {step === 3 && <ReviewExtracted form={form} update={update} isEdit={isEdit} />}
        {step === 4 && <ConfirmLink form={form} dossier={dossier} isEdit={isEdit} />}
      </section>

      <div className="mt-6 flex flex-col justify-between gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row">
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ece8e1] px-4 py-2.5 text-sm font-medium transition hover:bg-[#e5e0d8]" onClick={() => step === 1 ? onExit() : setStep((current) => current - 1)}><ArrowLeft className="size-4" /> {step === 1 ? (isEdit ? 'Cancel' : 'Cancel case') : 'Back'}</button>
        <div className="flex flex-col-reverse gap-2 sm:flex-row"><button className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm text-[#666052] transition hover:text-[#171511]" onClick={() => setSaved(true)}><Save className="size-4" /> {saved ? 'Draft saved' : 'Save draft'}</button><button disabled={!canContinue} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#262626] disabled:cursor-not-allowed disabled:opacity-40" onClick={next}>{step === 4 ? (isEdit ? 'Save changes' : 'Link to graph') : 'Continue'} {step === 4 ? <Check className="size-4" /> : <ArrowRight className="size-4" />}</button></div>
      </div>
      {saved && <p className="mt-3 text-center text-xs text-[#777166]">Draft saved locally for this session.</p>}
    </main>
  </div>
}

function Progress({ step }) {
  return <div className="mb-8 rounded-xl bg-white p-4 shadow-sm"><div className="mb-4 flex justify-between font-mono text-[10px] uppercase tracking-wider text-[#777166]"><span>Step {String(step).padStart(2, '0')} of 04 // {stepLabels[step - 1]}</span><span className="hidden sm:inline"><i className="mr-1 inline-block size-1.5 rounded-full bg-[#c08a2e]" />Case workflow</span></div><div className="relative grid grid-cols-4 before:absolute before:left-[12%] before:right-[12%] before:top-4 before:h-px before:bg-[#d4cebf]"><i className="absolute left-[12%] top-4 h-px bg-[#111] transition-all duration-500" style={{ width: `${Math.max(0, (step - 1) * 25.33)}%` }} />{stepLabels.map((label, index) => { const number = index + 1; const finished = number < step; const active = number === step; return <div key={label} className="relative z-10 text-center"><span className={`mx-auto grid size-8 place-items-center rounded-full text-xs ${finished || active ? 'bg-[#111] text-white' : 'bg-[#ece8e1] text-[#777166]'}`}>{finished ? <Check className="size-4" /> : number}</span><p className={`mt-2 text-[10px] font-medium sm:text-xs ${active ? 'text-[#171511]' : 'text-[#777166]'}`}>{label}</p></div> })}</div></div>
}

function CaseInfo({ form, update }) {
  return <div><SectionTitle icon={FileText} title="Case information" text="Add the core details used to open the investigation record." /><div className="grid gap-5 sm:grid-cols-2"><Input label="Case title" value={form.title} placeholder="e.g. Operation Silver Tide" onChange={(value) => update('title', value)} /><Input label="Primary target / subject" value={form.subject} placeholder="e.g. Full name" onChange={(value) => update('subject', value)} /><Input label="Case identifier" value={form.caseId} mono placeholder="CAS-YYYY-NNNN" onChange={(value) => update('caseId', value)} /><label className="block"><span className="mb-2 block text-xs font-semibold">Priority</span><select value={form.priority} onChange={(event) => update('priority', event.target.value)} className="h-11 w-full rounded-lg bg-[#faf7f2] px-3 text-sm outline-none transition focus:bg-white focus:ring-1 focus:ring-[#171511]"><option>High</option><option>Medium</option><option>Low</option></select></label></div></div>
}

function UploadDossier({ dossier, setDossier }) {
  return <div><SectionTitle icon={FolderUp} title="Evidence dossier" text="Attach a PDF, image, or text record. It will be shown for review in the next step." /><label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#c9c2b5] bg-[#faf7f2] p-6 text-center transition hover:border-[#171511] hover:bg-[#f5f1ea]"><Upload className="size-8 text-[#846019]" /><p className="mt-4 text-sm font-semibold">{dossier ? dossier.name : 'Choose a dossier file'}</p><p className="mt-1 text-xs text-[#777166]">PDF, image, or text document · files remain local in this demo</p><input className="sr-only" type="file" accept=".pdf,image/*,.txt" onChange={(event) => setDossier(event.target.files?.[0] || null)} /></label>{dossier ? <p className="mt-4 flex items-center gap-2 rounded-lg bg-[#f4ead8] p-3 text-xs text-[#6e4f14]"><ShieldCheck className="size-4" /> {dossier.name} is ready for extraction.</p> : <p className="mt-4 text-xs text-[#777166]">No file selected. You can still continue without one.</p>}</div>
}

function ReviewExtracted({ form, update, isEdit }) {
  return <div><SectionTitle icon={Sparkles} title="Extracted entities & metadata" text={isEdit ? "Review or correct this case's recorded fields." : 'Review the proposed values and correct any uncertainty before publishing.'} /><div className="space-y-4">{extractedFieldMeta.map(([label, key], index) => <label key={key} className="block rounded-lg bg-[#faf7f2] p-4"><span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>{label}</span>{!isEdit && <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-[#777166]"><Sparkles className="mr-1 inline size-3 text-[#c08a2e]" />{98 - index * 2}% confidence</span>}</span><input value={form[key]} onChange={(event) => update(key, event.target.value)} placeholder="Not yet provided" className="h-10 w-full rounded-lg bg-white px-3 text-sm outline-none ring-1 ring-[#e5e0d8] transition focus:ring-[#171511]" /></label>)}</div></div>
}

function ConfirmLink({ form, dossier, isEdit }) {
  return <div><SectionTitle icon={ShieldCheck} title="Ready to link" text={isEdit ? 'Confirm the updated case package before saving.' : 'Confirm the final case package before it becomes part of the intelligence graph.'} /><div className="grid gap-3 sm:grid-cols-2"><Summary label="Case" value={`${form.caseId} · ${form.title}`} /><Summary label="Primary subject" value={form.subject} /><Summary label="Priority" value={`${form.priority} risk`} /><Summary label="Evidence" value={dossier?.name || 'No file attached'} /></div><p className="mt-5 flex gap-2 rounded-lg bg-[#faf7f2] p-4 text-xs leading-5 text-[#666052]"><ShieldCheck className="size-4 shrink-0 text-[#846019]" />{isEdit ? 'Updating this case record and its audit log entry.' : "Linking this case, its supporting evidence reference, and verified entities in the audit log."}</p></div>
}

function SectionTitle({ icon: Icon, title, text }) { return <div className="mb-6"><span className="grid size-9 place-items-center rounded-lg bg-[#ece8e1]"><Icon className="size-5 text-[#846019]" /></span><h2 className="mt-3 font-serif text-2xl">{title}</h2><p className="mt-1 text-sm text-[#777166]">{text}</p></div> }
function Input({ label, value, mono, placeholder, onChange }) { return <label className="block"><span className="mb-2 block text-xs font-semibold">{label}</span><input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={`h-11 w-full rounded-lg bg-[#faf7f2] px-3 text-sm outline-none transition focus:bg-white focus:ring-1 focus:ring-[#171511] ${mono ? 'font-mono text-xs' : ''}`} /></label> }
function Summary({ label, value }) { return <div className="rounded-lg bg-[#faf7f2] p-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8578]">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div> }
