import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function PasswordInput({ value, onChange }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        aria-label="Access key or password"
        className="h-11 w-full rounded-[10px] border border-[#e5e0d8] bg-white px-3.5 pr-11 text-sm tracking-wide text-[#171511] outline-none transition placeholder:text-[#8a8578] focus:border-[#171511] focus:ring-1 focus:ring-[#171511]"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter your access key"
        type={visible ? 'text' : 'password'}
        value={value}
      />
      <button
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center text-[#8a8578] transition hover:text-[#171511]"
        onClick={() => setVisible(!visible)}
        type="button"
      >
        {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
      </button>
    </div>
  )
}
