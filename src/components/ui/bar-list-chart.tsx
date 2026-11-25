import { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '#/components/ui/chart'
import { cn } from 'cn'

function BarDetailLabel({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  value,
}: {
  x?: number | string
  y?: number | string
  width?: number | string
  height?: number | string
  value?: string | number
}) {
  if (value == null || value === '') return null

  const boxX = Number(x)
  const boxY = Number(y)
  const boxWidth = Number(width)
  const boxHeight = Number(height)

  return (
    <text
      x={
        (Number.isFinite(boxX) ? boxX : 0) +
        (Number.isFinite(boxWidth) ? boxWidth : 0) +
        8
      }
      y={
        (Number.isFinite(boxY) ? boxY : 0) +
        (Number.isFinite(boxHeight) ? boxHeight : 0) / 2
      }
      fill="#012A5E"
      fontSize={11}
      fontWeight={700}
      dominantBaseline="central"
    >
      {value}
    </text>
  )
}

export interface BarListItem {
  label: string
  value: number
  detail?: string
  color?: string
}

interface BarListChartProps {
  data: BarListItem[]
  name?: string
  color?: string
  max?: number
  labelWidth?: number
  className?: string
  hideLabel?: boolean
}

export function BarListChart({
  data,
  name = 'Value',
  color = '#0267B8',
  max,
  labelWidth = 148,
  className,
  hideLabel = false,
}: BarListChartProps) {
  const chartConfig = {
    value: { label: name, color },
  } satisfies ChartConfig

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(480)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0
      if (next > 0) setContainerWidth(next)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const domainMax = max ?? Math.max(1, ...data.map((item) => item.value), 0)
  const height = hideLabel ? 12 : Math.max(data.length * 36, 48)
  const tight = containerWidth < 420
  const axisWidth = hideLabel
    ? 0
    : tight
      ? Math.min(labelWidth, 84)
      : labelWidth
  const rightMargin = hideLabel ? 0 : tight ? 72 : 96

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      <ChartContainer
        config={chartConfig}
        initialDimension={{ width: hideLabel ? 64 : 480, height }}
        className="aspect-auto w-full"
        style={{ height }}
      >
        <BarChart
          accessibilityLayer
          data={data}
          layout="vertical"
          margin={{
            top: 0,
            right: rightMargin,
            bottom: 0,
            left: 0,
          }}
          barCategoryGap={10}
        >
          <XAxis type="number" hide domain={[0, domainMax]} />
          <YAxis
            type="category"
            dataKey="label"
            hide={hideLabel}
            width={axisWidth}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#012A5E', fontSize: 12, fontWeight: 700 }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, _seriesName, item) => {
                  const row = item?.payload as BarListItem | undefined
                  return (
                    <span className="font-medium text-foreground">
                      {row?.detail ??
                        (typeof value === 'number'
                          ? value.toLocaleString()
                          : String(value))}
                    </span>
                  )
                }}
              />
            }
          />
          <Bar
            dataKey="value"
            radius={8}
            barSize={hideLabel ? 8 : 10}
            minPointSize={2}
            background={{ fill: '#EEF2F7', radius: 8 }}
          >
            {data.map((item) => (
              <Cell
                key={item.label}
                fill={item.color ?? 'var(--color-value)'}
              />
            ))}
            {!hideLabel && (
              <LabelList
                dataKey="detail"
                position="right"
                content={BarDetailLabel}
              />
            )}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}

interface StackedMeterSegment {
  key: string
  label: string
  value: number
  color: string
}

export function StackedMeterChart({
  segments,
  className,
}: {
  segments: StackedMeterSegment[]
  className?: string
}) {
  const chartConfig = Object.fromEntries(
    segments.map((segment) => [
      segment.key,
      { label: segment.label, color: segment.color },
    ]),
  ) satisfies ChartConfig

  const row = {
    name: 'meter',
    ...Object.fromEntries(
      segments.map((segment) => [segment.key, segment.value]),
    ),
  }

  return (
    <ChartContainer
      config={chartConfig}
      initialDimension={{ width: 480, height: 16 }}
      className={cn('aspect-auto h-4 w-full', className)}
    >
      <BarChart
        accessibilityLayer
        data={[row]}
        layout="vertical"
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <XAxis type="number" hide domain={[0, 100]} />
        <YAxis type="category" dataKey="name" hide width={0} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        {segments.map((segment, index) => (
          <Bar
            key={segment.key}
            dataKey={segment.key}
            stackId="meter"
            fill={`var(--color-${segment.key})`}
            barSize={14}
            radius={
              index === 0
                ? [8, 0, 0, 8]
                : index === segments.length - 1
                  ? [0, 8, 8, 0]
                  : 0
            }
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}
