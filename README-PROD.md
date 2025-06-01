# Guide de déploiement en production

Ce document explique comment tester et déployer l'application en mode production.

## 1. Configuration des variables d'environnement

### Configuration manuelle

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```
# Votre clé API OpenAI
OPENAI_API_KEY=votre_cle_api_openai_ici

# Variables d'environnement pour la production
NODE_ENV=production

# Désactiver la télémétrie Next.js
NEXT_TELEMETRY_DISABLED=1
```

### Configuration automatique sur Netlify

L'application est configurée pour détecter automatiquement si la variable d'environnement OPENAI_API_KEY est manquante lors du déploiement. Dans ce cas, le processus de build affichera des instructions pour configurer cette variable.

Pour permettre la configuration automatique :

1. Ajoutez ces variables d'environnement dans les paramètres de votre site Netlify :
   - `NETLIFY_API_KEY` : Votre clé API Netlify (pour l'automatisation)
   - `SITE_ID` : L'identifiant de votre site Netlify

2. Le script de build exécutera automatiquement la vérification et la configuration.

3. Vous pouvez également déclencher la configuration manuellement en visitant l'endpoint :
   ```
   https://votre-site.netlify.app/api/setup-env
   ```

## 2. Test local en mode production

Pour tester l'application en mode production sur votre machine locale :

```bash
# Construire l'application en mode production
npm run build

# Démarrer le serveur en mode production
npm run start
```

Votre application sera disponible sur http://localhost:3000

## 3. Déploiement sur Netlify

### Méthode automatique (recommandée)

1. Connectez votre dépôt GitHub à Netlify
2. Configurez les variables d'environnement dans l'interface Netlify :
   - `OPENAI_API_KEY` : Votre clé API OpenAI
   - `NODE_ENV` : production
   - `NEXT_TELEMETRY_DISABLED` : 1

### Méthode manuelle

1. Construisez l'application en local :
   ```bash
   npm run build
   ```

2. Déployez le dossier `.next` sur Netlify en utilisant l'interface glisser-déposer ou la CLI Netlify.

## 4. Fonctionnalités de déploiement automatisé

L'application est configurée avec plusieurs fonctionnalités d'automatisation pour Netlify :

### Health Check

Un endpoint `/api/health` est disponible pour vérifier l'état de l'application. Il fournit des informations sur :
- L'état général de l'application
- La disponibilité des services externes (OpenAI)
- La configuration des variables d'environnement

Exemple d'utilisation :
```bash
curl https://votre-site.netlify.app/api/health
```

### Vérifications post-déploiement

Après chaque déploiement, un script automatique vérifie :
- L'accessibilité de la page d'accueil
- Le fonctionnement de l'API
- La présence des variables d'environnement essentielles

Les résultats sont disponibles dans les logs de déploiement Netlify.

### Contextes de déploiement

La configuration prend en charge différents contextes de déploiement :
- `production` : pour la branche principale
- `deploy-preview` : pour les pull requests
- `branch-deploy` : pour les autres branches

### Optimisations automatiques

Le déploiement inclut automatiquement :
- Minification du CSS et JavaScript
- Compression des images
- Cache optimisé pour les ressources statiques
- En-têtes de sécurité
- Redirections HTTPS

## 5. Vérifications post-déploiement

Après le déploiement, vérifiez les points suivants :

- Fonctionnalité de recherche d'entreprises
- Affichage correct des messages et des formulaires
- Temps de réponse de l'API
- Gestion des erreurs (testez avec une requête incorrecte)
- En-têtes de sécurité (utilisez [Security Headers](https://securityheaders.com/) pour vérifier)

## 6. Surveillance et maintenance

- Surveillez les erreurs dans la console Netlify
- Vérifiez régulièrement l'endpoint `/api/health`
- Configurez des alertes pour les erreurs 500
- Mettez à jour régulièrement les dépendances

## 7. Résolution des problèmes courants

### Erreur de connexion à l'API OpenAI

Vérifiez que votre clé API est correctement configurée dans les variables d'environnement.
Vous pouvez utiliser l'endpoint `/api/setup-env` pour diagnostiquer et résoudre les problèmes de configuration.

### Problèmes de CSP (Content Security Policy)

Si certaines ressources ne se chargent pas correctement, vérifiez la politique CSP dans `src/middleware.ts`.

### Erreurs 404 ou 500

Vérifiez les journaux Netlify pour identifier la source du problème.

### Build Failed

Si le build échoue, vérifiez :
1. La présence de toutes les dépendances
2. La compatibilité des versions des packages
3. Les erreurs de syntaxe dans le code

---

Pour toute assistance supplémentaire, consultez la documentation officielle de [Next.js](https://nextjs.org/docs/deployment) et [Netlify](https://docs.netlify.com/). 