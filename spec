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


Un jeu attire des joueurs
 1. Un joueur génère des clics
 2. Le nombre de clics par joueur est fonction de l'ancienneté du joueur
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


Modéliser les joueurs d'un jeu :
{
  noob : {
    nombre : N,
    clicParTick : 0.XX,
    attraitMax : 42,
    tempsMoy : 10, /* Nombre de ticks */
    tempsPassé : 0 /* Nombre de ticks */
  },
  confirmé : { … }
  expérimenté : { … }
  cœurdur : { … }
  sansvie : { … }
}

chaque tick :
  temps passé += nombre joueurs

/* Si les joueurs ont passé suffisamment de temps */
si test attrait : temps passé - attrait x Nj > 0
  Nombre de joueurs qui partent :
    partie entiere (rand(difficulté, 1) x (temps passé / (temps moy x Nj))

  temps passé -= nombre de joueurs ayant quitté le jeu x temps moy
  
  si plus de joueurs :
    temps passé = 0

/* Si les joueurs ont passé suffisamment de temps */
si test noob -> temps passé - (temps moy x Nj) > 0 et niveau confirmé ouvert
  Nombre de joueur passant de niveau :
    /* Un peu moins que le nombre de joueurs ayant joué suffisamment longtemps */
    partie entière (rand(difficulté, 1) x (temps passé / (temps moy x Nj))

  temps passé -= nombre de joueurs ayant passé de niveau x temps moy
  
  si plus de joueurs :
    temps passé = 0

