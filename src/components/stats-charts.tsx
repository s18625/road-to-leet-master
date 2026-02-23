'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface StatsChartsProps {
  difficultyDist: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
}

export default function StatsCharts({ difficultyDist }: StatsChartsProps) {
  const data = [
    { name: 'Easy', value: difficultyDist.Easy, color: '#22c55e' },
    { name: 'Medium', value: difficultyDist.Medium, color: '#eab308' },
    { name: 'Hard', value: difficultyDist.Hard, color: '#ef4444' },
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
        No solved problems to display.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
