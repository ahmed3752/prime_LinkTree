'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function AnalyticsChart({ data }: { data: any[] }) {
  // If we have literally 0 views over 7 days, it's flat
  const hasData = data.some(d => d.views > 0 || d.clicks > 0)

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Analytics</CardTitle>
        <CardDescription>Views and clicks over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#888' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#888' }} 
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                  labelStyle={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  name="Profile Views"
                />
                <Area 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorClicks)" 
                  name="Total Clicks"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[250px] w-full mt-4 flex flex-col items-center justify-center border border-dashed rounded-xl bg-muted/20">
            <p className="text-muted-foreground text-sm">No traffic data yet.</p>
            <p className="text-muted-foreground text-xs mt-1">Share your link to generate analytics!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
