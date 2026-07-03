# Documentation : Génération de Spots Publicitaires IA pour Tidjob-Lokal

Cette documentation a pour but de vous fournir les bases, les structures de requêtes (prompts) et la méthodologie pour générer des publicités pour les réseaux sociaux (TikTok, Instagram Reels, Facebook Ads) via des intelligences artificielles pour l'application **Tidjob-Lokal**.

---

## 1. L'Identité de Tidjob-Lokal (À injecter dans vos prompts)

Pour que l'IA comprenne bien votre marque, vous devez systématiquement lui rappeler le contexte de l'application.

*   **Le concept :** Une application locale (format marketplace) de mise en relation entre des particuliers ayant besoin d'un service (Jardinage, Ménage, Bricolage, Garde d'enfant, Covoiturage, Beauté, Cuisine) et des prestataires qualifiés ou indépendants à proximité.
*   **Double Cible :**
    *   *Les Clients (B2C) :* Personnes débordées, familles recherchant une solution rapide, fiable et locale. (Mot-clé : Gain de temps, Confiance, Proximité)
    *   *Les Prestataires (Providers) :* Auto-entrepreneurs, étudiants ou travailleurs cherchant à arrondir leurs fins de mois avec des missions locales. (Mot-clé : Liberté, Revenus complémentaires, Flexibilité)
*   **Ton de la marque :** Dynamique, moderne, de confiance, chaleureux et orienté solution. L'esthétique (si générée en UI) doit être "premium moderne, glassmorphism, vibrant".

---

## 2. Stack Technique IA Recommandée

