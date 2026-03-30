'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">エラーが発生しました</h1>
        <p className="text-gray-500 mb-8">申し訳ございません。予期しないエラーが発生しました。</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors min-h-[48px]"
        >
          もう一度試す
        </button>
      </div>
    </div>
  );
}
