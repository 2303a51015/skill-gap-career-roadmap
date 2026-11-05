import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function CategoryChart({ categories = [] }) {
  // Format data for Recharts Bar Chart
  const chartData = (categories || []).map((cat) => ({
    name: cat.category ? (cat.category.length > 16 ? cat.category.slice(0, 15) + '…' : cat.category) : 'General',
    fullName: cat.category || 'General',
    Matching: cat.matching || 0,
    Partial: cat.partial || 0,
    Missing: cat.missing || 0
  }));

  return (
    <div className="dashboard-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-title-bar">
        <h3 className="card-title">
          <BarChart3 size={20} color="#2563EB" />
          Technical Domain Breakdown
        </h3>
        <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
          Category-Level Competency
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 260, width: '100%' }}>
        {chartData.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
            No category breakdown data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 20, right: 15, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#475569' }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem'
                }}
                formatter={(val, name, item) => [val, `${name}`]}
                labelFormatter={(label, items) => {
                  if (items && items[0]) {
                    return items[0].payload.fullName;
                  }
                  return label;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: '10px' }} />
              <Bar dataKey="Matching" fill="#16A34A" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="Partial" fill="#D97706" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="Missing" fill="#DC2626" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
