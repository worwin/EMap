import { useMemo, useState } from 'react'
import { arc, pie } from 'd3-shape'
import { motion } from 'framer-motion'

type Wedge = {
  label: string
  value: number
  color: string
}

const wedges: Wedge[] = [
  { label: 'Design', value: 34, color: '#6366f1' },
  { label: 'Build', value: 33, color: '#22c55e' },
  { label: 'Launch', value: 33, color: '#f97316' },
]

function App() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const pieData = useMemo(
    () =>
      pie<Wedge>()
        .sort(null)
        .value((d) => d.value)(wedges),
    []
  )

  const center = 220
  const innerRadius = 88
  const baseOuterRadius = 158
  const expandedOuterRadius = 176

  return (
    <main
      style={{
        minHeight: '100vh',
        margin: 0,
        display: 'grid',
        placeItems: 'center',
        background: 'radial-gradient(circle at top, #1f2937 0%, #030712 70%)',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      }}
    >
      <svg width={440} height={440} viewBox="0 0 440 440" role="img" aria-label="Interactive ring chart">
        <g transform={`translate(${center}, ${center})`}>
          {pieData.map((slice, index) => {
            const isActive = activeIndex === index
            const isDimmed = activeIndex !== null && !isActive
            const ringArc = arc<typeof slice>()
              .innerRadius(innerRadius)
              .outerRadius(isActive ? expandedOuterRadius : baseOuterRadius)
            const labelArc = arc<typeof slice>()
              .innerRadius((innerRadius + baseOuterRadius) / 2)
              .outerRadius((innerRadius + baseOuterRadius) / 2)
            const [labelX, labelY] = labelArc.centroid(slice)

            return (
              <g key={slice.data.label}>
                <motion.path
                  d={ringArc(slice) ?? ''}
                  fill={slice.data.color}
                  stroke="#0b1020"
                  strokeWidth={2}
                  style={{ cursor: 'pointer' }}
                  initial={false}
                  animate={{
                    opacity: isDimmed ? 0.25 : 1,
                    scale: isActive ? 1.02 : 1,
                  }}
                  whileHover={{ scale: activeIndex === null ? 1.03 : undefined }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  onClick={() => setActiveIndex((prev) => (prev === index ? null : index))}
                />
                <motion.text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={20}
                  fontWeight={700}
                  initial={false}
                  animate={{ opacity: isDimmed ? 0.35 : 1 }}
                  transition={{ duration: 0.25 }}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {slice.data.label}
                </motion.text>
              </g>
            )
          })}
        </g>
      </svg>
    </main>
  )
}

export default App
