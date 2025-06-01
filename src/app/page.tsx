import ChatBot from '@/components/ChatBot';

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      {/* Bannière d'avertissement de mode statique */}
      <div className="bg-amber-50 border-b border-amber-200 p-3 text-center">
        <p className="text-amber-800 font-medium text-sm">
          ℹ️ L'application fonctionne actuellement en <strong>mode statique</strong> sur Netlify pour éviter les erreurs 502
        </p>
      </div>
      
      <ChatBot />
    </main>
  );
}
