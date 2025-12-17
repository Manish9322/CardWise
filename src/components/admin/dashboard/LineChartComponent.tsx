"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Jan", questions: Math.floor(Math.random() * 20) + 5 },
  { name: "Feb", questions: Math.floor(Math.random() * 20) + 5 },
  { name: "Mar", questions: Math.floor(Math.random() * 20) + 5 },
  { name: "Apr", questions: Math.floor(Math.random() * 20) + 5 },
  { name: "May", questions: Math.floor(Math.random() * 20) + 5 },
  { name: "Jun", questions: Math.floor(Math.random() * 20) + 5 },
  { name: "Jul", questions: Math.floor(Math.random() * 20) + 15 },
  { name: "Aug", questions: Math.floor(Math.random() * 20) + 15 },
  { name: "Sep", questions: Math.floor(Math.random() * 20) + 15 },
  { name: "Oct", questions: Math.floor(Math.random() * 20) + 15 },
  { name: "Nov", questions: Math.floor(Math.random() * 20) + 25 },
  { name: "Dec", questions: Math.floor(Math.random() * 20) + 25 },
]

export function LineChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
            contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))' 
            }}
        />
        <Line 
            type="monotone" 
            dataKey="questions" 
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4, fill: 'hsl(var(--primary))' }}
            activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
