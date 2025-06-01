'use client';

import { useState, useEffect } from 'react';

const Debug = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [apiStatus, setApiStatus] = useState<Record<string, { status: string, time: number }>>({});

  // Fonction pour tester les différents points de terminaison
  const testEndpoints = async () => {
    const endpoints = [
      '/.netlify/functions/openai-proxy',
      '/api/chat',
      'https://sudbury-directory-new.netlify.app/.netlify/functions/openai-proxy'
    ];
    
    const testMessage = {
      messages: [{ role: 'user', content: 'test' }]
    };
    
    const results: Record<string, { status: string, time: number }> = {};
    
    for (const endpoint of endpoints) {
      const startTime = Date.now();
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testMessage),
        });
        
        if (response.ok) {
          results[endpoint] = { status: 'OK', time: Date.now() - startTime };
        } else {
          results[endpoint] = { status: `Erreur ${response.status}`, time: Date.now() - startTime };
        }
      } catch (error) {
        results[endpoint] = { status: 'Échec', time: Date.now() - startTime };
      }
    }
    
    setApiStatus(results);
  };

  useEffect(() => {
    // Récupérer des informations sur l'environnement
    const info = {
      url: window.location.href,
      hostname: window.location.hostname,
      origin: window.location.origin,
      userAgent: navigator.userAgent,
      netlify: !!window.location.host.includes('netlify'),
      timestamp: new Date().toISOString()
    };
    
    setDebugInfo(info);
  }, []);

  if (!showDebug) {
    return (
      <button 
        onClick={() => setShowDebug(true)}
        className="fixed bottom-2 right-2 bg-gray-200 text-gray-700 p-1 text-xs rounded-md opacity-50 hover:opacity-100"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 bg-white border border-gray-300 shadow-lg p-4 max-w-md max-h-[80vh] overflow-auto rounded-md z-50">
      <div className="flex justify-between mb-4">
        <h3 className="font-bold">Débogage</h3>
        <button 
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Fermer
        </button>
      </div>
      
      <div className="mb-4">
        <button 
          onClick={testEndpoints}
          className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-600"
        >
          Tester les API
        </button>
      </div>
      
      {Object.keys(apiStatus).length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-sm">Statut des API:</h4>
          <ul className="text-xs space-y-1">
            {Object.entries(apiStatus).map(([endpoint, status]) => (
              <li key={endpoint} className="border-b pb-1">
                <div className="font-mono">{endpoint}</div>
                <div className={`${status.status === 'OK' ? 'text-green-600' : 'text-red-600'}`}>
                  {status.status} ({status.time}ms)
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        <h4 className="font-semibold mb-2 text-sm">Informations:</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-48">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Debug; 