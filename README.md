# 🤖 ChatBot IA - Assistant Intelligent

Un chatbot moderne et élégant construit avec Next.js 15, TypeScript et alimenté par l'API OpenAI.

## ✨ Fonctionnalités

- 💬 Interface de chat en temps réel
- 🎨 UI moderne et responsive avec Tailwind CSS
- 🤖 Intégration OpenAI GPT-3.5 Turbo
- ⚡ Next.js 15 avec App Router
- 🔄 Gestion d'état réactif
- 📱 Design mobile-first
- ⏱️ Timestamps des messages avec formatage en français
- 🎯 Gestion d'erreurs robuste
- 🔄 Indicateur de chargement animé

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Clé API OpenAI

### Installation

1. Clonez le repository :
```bash
git clone <votre-repo>
cd chatbot-app
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez votre clé API OpenAI :
```bash
# Le fichier .env.local est déjà configuré avec votre clé
# Vérifiez que le fichier .env.local contient :
# OPENAI_API_KEY=votre_clé_api_ici
```

4. Lancez le serveur de développement :
```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🛠️ Technologies Utilisées

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **OpenAI API** - Intelligence artificielle
- **date-fns** - Gestion et formatage des dates
- **uuid** - Génération d'identifiants uniques

## 📁 Structure du Projet

```
chatbot-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts      # API route pour OpenAI
│   │   ├── page.tsx              # Page principale
│   │   ├── layout.tsx            # Layout de l'application
│   │   └── globals.css           # Styles globaux
│   ├── components/
│   │   ├── ChatBot.tsx           # Composant principal du chat
│   │   ├── ChatMessage.tsx       # Composant message individuel
│   │   └── ChatInput.tsx         # Composant d'entrée de message
│   └── types/
│       └── chat.ts               # Types TypeScript
├── .env.local                    # Variables d'environnement
└── package.json
```

## 🎨 Fonctionnalités de l'Interface

- **Messages en bulles** : Design distinctif pour utilisateur et assistant
- **Avatars** : Emoji utilisateur et robot pour l'assistant
- **Timestamps** : Affichage "il y a X minutes" en français
- **Auto-scroll** : Défilement automatique vers les nouveaux messages
- **Responsive** : S'adapte aux écrans mobiles et desktop
- **Animations** : Transitions fluides et indicateurs de chargement
- **Gestion d'erreurs** : Messages d'erreur clairs et informatifs

## ⚙️ Configuration

### Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
OPENAI_API_KEY=votre_clé_api_openai_ici
```

### Personnalisation

Vous pouvez personnaliser le chatbot en modifiant :

- **Prompt système** : Dans `src/app/api/chat/route.ts`
- **Modèle OpenAI** : Changez `gpt-3.5-turbo` vers `gpt-4` si nécessaire
- **Styles** : Dans les composants avec les classes Tailwind
- **Langue** : Modifiez les textes et la locale date-fns

## 🔧 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting ESLint
```

## 🚀 Déploiement

### Vercel (Recommandé)

1. Pushez votre code sur GitHub
2. Connectez votre repo à Vercel
3. Ajoutez la variable d'environnement `OPENAI_API_KEY`
4. Déployez !

### Autres Plateformes

Ce projet peut être déployé sur toute plateforme supportant Next.js :
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que votre clé API OpenAI est valide
2. Assurez-vous que les variables d'environnement sont correctement configurées
3. Consultez les logs de la console pour les erreurs
4. Ouvrez une issue sur GitHub

---

Développé avec ❤️ et Next.js
