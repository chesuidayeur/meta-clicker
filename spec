un jeu incrémental
sur.
les jeux incrémentaux
les "bâtiments" que tu construis sont des sortes de
jeux
civclicker, cookieclicker, kitten game, clicker
heros, candy clicker etc.
tu les montes de version
le but est de récupérer, non de la thune, mais le
plus de clics
pour cela, tu peux cliquer toi-même
ou avoir des visiteurs, qui cliquent sur tes jeux
les upgrades peuvent être des conneries comme "faire
de la pub", "reddit", etc.
il peut y avoir un mécanisme de reset, où tu
"reboot" l'internet
tu perds tes clics, mais tu gardes ton expérience de
codeur


Attraction d'un jeu :
Score arbitraire représentant l'attrait d'un jeu pour des joueurs.
Plus le score est haut, plus le jeu est attrayant.

Un jeu attire des joueurs
 1. Un joueur génère des clics
 2. Le nombre de clics par joueur est fonction de l'ancienneté du joueur
      click par tick de base + pourcentage du temps passé à jouer
 3. Un joueur se lasse au bout d'un moment : fonction de l'attrait du jeu
      
 4. L'attrait d'un jeu est fonction de
   + sa version
   + son nombres de bugs
   + son nombre de joueurs
 5. On peut temporairement booster l'attrait d'un jeu par de la pub (à définir)
 6. Il y a plusieurs types de joueurs :
   1. Noob
   2. Confirmé
   3. Expérimenté
   4. Cœurdur
   5. Sansvie
 7. Les types sont débloqués par l'intérêt maximal atteint par le jeu (il peut redescendre suite à des bugs et des jouers quittant massivement le jeu)

Bugs
 1. Un bug survient aléatoirement sur un jeu. Modificateurs 
   + Nombre de devs : plus il y a de dev, plus un bug est susceptible d'apparaître
   + Niveau des devs : plus ils sont bon, moins il y a de chances
 2. Il est plus ou moins sévère en fonction :
   + de la version du jeu (plus le jeu est complexe plus le bug peut être sévère)
   + du nombre de développeurs : plus il y en a, plus c'est complexe de travailler ensemble
 3. Un bug se corrige par une version mineure, ou majeure
   + plus il y a de bug plus la version mineure coûte chère
   + le coût de la version mineure s'ajoute à la majeure (plus une pénalité ?)
 4. Un bug peut se transformer un feature (s'il est marrant par exemple). C'est rare.

Développeurs :
 1. On peut recruter des développeurs : avec du gamelore ? Autre ?
 2. Un développeur peut faire de la maintenance ou du développement (réglage globale ? par développeur ?)
 3. Un développeur acquiert de l'expérience un débugguant et en codant
 4. Un développeur travaille pour la gloire de générer des clics, mais il veut sa part : il consomme des clics
 5. Plus un développeur est expérimenté, plus il consomme de clics (limites à implémenter ?)


Mail Manf' 2014-10-18

J'ai beaucoup aimé ton idée de voir l'efficacité d'un jeu fluctuer dans le temps. Ça m'a donné l'idée suivante :
Dans un "clicker" classique, on achète des bâtiments ; ces bâtiments sont de plus en plus chers au fur et à mesure qu'on en achète ; parallèlement, les bâtiments les plus chers sont les plus efficaces.

Dans ce méta-clicker, on "achète" - on crée - des jeux ; ces jeux sont de plus en plus chers à administrer et à développer, plus les versions (leur "nombre") augmente.

Chaque jeu a une base de joueurs, qui fluctue. Le type du jeu, la version du jeu et la base de joueurs donne le nombre de clics par seconde du jeu.

Chaque jeu peut bugger. Pour remédier à cela, on peut mettre des dév sur chaque jeu. On a un nombre fini de dév. Les dév peuvent être recrutés (avec de l'argent ? À terme, en end-game, en finançant une école ?).
Parallèlement, si un jeu a une base importante de joueurs, il peut y avoir des mods de fans / des patch non-officiels / des aides bénévoles sur les forums. Ça ne se déclenche que quand le jeu a une grosse base de joueurs - ainsi, il peut être intéressant de ne pas mettre de dév sur un jeu populaire, mais risqué, puisque dès que sa base diminue un peu, paf, plus personne ne s'en occupe.

Chaque jeu a une proba de bugger, qui grossit avec le temps. On peut la faire diminuer en changeant de version - version mineure, moins chère ; version majeure, plus chère, mais diminution drastique de la proba. La vitesse d'augmentation de la proba du bug dépend de la version du jeu (un jeu version 150 aura moins de chance de bugger qu'un jeu version 1) et surtout du nombre de dév dessus.

Lien clic / argent ? Bêtement en expliquant qu'on se fait de la thune avec du pagerank ? Ou quelque chose de plus baroque, genre on récupère l'énergie potentielle des boutons de souris ? En tous les cas, ça permet de voir l'argent comme une ressource, donc avec un stock et une vitesse (positive ou négative). Un dév consomme de cette ressource.

Parallèlement, je suis intéressé de creuser deux pistes :
1) s'il est évident qu'il y aura des "technologies" / améliorations à rechercher (améliorant les dév, diminuant l'occurrence des bugs, etc. genre phpBB => un forum pour générer du lore sur un jeu), je me demande s'il ne serait pas chouette de proposer des chemins différents (et mutuellement exclusifs) à suivre. J'avoue ne pas avoir d'idées pour l'instant.

2) À terme, pour le end-game, on pourrait imaginer de proposer son jeu sur, mettons, reddit, ou kongegrate ou... et donc de devoir rivaliser avec d'autres créateurs de jeu (faire de la pub ?). On peut imaginer une sorte de "tuto" où les autres créateurs sont des IA - que l'on élimine en leur piquant tous leurs joueurs ; et pourquoi pas, à terme, proposer une sorte de compétition ? Veiller à ce que cela ne détruise pas l'aspect "idle" du jeu.

