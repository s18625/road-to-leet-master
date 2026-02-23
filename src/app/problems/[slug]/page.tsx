import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import ProblemActions from "@/components/problem-actions";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const problem = await prisma.problem.findUnique({
    where: { slug },
    include: {
      tags: true,
    },
  });

  if (!problem) {
    notFound();
  }

  let userProgress = null;
  if (session?.user) {
    userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_problemId: {
          userId: (session.user as any).id,
          problemId: problem.id,
        },
      },
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/problems" className="text-blue-600 hover:underline text-sm">
          ← Back to problems
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">
            {problem.leetcodeId}. {problem.title}
          </h1>

          <div className="flex gap-2 mb-6">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {problem.difficulty}
            </span>
            {problem.tags.map(tag => (
              <span key={tag.id} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {tag.name}
              </span>
            ))}
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-gray-600">
              This problem metadata was imported from LeetCode. You can view the full description and solve it directly on LeetCode using the link below.
            </p>
          </div>

          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Solve on LeetCode <ExternalLink size={18} />
          </a>
        </div>

        <div className="space-y-6">
          {session?.user ? (
            <ProblemActions
              problemId={problem.id}
              initialStatus={userProgress?.status}
            />
          ) : (
            <div className="p-6 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
              <p className="text-sm">
                <Link href="/login" className="font-bold underline">Log in</Link> to track your progress on this problem.
              </p>
            </div>
          )}

          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold mb-3">Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Acceptance Rate</span>
                <span>{problem.acceptanceRate?.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Likes</span>
                <span>{problem.likes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dislikes</span>
                <span>{problem.dislikes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
