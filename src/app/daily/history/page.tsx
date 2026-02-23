import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export default async function DailyHistoryPage() {
  const history = await prisma.dailyChallenge.findMany({
    orderBy: { date: 'desc' },
    include: {
      problem: {
        include: {
          tags: true
        }
      }
    },
    take: 30
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Daily Challenge History</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Problem</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Difficulty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium">
                  {format(new Date(item.date), 'MMMM do, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/problems/${item.problem.slug}`} className="text-blue-600 font-medium hover:underline">
                    {item.problem.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    item.problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    item.problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.problem.difficulty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
