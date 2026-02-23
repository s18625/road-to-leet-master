import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-blue-600">
          LeetCode Tracker
        </h1>

        <p className="mt-3 text-2xl text-gray-600">
          Master your coding interviews with daily challenges and personalized stats.
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          {session ? (
            <Link
              href="/dashboard"
              className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 bg-white"
            >
              <h3 className="text-2xl font-bold text-gray-800">Go to Dashboard &rarr;</h3>
              <p className="mt-4 text-xl text-gray-500">
                You are logged in as {session.user?.name}.
              </p>
            </Link>
          ) : (
            <Link
              href="/login"
              className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 bg-white"
            >
              <h3 className="text-2xl font-bold text-gray-800">Get Started &rarr;</h3>
              <p className="mt-4 text-xl text-gray-500">
                Log in with Google to start tracking your progress.
              </p>
            </Link>
          )}

          <Link
            href="/problems"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 bg-white"
          >
            <h3 className="text-2xl font-bold text-gray-800">Browse Problems &rarr;</h3>
            <p className="mt-4 text-xl text-gray-500">
              Explore our database of LeetCode problems.
            </p>
          </Link>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t bg-white text-gray-500">
        Powered by Next.js & Prisma
      </footer>
    </div>
  );
}