*   **Génération de Scripts (Texte) :** ChatGPT (GPT-4) ou Claude 3.5 Sonnet.
*   **Génération d'Images (Miniatures, Facebook Ads, Carrousels) :** Midjourney V6 ou DALL-E 3.
*   **Génération de Vidéos (B-rolls, plans d'illustration) :** RunwayML (Gen-2 / Gen-3), Pika Labs, ou Luma Dream Machine.
*   **Génération d'Avatars / UGC (User Generated Content) :** HeyGen ou ElevenLabs (pour les voix-off très réalistes).

---

## 3. Prompts pour Générer les Scripts Vidéos (ChatGPT / Claude)

Pour les réseaux (TikTok, Reels, Shorts), le format doit être vertical (9:16) et très court (entre 15 et 30 secondes). La structure marketing idéale est le **Hook (Accroche) -> Problème -> Solution (Tidjob-Lokal) -> Call To Action**.

### Prompt : Trouver des Clients (Exemple pour le Bricolage)
```text
Agis en tant qu'expert en marketing digital spécialisé sur TikTok. 
Rédige un script vidéo de 20 secondes pour l'application "Tidjob-Lokal", une app locale qui permet de trouver des prestataires de confiance en quelques clics. 

Cible : Les personnes qui ont un meuble IKEA à monter ou une étagère à fixer mais qui n'ont ni le temps ni les outils.
Structure attendue :
1. Hook visuel et audio (0-3s) : Très dynamique pour capter l'attention.
2. Agitation du problème (3-8s) : Le stress du bricolage non terminé.
3. Solution (8-15s) : L'utilisation de Tidjob-Lokal (interface, recherche, réservation d'un expert "bricolage").
4. Call To Action (15-20s) : Télécharger l'application.

Fournis un tableau avec deux colonnes : "Visuel à l'écran" et "Voix-off (Texte)". Le ton doit être humoristique, naturel (style UGC) et très rapide.
```

### Prompt : Attirer des Prestataires (Acquisition B2B / Freelances)
```text
Agis en tant que media buyer spécialiste Instagram Reels. 
Rédige un script de 15 secondes pour "Tidjob-Lokal" pour recruter des "Providers" (prestataires) dans les domaines du ménage, du jardinage ou de la garde d'enfants. 

L'angle : "Tu as du temps libre ? Transforme-le en argent facilement près de chez toi." 
Le ton doit être très motivant (Empowerment), simple, et montrer la liberté financière. Inclus les colonnes 'Visuel' et 'Voix-off texte'.
```

---

## 4. Prompts pour la Génération Visuelle (Midjourney / RunwayML)

Lorsque vous avez besoin de visuels pour vos publicités (Facebook Ads statiques, miniatures, ou plans vidéos pour HeyGen).

> [!TIP]
> **Formule magique Midjourney pour de la publicité lifestyle :** `[Sujet principal en action] + [Émotion/Contexte] + [Type de plan/Caméra] + [Éclairage] + [Style/Rendu] --ar [Format]`

### Image : Publicité pour Service de Ménage (Facebook / Instagram Post)
```text
/imagine prompt: A split screen image. Left side: a very messy and chaotic living room, dark lighting, stressful mood. Right side: the same living room, bright, sparkling clean, sunlight coming through the window, a happy modern family relaxing on the sofa. Cinematic lighting, photorealistic, 8k, shot on 35mm lens, highly detailed, advertising style --ar 1:1 --v 6.0
```

### Image : Prestataire Heureux (Acquisition Provider)
```text
/imagine prompt: A young trendy man wearing a neat gardening apron, standing in a sunny beautiful suburban garden, holding a smartphone. He is looking at the smartphone screen and smiling broadly, showing a successful notification. Bright daylight, positive mood, shallow depth of field, blurred background, ultra realistic photography, advertising corporate style, 4k --ar 4:5 --v 6.0
```

### Vidéo (Runway Gen-3 ou Luma)
Prenez les images générées par Midjourney (ci-dessus) et utilisez un prompt text-to-video / image-to-video pour créer un mouvement subtil :
```text
Camera slowly zooming in on the man's face, a gentle warm breeze moving the leaves in the background, he looks up from his phone and gives a confident smile to the camera. Photorealistic motion.
```

---

## 5. Prompts pour Création d'Avatar type UGC (HeyGen)

Si vous n'avez pas d'acteurs, l'UGC (User Generated Content) généré par IA est extrêmement performant sur TikTok et Instagram.

1. **Choisissez un Avatar** sur HeyGen (jeune, décontracté, tenant un téléphone si possible).
2. **Choisissez une voix** chaleureuse et énergique (ex: voix française "Antonin" ou "Léa").
3. **Collez le texte généré par ChatGPT** dans la partie script.

**Exemple de texte à faire lire par l'Avatar (Angle Client - Beauté/Coiffure) :**
> "Arrêtez de slider ! (pause courte) Je vous donne mon petit secret... J'avais un mariage ce week-end et mon coiffeur m'a annulé à la dernière minute. L'enfer ! (geste de la main). J'ai téléchargé l'appli Tidjob-Lokal, j'ai sélectionné la catégorie Beauté, et en 10 minutes j'avais trouvé une coiffeuse incroyable à deux rues de chez moi ! C'est super sécurisé, les profils sont notés, et les prix sont transparents. Si vous êtes dans la galère ou que vous voulez juste vous faire chouchouter à domicile, téléchargez Tidjob-Lokal, le lien est dans la bio !"

---

## 6. Bonnes Pratiques pour l'App Tidjob-Lokal

> [!IMPORTANT]
> - **L'intégration de l'UI :** L'IA ne peut pas générer l'interface de VOTRE application. Pensez à incruster dans vos vidéos (au montage via CapCut par exemple) des **véritables captures d'écran (screen records)** de l'app Tidjob (l'écran de lancement, le Dashboard, ou la sélection de prestataires) par-dessus la vidéo de l'IA pour prouver que l'application existe réellement.
> - **Les catégories précises :** Adaptez toujours les prompts en citant vos vraies rubriques (Jardinage, Ménage, Cours, Bricolage, Covoiturage, Beauté, Cuisine).
> - **L'ancrage local :** Ajoutez toujours dans vos vidéos des références à la proximité géographique (ex: "à moins de 5 km de chez vous", "les pros de votre quartier").
