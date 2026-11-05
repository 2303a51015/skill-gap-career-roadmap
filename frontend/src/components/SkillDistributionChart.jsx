import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

export default function SkillDistributionChart({
  matchingCount = 0,
  partialCount = 0,
  missingCount = 0,
  additionalCount = 0
}) {
  const data = [
    { name: 'Matching Skills', value: matchingCount, color: '#16A34A' },
    { name: 'Partial / Bridging', value: partialCount, color: '#D97706' },
    { name: 'Missing / Gaps', value: missingCount, color: '#DC2626' },
    { name: 'Additional in Resume', value: additionalCount, color: '#3B82F6' }
  ].filter((item) => item.value > 0);

  const total = matchingCount + partialCount + missingCount + additionalCount;

  return (
    <div className="dashboard-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-title-bar">
        <h3 className="card-title">
          <PieIcon size={20} color="#06B6D4" />
          Skill Distribution Portfolio
        </h3>
        <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
          {total} Total Skills Analyzed
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 260, width: '100%', position: 'relative' }}>
        {data.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
            No skill distribution data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={88}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem'
                }}
                formatter={(val, name) => [`${val} skills (${Math.round((val / total) * 100)}%)`, name]}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: '0.82rem', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
