export default function Grid({
  min = 192,
  children,
}: {
  min?: number
  children: React.ReactNode
}) {
  return (
    <div
      className="grid justify-items-center gap-y-4"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
      }}
    >
      {children}
    </div>
  )
}
