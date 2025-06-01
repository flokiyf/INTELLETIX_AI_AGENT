#!/bin/bash

# Script exécuté pendant le build Netlify

echo "🚀 Démarrage du script de build personnalisé..."

# Installer les dépendances des fonctions Netlify
echo "📦 Installation des dépendances des fonctions..."
cd netlify/functions
npm install

# Vérifier la présence de la clé API OpenAI
if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️ La variable d'environnement OPENAI_API_KEY n'est pas définie."
  echo "💡 Suggestions:"
  echo "  1. Configurez OPENAI_API_KEY dans les variables d'environnement de Netlify"
  echo "  2. Ou, utilisez la fonction setup-env pour la configuration automatique"
  
  # Essayer de configurer automatiquement
  echo "🔄 Tentative de configuration automatique..."
  node setup-env.js
else
  echo "✅ Variable d'environnement OPENAI_API_KEY trouvée."
fi

# Vérification post-configuration
node post-build.js

echo "✅ Script de build personnalisé terminé." 