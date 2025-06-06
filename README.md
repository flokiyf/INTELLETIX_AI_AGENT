# Sudbury Business Directory

Une application d'annuaire intelligent pour les entreprises de Sudbury, offrant une interface conversationnelle pour trouver facilement des entreprises locales.

## Fonctionnalités

- **Recherche d'entreprises par catégorie** : Restaurants, automobile, services, santé, etc.
- **Recherche par mot-clé** : Trouvez des entreprises selon vos besoins spécifiques
- **Filtres avancés** : Recherche par langues parlées, services offerts, et plus
- **Interface conversationnelle** : Interagissez naturellement avec l'agent pour trouver ce que vous cherchez
- **Formulaires interactifs** : Utilisez des formulaires intégrés pour affiner vos recherches
- **Informations détaillées** : Coordonnées complètes, horaires, services, langues parlées, etc.
- **Design responsive** : Fonctionne parfaitement sur ordinateurs, tablettes et téléphones

## Base de données

L'application contient une base de données locale d'entreprises de Sudbury, couvrant de nombreux domaines :
- Restaurants et alimentation
- Services automobiles (concessionnaires, mécaniciens)
- Services professionnels (immigration, juridique, etc.)
- Beauté et bien-être
- Commerce de détail
- Santé
- Technologie
- Éducation
- Arts et loisirs
- Finance
- Et plus encore...

## Commencer

Suivez ces instructions pour installer et exécuter l'application sur votre environnement local.

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn

### Installation

1. Clonez le dépôt
```bash
git clone https://github.com/votre-nom/sudbury-business-directory.git
cd sudbury-business-directory
```

2. Installez les dépendances
```bash
npm install
# ou
yarn install
```

3. Créez un fichier `.env.local` à la racine du projet et ajoutez votre clé API OpenAI
```
OPENAI_API_KEY=votre_cle_api_openai
```

4. Lancez le serveur de développement
```bash
npm run dev
# ou
yarn dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Technologies utilisées

- [Next.js](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [OpenAI API](https://openai.com/) - Intelligence artificielle
- [JSON](https://www.json.org/) - Base de données locale

## Architecture

- `/src/data` - Base de données JSON des entreprises
- `/src/utils` - Utilitaires pour la recherche et le filtrage
- `/src/components` - Composants React réutilisables
- `/src/app` - Structure de l'application Next.js
- `/src/app/api` - Points d'accès API pour interagir avec la base de données

## Extension de la base de données

Pour ajouter de nouvelles entreprises à la base de données, modifiez le fichier `/src/data/sudbury_businesses.json` en suivant le format existant.

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue pour signaler un bug ou proposer une fonctionnalité.

## Licence

Ce projet est sous licence MIT.

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