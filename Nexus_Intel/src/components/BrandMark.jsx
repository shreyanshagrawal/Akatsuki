import { Network } from 'lucide-react'

export function BrandMark({ compact = false }) {
  return (
    <div className={compact ? 'grid size-9 place-items-center rounded-xl border border-[#e5e0d8] bg-[#f5f1ea]' : 'grid size-12 place-items-center rounded-[14px] border border-[#e5e0d8] bg-[#f5f1ea]'}>
      <Network className={compact ? 'size-4 text-[#161513]' : 'size-5 text-[#161513]'} strokeWidth={1.75} />
    </div>
  )
}
