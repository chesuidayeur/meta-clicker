function Game(code, name, cost, resource, ratio, maxPlayers, baseClicksPerPlayer) {
  /* Code name of the game (not displayed to the player */
  this.code = code;
  /* Name of the game (displayed to the player) */
  this.name = name;
  /* Base cost of the game */
  this.cost = cost;
  /* Resource used to dev the game */
  this.resource = resource;
  /* Cost multiplier for the next version of the game */
  this.ratio = ratio;

  /* Interface related params */
  /* Is the game displayed in the user interface ? */
  this.displayed = false;
  /* Is the game clickable ? */
  this.enabled = false;

  /* Intrisics of the game */
  /* How many times the game has been bought */
  this.number = 0;
  /* Base maximum of Players */
  this.baseMaxPlayers = maxPlayers;
  /* Maximum number of players */
  this.maxPlayers = maxPlayers;
  /* Number of players */
  this.players = 0;
  /* Base maximum clicks generated by a player */
  this.baseClicksPerPlayer = baseClicksPerPlayer;

  /* Do you really need a comment here ? */
  this.toString = function() {
    return this.name;
  }
  /* Asking the game to display itself */
  this.render = function() {
    /* If the game is not displayed and enough resources : let's reveal it to the player ! */
    if (!this.displayed && this.getCost() * metaGame.pctToReveal < resourcePool.resources[this.resource].value) {
      this.displayed = true;
      $('<div id="game-'+this.code+'" code="'+this.code+'" class="game">'
        + '<div class="col-left">'
        + '<span class="name">'+this.name+'</span> '
        + ' - <span class="number">v'+this.number+'</span>'
        + '<br/>'
        + 'Players : <span class="players">'+this.players+'</span> / <span class="max-players">'+this.maxPlayers+'</span>'
        + '</div>'
        + '<div class="col-right">'
        + '<button class="dev">dev</button>'
        + '<br/>'
        + '<span class="cost">(<span class="value">'+this.getCost()+'</span> '+this.resource+')</span>'
        + '</div>'
        + '</div>').appendTo("#thingsToClick");
      $('#game-'+this.code+' div.col-right button.dev')
        .button({ disabled: !this.enabled })
        .click(function() {
          $(this).button("disable");
          var game = games.list[$(this).parent().parent().attr('code')];
          game.develop();
          game.toggle();
        });
    }
    /* If there's enough resources to dev the game, let's enable the dev button ! Or else, we disable it */
    if (this.getCost() > resourcePool.resources[this.resource].value && this.enabled) {
        this.toggle();
    }
    if (this.getCost() <= resourcePool.resources[this.resource].value && !this.enabled) {
      this.toggle();
    }
  }
  /* Utility function to enable or disable the dev button of the game */
  this.toggle = function() {
    this.enabled = !this.enabled;
    $('#game-'+this.code+' div button.dev').button("option", "disabled", !this.enabled);
  }
  /* Utility function to get the price of the game */
  this.getCost = function() {
    return this.cost * Math.pow(this.ratio, this.number);
  }
  /* Business ! How to develop a game */
  this.develop = function() {
    var amount = this.getCost();
    var value = resourcePool.resources[this.resource].value;
    this.number += 1;
    this.maxPlayers = Math.round(this.baseMaxPlayers * Math.pow(metaGame.maxPlayerRatio, this.number));
    resourcePool.resources[this.resource].value = value - amount;
    $("#game-"+this.code+' div span.number').html('v'+this.number);
    $("#game-"+this.code+' div span.max-players').html(this.maxPlayers);
    $("#game-"+this.code+' div span.cost span.value').html(Math.round(this.getCost() * 1000) / 1000);
  }

  /* Where the game produce some clicks ! */
  this.production = function() {
    this.hasNewPlayers();
    if (this.players > 0) {
      resourcePool.resources['clic'].value += this.players * this.baseClicksPerPlayer;
    }
  }
  /* Where some players might stumble upon the game, and, lo!, play it (clicks $_$) */
  this.hasNewPlayers = function() {
    /* Does something happen ? */
    if (this.number > 0 && Math.random() < games.playerEventProba * (this.maxPlayers - this.players) / this.maxPlayers) {
      /* Yes ! */
      var event = Math.random();
      if (event < games.playerLeavingProba * this.players / this.maxPlayers) {
        /* Argl ! Player is fed up with our game !! */
        if (this.players > 0) {
          this.players -= 1;
        }
      }
      if ((1 - event) < (1 - games.playerJoinProba) * (this.maxPlayers - this.players) / this.maxPlayers) {
        /* Yes ! New player */
        if (this.players < this.maxPlayers) {
          this.players += 1;
        }
      }
      /* Update of the display */
      $("#game-"+this.code+" span.players").html(this.players);
    }
  }
}

/* Wrapper for all the games */
var games = {
  /* Base probability of something happening to a player */
  playerEventProba : 0.02,
  /* Base probability of a user leaving the game */
  playerLeavingProba : 0.3,
  /* Base probability of a user joining the game */
  playerJoinProba : 0.3,

  /* List of all the games */
  list : {},
  /* Where all the game are intialized */
  init : function() {
    this.list['protoIncGame'] = new Game('protoIncGame', 'Proto Incremental Game', 10, 'gamelore', 1.1, 10, 0.001);
  },
  /* Where we ask all our games if they might produce something clic-related */
  production : function() {
    for (var g in this.list) {
      var game = this.list[g];
      game.production();
    }
  }
};

