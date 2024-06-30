import React from 'react';
import "../css/HelpMenu.css"

interface HelpMenuProps {
    onClose: () => void;
    isHelpMenuVisible: boolean;
  }

const HelpMenuFr: React.FC<HelpMenuProps> = ({onClose, isHelpMenuVisible}) => {
    return (
        <div className={`help-menu ${isHelpMenuVisible ? 'visible' : ''}`}>
            <button className="close" onClick={onClose} />
            <h1>Menu d'Aide pour IDE</h1>

            <h2>Introduction</h2>
            <p>Bienvenue dans votre IDE spécialisé dans le Ruby. Conçu non seulement pour vous rendre productif mais aussi pour vous motiver à chaque ligne de code écrite. Parce qu'après tout, le code ne se débugge pas tout seul.</p>

            <h2>1. Interface de Fichier</h2>
            <h3>1.1 Sélection de Dossier</h3>
            <ul>
                <li><strong>Ouvrir un Dossier</strong>: Utilisez le bouton de sélection de dossier pour ouvrir un projet existant. Entrez bien le chemin ABSOLU.</li>
                <li><strong>Ouvrir un Fichier</strong>: Parcourez l'arborescence et cliquez sur un fichier pour l'ouvrir. C’est comme ouvrir un cadeau, sauf que c’est un fichier de code.</li>
            </ul>
            <h3>1.2 Création et Gestion des Fichiers</h3>
            <ul>
                <li><strong>Créer un Nouveau Fichier/Dossier</strong>: Cliquez sur l'option de création pour ajouter un nouveau fichier ou dossier à votre projet.</li>
                <li><strong>Renommer</strong>: Cliquez sur le crayon à côté du nom du fichier/dossier ou utilisez l'option de menu contextuel pour renommer.</li>
                <li><strong>Supprimer</strong>: Utilisez l'option de suppression de la même façon, sauf que c'est une poubelle (comme votre code), pour supprimer un fichier ou un dossier.</li>
            </ul>

            <h2>2. Éditeur de Code</h2>
            <h3>2.1 Ouverture et Édition des Fichiers</h3>
            <ul>
                <li><strong>Ouvrir un Fichier</strong>: Cliquez sur un fichier dans l'arborescence pour l'ouvrir dans l'éditeur. Comme ouvrir la porte d'une pièce remplie de possibilités (et parfois de bugs, mais c'est une autre histoire).</li>
                <li><strong>Édition</strong>: Modifiez le contenu des fichiers ouverts. Chaque ligne de code doit être écrite en moins de 15 secondes sinon vous perdez des vies et votre code.</li>
            </ul>
            <h3>2.2 Sauvegarde</h3>
            <ul>
                <li><strong>Sauvegarder</strong>: Utilisez l'option "Sauvegarder" pour enregistrer les modifications dans le fichier actuel. Parce que perdre son travail, c’est comme renverser son café du matin – évitable et douloureux.</li>
                <li><strong>Sauvegarder Sous</strong>: Enregistrez le fichier sous un nouveau nom ou à un nouvel emplacement. Une copie de sécurité est toujours une bonne idée.</li>
            </ul>

            <h2>3. Terminal</h2>
            <h3>3.1 Utilisation du Terminal</h3>
            <ul>
                <li><strong>Exécuter des Commandes</strong>: Tapez vos commandes dans le terminal et appuyez sur Entrée. C’est un peu comme parler à votre ordinateur... et parfois il répond !</li>
                <li><strong>Affichage des Résultats</strong>: Les résultats des commandes s'affichent directement dans le terminal (sortie et erreurs). C’est comme recevoir une réponse instantanée à vos questions existentielles... de code.</li>
            </ul>

            <h2>4. Gestion de Version (Git)</h2>
            <h3>4.1 Commandes Git</h3>
            <ul>
                <li><strong>Ajouter (Git Add)</strong>: Utilisez le bouton "selectionner" pour choisir le fichiers que vous voulez ajouter à votre dépôt. Puis, utilisez le bouton "Ajouter" pour ajouter vos modifications.</li>
                <li><strong>Commit (Git Commit)</strong>: Enregistrez les modifications avec un message descriptif. C’est comme écrire une note d'amour à votre futur vous. "Cher moi, voici ce que j'ai changé et pourquoi j'ai si mal codé"</li>
                <li><strong>Pull (Git Pull)</strong>: Synchronisez votre dépôt local avec le dépôt distant. Pensez-y comme un échange de bons procédés avec d’autres développeurs... ou comme recevoir de l’aide de vos futurs vous.</li>
            </ul>

            <h2>5. Fonctionnalités AI</h2>
            <h3>5.1 Accès aux Fonctionnalités AI</h3>
            <ul>
                <li><strong>Activer le Menu AI</strong>: Cliquez sur "IA" dans la barre de navigation. Libérez le pouvoir de l'intelligence artificielle, votre nouvel assistant personnel qui ne dort jamais (mais qui ne vous aime pas).</li>
                <li><strong>Utilisation</strong>: Utilisez ces outils pour générer du code, suggérer des corrections, ou autres tâches IA.</li>
            </ul>

            <h2>6. Personnalisation et Langue</h2>
            <h3>6.1 Thème</h3>
            <ul>
                <li><strong>Changer de Thème</strong>: Alternez entre le mode sombre et clair en utilisant l'icône de thème. Parce que parfois, coder dans le noir, c'est tout simplement plus motivant (hecker).</li>
            </ul>
            <h3>6.2 Langue</h3>
            <ul>
                <li><strong>Changer de Langue</strong>: Sélectionnez la langue souhaitée dans le menu "Language". Parlez à votre IDE dans la langue de votre choix (lithuanien ou français).</li>
            </ul>

            <h2>7. Musique</h2>
            <h3>7.1 Lecteur de Musique</h3>
            <ul>
                <li><strong>Activer le Lecteur</strong>: Utilisez le lecteur de musique intégré pour écouter de la musique pendant que vous travaillez. Boostez votre motivation et votre créativité avec votre son préféré (mais on pré-choisit pour vous, faut pas déconner).</li>
            </ul>

            <h2>8. Support et Aide</h2>
            <h3>8.1 Contact Support</h3>
            <ul>
                <li><strong>Obtenir de l'Aide</strong>: Internet existe nan ?</li>
            </ul>

            <p>Ce guide est là pour vous aider à transformer chaque session de codage en une expérience agréable et motivante. Bon codage ! (même si on sait que tu code mal)</p>
        </div>
    );
};

export default HelpMenuFr;
