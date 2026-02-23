'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProblemActions({ problemId, initialStatus }: { problemId: string, initialStatus?: string }) {
  const [status, setStatus] = useState(initialStatus || 'todo');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/me/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold">Update Progress</h3>
      <div className="flex gap-2">
        <button
          onClick={() => updateStatus('todo')}
          disabled={loading || status === 'todo'}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
            status === 'todo' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todo
        </button>
        <button
          onClick={() => updateStatus('attempted')}
          disabled={loading || status === 'attempted'}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
            status === 'attempted' ? 'bg-yellow-200 text-yellow-800' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
          }`}
        >
          Attempted
        </button>
        <button
          onClick={() => updateStatus('solved')}
          disabled={loading || status === 'solved'}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
            status === 'solved' ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
        >
          Solved
        </button>
      </div>
      {loading && <p className="text-xs text-gray-400 text-center">Updating...</p>}
    </div>
  );
}
