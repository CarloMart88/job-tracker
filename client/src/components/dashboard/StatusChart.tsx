import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { STATUS_COLORS } from '../../utils/statusColors';
import { ApplicationStatus } from '../../types/application';

interface StatusChartProps {
  data: { status: string; count: number }[];
}

export default function StatusChart({ data }: StatusChartProps) {
  if (data.length === 0) return <p style={{ color: '#64748b' }}>No data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={50}
          paddingAngle={3}
        >
          {data.map((entry) => (
            <Cell
              key={entry.status}
              fill={STATUS_COLORS[entry.status as ApplicationStatus] || '#94a3b8'}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
