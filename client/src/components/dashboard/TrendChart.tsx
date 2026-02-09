import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendData } from '../../types/stats';

interface TrendChartProps {
  data: TrendData[];
}

export default function TrendChart({ data }: TrendChartProps) {
  if (data.length === 0) return <p style={{ color: '#64748b' }}>No data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Applications" />
      </BarChart>
    </ResponsiveContainer>
  );
}
