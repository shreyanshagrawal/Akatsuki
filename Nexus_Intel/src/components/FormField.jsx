export function FormField({ label, children, action }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between font-[Inter] text-[13px] font-medium leading-none text-[#171511]">
        {label}
        {action}
      </span>
      {children}
    </label>
  )
}
