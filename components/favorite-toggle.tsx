"use client"

type Props = {
  active: boolean
  onToggle: () => void
  size?: number
  label?: string
}

export default function FavoriteToggle({ active, onToggle, size = 22, label = "Toggle favorite" }: Props) {
  return (
    <button
      aria-pressed={active}
      aria-label={label}
      onClick={onToggle}
      className="text-rose-500 transition-colors hover:text-rose-600"
      title={label}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 21s-6-4.35-9-7.32C1.2 12.92 1 11.7 1 10.44 1 7.5 3.41 5 6.3 5c1.62 0 3.09.76 4.04 1.95C11.61 5.76 13.08 5 14.7 5 17.59 5 20 7.5 20 10.44c0 1.26-.2 2.48-2 3.24C18 16.65 12 21 12 21z" />
      </svg>
    </button>
  )
}
