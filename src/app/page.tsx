import ChatBot from '@/components/ChatBot';
import Debug from '@/components/Debug';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Sudbury Business Directory</h1>
        <div className="max-w-3xl mx-auto">
          <ChatBot />
        </div>
      </div>
      <Debug />
    </main>
  );
}
