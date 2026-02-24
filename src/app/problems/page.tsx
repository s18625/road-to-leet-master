import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const difficulty = params.difficulty as string | undefined;
  const tag = params.tag as string | undefined;

  const problems = await prisma.problem.findMany({
    where: {
      difficulty: difficulty || undefined,
      tags: tag ? { some: { name: tag } } : undefined,
    },
    include: {
      tags: true,
    },
    take: 50,
    orderBy: { leetcodeId: 'asc' },
  });

  const tags = await prisma.tag.findMany({
    take: 20,
    orderBy: { problems: { _count: 'desc' } }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Problems</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Difficulty</h3>
            <div className="flex flex-col gap-2">
              <Link href="/problems" className={`text-sm ${!difficulty ? 'font-bold' : ''}`}>All</Link>
              <Link href="/problems?difficulty=Easy" className={`text-sm ${difficulty === 'Easy' ? 'font-bold text-green-600' : ''}`}>Easy</Link>
              <Link href="/problems?difficulty=Medium" className={`text-sm ${difficulty === 'Medium' ? 'font-bold text-yellow-600' : ''}`}>Medium</Link>
              <Link href="/problems?difficulty=Hard" className={`text-sm ${difficulty === 'Hard' ? 'font-bold text-red-600' : ''}`}>Hard</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <Link
                  key={t.id}
                  href={`/problems?tag=${t.name}`}
                  className={`px-2 py-1 rounded text-xs border ${tag === t.name ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Difficulty</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acceptance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {problems.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <Link href={`/problems/${p.slug}`} className="text-blue-600 font-medium hover:underline">
                      {p.leetcodeId}. {p.title}
                    </Link>
                    <div className="flex gap-1 mt-1">
                      {p.tags.slice(0, 3).map(t => (
                        <span key={t.id} className="text-[10px] text-gray-400">{t.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      p.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      p.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {p.acceptanceRate?.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
