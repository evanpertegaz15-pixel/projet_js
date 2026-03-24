const questions = {
    facile: [{
        id: 1,
        question: "Quel est le but principal d'une attaque de phishing ?",
        options: [
            "Améliorer la sécurité d'un réseau",
            "Augmenter la vitesse de connexion",
            "Endommager un système informatique",
            "Voler des informations personnelles"
        ],
        reponse: 3,
        explication: "Le but principal d'une attaque de phishing est de voler des informations personnelles, comme les identifiants de comptes ou les données bancaires."
    }, {
        id: 2,
        question: "Lequel de ces éléments est un signe courant d'un email de phishing ?",
        options: [
            "Une adresse email officielle",
            "Un expéditeur inconnu",
            "Un message personnalisé",
            "Une signature professionnelle"
        ],
        reponse: 1,
        explication: "Un expéditeur inconnu est un signe courant d'un email de phishing."
    }, {
        id: 3,
        question: "Quel type de lien est souvent utilisé dans les attaques de phishing ?",
        options: [
            "Un lien vers un site d'actualités",
            "Un lien vers un site de confiance",
            "Un lien vers un site malveillant",
            "Un lien vers un site sécurisé"
        ],
        reponse: 2,
        explication: "Les attaques de phishing utilisent souvent des liens vers des sites malveillants."
    }, {
        id: 4,
        question: "Quel est le meilleur moyen de se protéger contre les attaques de phishing ?",
        options: [
            "Cliquer sur tous les liens pour vérifier leur sécurité",
            "Ne jamais ouvrir d'emails",
            "Partager ses informations personnelles uniquement avec des amis",
            "Utiliser un antivirus à jour"
        ],
        reponse: 3,
        explication: "Utiliser un antivirus à jour est un bon moyen de se protéger contre les attaques de phishing."
    }, {
        id: 5,
        question: "Quel mot doit vous alerter dans un message suspect ?",
        options: [
            "Confidentiel",
            "Important",
            "Sécurité",
            "Urgent"
        ],
        reponse: 3,
        explication: "Le mot 'Urgent' est souvent utilisé dans les emails de phishing pour créer une pression et inciter à agir rapidement."
    }, {
        id: 6,
        question: "Quel comportement est risqué lors de la réception d'un email inattendu ?",
        options: [
            "Archiver le message pour plus tard",
            "Cliquer sur un lien sans le vérifier",
            "Le signaler à un collègue",
            "Lire le message attentivement"
        ],
        reponse: 1,
        explication: "Toujours vérifier les liens avant de cliquer est crucial pour éviter les attaques de phishing."
    }, {
        id: 7,
        question: "Quel est un bon réflexe pour créer un mot de passe sécurisé ?",
        options: [
            "Utiliser le même mot de passe pour tous les comptes",
            "Utiliser son nom et sa date de naissance",
            "Utiliser un mot de passe court pour le mémoriser facilement",
            "Utiliser une combinaison de lettres, chiffres et symboles"
        ],
        reponse: 3,
        explication: "Réutiliser un mot de passe augmente fortement le risque de compromission de tous les comptes associés en cas de fuite de données."
    }, {
        id: 8,
        question: "Que faut-il éviter de publier sur les réseaux sociaux ?",
        options: [
            "Des informations personnelles comme l'adresse ou le numéro de téléphone",
            "Des opinions sur des sujets d'actualité",
            "Des photos de vacances",
            "Des recommandations de restaurants"
        ],
        reponse: 0,
        explication: "La publication d'informations personnelles sur les réseaux sociaux peut être exploité par des cybercriminels pour des attaques ciblées. Ou même faciliter l'usurpation d'identité."
    }, {
        id: 9,
        question: "Pourquoi est-il important de mettre à jour régulièrement ses logiciels ?",
        options: [
            "Pour ajouter de nouvelles fonctionnalités",
            "Pour améliorer les performances de l'ordinateur",
            "Pour corriger des failles de sécurité",
            "Pour économiser de l'espace de stockage"
        ],
        reponse: 2,
        explication: "Les mises à jour logicielles corrigent souvent des failles de sécurité qui pourraient être exploitées par des cybercriminels."
    }, {
        id: 10,
        question: "Quel réseau Wi-Fi est le plus sûr à utiliser ?",
        options: [
            "Le Wi-Fi d'un voisin",
            "Un réseau Wi-Fi avec un nom familier",
            "Un réseau Wi-Fi public gratuit",
            "Un réseau Wi-Fi protégé par mot de passe"
        ],
        reponse: 3,
        explication: "Les réseaux Wi-Fi publics gratuits sont souvent non sécurisés et peuvent être utilisés par des cybercriminels pour intercepter les données des utilisateurs. Il est préférable d'utiliser un réseau Wi-Fi protégé par mot de passe."
    }],
    moyen: [
        {
            id: 1,
            question: "Vous recevez un email de votre banque. Quel élément rend ce message suspect ?",
            options: [
                "Le lien pointe vers un domaine légèrement différent",
                "Le message contient des informations personnelles",
                "Le message est bien formaté",
                "Le message est envoyé par un collègue"
            ],
            reponse: 0,
            explication: "Les domaines frauduleux imitent souvent les domaines légitimes en utilisant des caractères similaires pour tromper les utilisateurs."
        }, {
            id: 2,
            question: "Quel est l'avantage principal d'un gestionnaire de mots de passe ?",
            options: [
                "Il génère des mots de passe faciles à retenir",
                "Il permet d'utiliser le même mot de passe pour tous les comptes",
                "Il permet d'utiliser des mots de passe forts et uniques pour chaque compte",
                "Il stocke les mots de passe dans un fichier texte sur l'ordinateur"
            ],
            reponse: 2,
            explication: "Les gestionnaires permettent de créer et stocker des mots de passe complexes sans avoir à les mémoriser, ce qui améliore la sécurité globale des comptes."
        }, {
            id: 3,
            question: "Quel paramètre améliore le plus la confidentialité sur un réseau social ?",
            options: [
                "La fréquence des publications",
                "La visibilité des publications",
                "Le nombre de likes reçus",
                "Le nombre de personnes suivies"
            ],
            reponse: 1,
            explication: "Limiter la visibilité réduit l'exposition aux inconnus et aux collecteurs de données, ce qui améliore la confidentialité."
        }, {
            id: 4,
            question: "Quel comportement réduit le risque d'infection sur un ordinateur ?",
            options: [
                "Désactiver l'antivirus pour économiser des ressources",
                "Ignorer les mises à jour",
                "Installer des logiciels provenant de sources officielles",
                "Télécharger des fichiers depuis des sites de partage de fichiers"
            ],
            reponse: 2,
            explication: "Les sources officielles limitent les risques de logiciels malveillants."
        }, {
            id: 5,
            question: "Que garantit principalement le protocole HTTPS lors de la navigation ?",
            options: [
                "L'anonymat complet de l'utilisateur",
                "L'authenticité du site web",
                "La protection contre les virus",
                "Le chiffrement des données échangées"
            ],
            reponse: 3,
            explication: "HTTPS chiffre les données échangées entre le navigateur et le serveur, ce qui protège les informations sensibles."
        }, {
            id: 6,
            question: "Quel comportement est recommandé avant d'ouvrir une pièce jointe au travail ?",
            options: [
                "L'ouvrir immédiatement pour gagner du temps",
                "La renommer pour éviter les caractères spéciaux",
                "La transférer à plusieurs collègues pour vérifier son contenu",
                "Vérifier que l'expéditeur est un collègue connu"
            ],
            reponse: 3,
            explication: "Même en interne, il faut vérifier l'expéditeur pour éviter les attaques latérales (compromission d'un compte interne)."
        }, {
            id: 7,
            question: "Quel est un bon usage du stockage cloud ?",
            options: [
                "Désactiver la synchronisation pour économiser de l'espace",
                "Partager des mots de passe avec des collègues via le cloud",
                "Sauvegarder des documents importants pour éviter leur perte",
                "Stocker des fichiers sensibles sans chiffrement"
            ],
            reponse: 2,
            explication: "Le cloud est idéal pour la sauvegarde, mais nécessite des protections appropriées."
        }, {
            id: 8,
            question: "Pourquoi les mises à jour automatiques sont-elles recommandées ?",
            options: [
                "Elles augmentent la taille du disque dur",
                "Elles corrigent rapidement les failles de sécurité",
                "Elles empêchent l'accès à Internet",
                "Elles suppriment les fichiers inutiles"
            ],
            reponse: 1,
            explication: "Les mises à jour automatiques appliquent les correctifs dès leur publication, réduisant ainsi la fenêtre de vulnérabilité."
        }, {
            id: 9,
            question: "Quel principe permet de réduire les risques liés aux données personnelles ?",
            options: [
                "Activer la géolocalisation en permanence",
                "Ne fournir que les informations strictement nécessaires",
                "Partager toutes ses informations pour plus de transparence",
                "Utiliser le même pseudo partout"
            ],
            reponse: 1,
            explication: "La minimisation des données limite l'impact en cas de fuite ou d'exploitation malveillante."
        }, {
            id: 10,
            question: "Quel réflexe est recommandé avant d'installer une application mobile ?",
            options: [
                "Ignorer les avis des utilisateurs",
                "Installer l'application la plus téléchargée",
                "Télécharger l'application depuis une source tierce",
                "Vérifier les permissions demandées"
            ],
            reponse: 3,
            explication: "Les permissions excessives peuvent révéler un comportement suspect."
        }
    ],
    difficile: []
};