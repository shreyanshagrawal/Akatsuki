import { useState } from 'react'
import { AlertCircle, CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react'
import { DEMO_CREDENTIALS } from '../authConfig'
import { BrandMark } from './BrandMark'
import { FormField } from './FormField'
import { PasswordInput } from './PasswordInput'

const agencies = [
  'Central Bureau of Investigation (CBI)',
  'National Investigation Agency (NIA)',
  'State Cyber Intelligence Division',
  'Financial Intelligence Unit',
]

export function LoginPortal({ onAuthenticate }) {
  const [agency, setAgency] = useState(agencies[0])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  function submit(event) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')
    window.setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        onAuthenticate({ agency, email: DEMO_CREDENTIALS.email })
        return
      }
      setStatus('error')
      setMessage('Credentials were not recognized. Use the demo credentials shown below.')
    }, 600)
  }

  function useDemoCredentials() {
    setEmail(DEMO_CREDENTIALS.email)
    setPassword(DEMO_CREDENTIALS.password)
    setStatus('idle')
    setMessage('Demo credentials loaded. Select Sign In to continue.')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f1ea] text-[#171511] selection:bg-[#171511] selection:text-white">
      <header className="flex items-center justify-between px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-[#8a8578]">
        <div className="flex items-center gap-2 text-[#171511]"><span className="size-1.5 rounded-full bg-emerald-600" />Node: LNX-NOD-9402</div>
        <div className="hidden items-center gap-3 sm:flex"><span>Restricted access</span><span className="text-[#d4cebf]">|</span><span>Secure portal</span></div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[440px]">
          <section aria-labelledby="login-title" className="rounded-2xl border border-[#e5e0d8] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] sm:p-10">
            <div className="mb-6 flex flex-col items-center gap-3">
              <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full border border-[#171511] px-2 font-[Inter] text-xs font-medium"><ShieldCheck className="size-[15px]" /> Secure Node // LNX-9402</span>
              <BrandMark />
            </div>
            <div className="mb-8 text-center">
              <h1 id="login-title" className="text-[28px] font-bold leading-[34px] tracking-tight">Welcome to <em className="font-serif text-[31px] font-normal">investigations</em></h1>
              <p className="mt-3 text-sm leading-[22px] text-[#8a8578]">Secure investigator access</p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
              <FormField label="Jurisdiction / Agency">
                <select className="h-11 w-full cursor-pointer rounded-[10px] border border-[#e5e0d8] bg-white px-3.5 text-sm outline-none transition focus:border-[#171511] focus:ring-1 focus:ring-[#171511]" value={agency} onChange={(event) => setAgency(event.target.value)}>
                  {agencies.map((item) => <option key={item}>{item}</option>)}
                </select>
              </FormField>
              <FormField label="Official Email">
                <input className="h-11 w-full rounded-[10px] border border-[#e5e0d8] bg-white px-3.5 text-sm outline-none transition placeholder:text-[#8a8578] focus:border-[#171511] focus:ring-1 focus:ring-[#171511]" onChange={(event) => setEmail(event.target.value)} placeholder="you@department.gov.in" type="email" value={email} />
              </FormField>
              <FormField label="Access Key / Password" action={<button className="font-normal text-[#8a8578] hover:text-[#171511]" onClick={() => setMessage('Contact your jurisdiction security administrator or nodal desk to reset access.')} type="button">Forgot password?</button>}>
                <PasswordInput value={password} onChange={setPassword} />
              </FormField>

              {message && <p className={`flex gap-2 rounded-lg px-3 py-2 text-xs leading-5 ${status === 'error' ? 'bg-[#fbeaea] text-[#a52620]' : 'bg-[#f5f1ea] text-[#5c574d]'}`}>{status === 'error' ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}{message}</p>}

              <button className="mt-1 flex h-[46px] w-full items-center justify-center rounded-full bg-[#111] text-sm font-medium text-white shadow-sm transition hover:bg-[#262626] active:scale-[.99] disabled:cursor-wait disabled:opacity-75" disabled={status === 'loading'} type="submit">
                {status === 'loading' ? 'Signing In…' : 'Sign In'}
              </button>
              <div className="relative flex items-center justify-center"><span className="w-full border-t border-[#e5e0d8]" /><span className="absolute bg-white px-3 font-[Inter] text-xs text-[#8a8578]">or</span></div>
              <button className="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-full border border-[#e5e0d8] bg-white text-sm font-medium transition hover:border-[#171511] hover:bg-[#faf8f5] active:scale-[.99]" onClick={useDemoCredentials} type="button"><ShieldCheck className="size-[19px]" /> Continue with Government SSO</button>
            </form>
          </section>

          <aside className="mt-4 rounded-xl border border-[#e5e0d8] bg-[#faf7f2] p-3.5 text-xs text-[#625d53]" aria-label="Demo login credentials">
            <div className="mb-2 flex items-center gap-1.5 font-semibold text-[#171511]"><LockKeyhole className="size-3.5" /> Demo access only</div>
            <p>Use <code className="font-mono text-[11px] text-[#171511]">investigator.roy@cbi.gov.in</code> / <code className="font-mono text-[11px] text-[#171511]">Nexus@2026</code></p>
          </aside>
          <div className="mt-7 text-center"><p className="flex items-center justify-center gap-1.5 text-[13px] text-[#8a8578]"><LockKeyhole className="size-[15px]" />This session is logged and monitored for audit compliance.</p><p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[#8a8578]">SEC Verified • CJIS Compliant • 18 U.S.C. § 1030 Applies</p></div>
        </div>
      </main>
      <footer className="py-4 text-center font-[Inter] text-xs text-[#8a8578]">Law Enforcement Criminal Network Intelligence System</footer>
    </div>
  )
}
