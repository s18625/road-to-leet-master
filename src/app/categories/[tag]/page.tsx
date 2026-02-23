import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const popular = await prisma.categoryPopular.findMany({
    where: { category: decodedTag },
    orderBy: { score: 'desc' },
    take: 20,
    include: {
      problem: {
        include: {
          tags: true
        }
      }
    }
  });

  if (popular.length === 0) {
    // Check if tag even exists
    const tagExists = await prisma.tag.findUnique({ where: { name: decodedTag } });
    if (!tagExists) notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">Most Popular: {decodedTag}</h1>
      <p className="text-gray-500 mb-8">Top recommended problems based on popularity and scoring.</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rank</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Difficulty</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {popular.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold text-gray-400">
                  #{index + 1}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/problems/${item.problem.slug}`} className="text-blue-600 font-medium hover:underline">
                    {item.problem.leetcodeId}. {item.problem.title}
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
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                  {item.score.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