Ainsi, je verrai bien un truc du style (les chiffres sont au pif) :
Clics générés : 12,34 millions
Portefeuille : 31 415 € (+15 € / sec ; +22 grâce aux jeux, -7 pour payer les dév)

Jeu1 : version 2.34 -- augmenter de version (9842 €)
12345 joueurs en ce moment -- faire de la pub (750 €)
87563 clics / sec
Proba de bug : 3.5%
Développeurs dessus : 4 -- +/- développeurs

Jeu2 : version 0.4 -- augmenter de version (9842 €)
12345 joueurs en ce moment -- faire de la pub (750 €)
87563 clics / sec
Proba de bug : 15.5%
Développeurs dessus : 3 -- +/- développeurs

Créer Jeu3 : 6543 €

Rechercher :
Ramens (9876€) : les dév sont plus efficaces ;
Yahoogle ads : chaque joueur ramène plus d'argent
etc.






"Write code" -> crée du "code"

Avec suffisamment de code, on peut créer / améliorer des jeux
On peut créer des versions mineures et majeures. Également des corrections de bugs

Les jeux génèrent des clics
Des joueurs s'y intéressent, génèrent des clics, puis arrêtent ou deviennent des joueurs plus chevronnés
Le jouer peut également "jouer" au jeu et générer des clics.

On peut revendre des clics à des fabricants de souris -> $_$ money $_$

Avec de l'argent, on peut
 * recruter des développeurs
 * faire de la pub pour un jeu
 * acheter certaines améliorations (des pizzas et de la bière pour les développeurs)

On peut libérer un jeu :
 * Malus :
  - plus de pub commerciales (uniquement forums et autres)
  - upgrade plus cher en code : il faut réussir à mettre la communauté d'accord
 * Bonus :
  - devs gratuits : nombre selon la popularité du jeu

Un dev génère des lignes de code.
Un dev coûte de l'argent, à recruter et à payer.
Si plus d'argent, le dev se barre.
Un dev est payé à la fin de chaque mois : si pas assez d'argent le dev se barre.
Pour avoir un dev il faut des locaux (garage, bureaux, campus, etc) : ça s'achète.

On peut générer de l'argent automatiquement en recrutant des commerciaux qui revendent nos clics
