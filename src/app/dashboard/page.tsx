import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDailyChallenge } from "@/lib/daily-logic";
import { getUserStats } from "@/lib/stats-logic";
import Link from "next/link";
import StatsCharts from "@/components/stats-charts";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const daily = await getDailyChallenge();
  const stats = await getUserStats(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Daily Challenge */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Daily Challenge</h2>
            <Link href="/daily/history" className="text-sm text-blue-600 hover:underline">View History</Link>
          </div>
          {daily ? (
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">
                {daily.problem.title}
              </h3>
              <div className="flex gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  daily.problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  daily.problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {daily.problem.difficulty}
                </span>
                {daily.problem.tags.map(tag => (
                  <span key={tag.id} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {tag.name}
                  </span>
                ))}
              </div>
              <Link
                href={`/problems/${daily.problem.slug}`}
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Solve Now
              </Link>
            </div>
          ) : (
            <p>No daily challenge available.</p>
          )}
        </div>

        {/* User Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Solved</span>
              <span className="font-bold text-2xl text-green-600">{stats.overview.solved}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Streak</span>
              <span className="font-bold text-2xl text-orange-500">{stats.streak} days</span>
            </div>
            <hr />
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-4">Distribution</h4>
              <StatsCharts difficultyDist={stats.difficultyDist} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Array', 'String', 'Hash Table', 'Dynamic Programming', 'Math', 'Sorting'].map(cat => (
            <Link
              key={cat}
              href={`/categories/${cat}`}
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition border border-gray-200"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
