function Game(code, name, cost, resource, ratio, baseAttraction, playersConf) {
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

  /* Attraction related */
  this.baseAttraction = baseAttraction;
  this.attraction = baseAttraction;
  this.maxAttraction = baseAttraction;

  /* Intrisics of the game */
  /* How many times the game has been upgraded */
  this.upgrades = 0;
  /* Players
   * Template :
   * { noob: {
   *     number: 0,
   *     clicsPerTick: 0.01,
   *     attractionToUnlock: 42, /* All games will have at least 42 attraction * /
   *     avgTime: 10, /* Number of ticks * /
   *     playedTime: 0 /* Number of ticks * /
   *   },
   *   casual : { … },
   *   seasond : { … },
   *   hardcore : { … },
   *   nolife : { … }
   */
  this.players = new Players(this, playersConf);

  /* Do you really need a comment here ? */
  this.toString = function() {
    return this.name;
  };
  /* Asking the game to display itself */
  this.render = function() {
    /* If the game is not displayed and enough resources : let's reveal it to the player ! */
    if (!this.displayed && this.getCost() * metaGame.pctToReveal < resourcePool.resources[this.resource].value) {
      this.displayed = true;
      $('<div id="game-'+this.code+'" code="'+this.code+'" class="game">'
        + '<div class="col-right">'
        + '<button class="dev">dev</button>'
        + '<br/>'
        + '<span class="cost">(<span class="value">'+this.getCost()+'</span> '+this.resource+')</span>'
        + '</div>'
        + '<div class="col-left">'
        + '<span class="name">'+this.name+'</span> '
        + ' - <span class="upgrades">v'+this.upgrades+'</span>'
        + ' <br/>'
        + '</div>'
        + '<div class="col-left" id="dev">'
        + '  Max attraction : <span class="max-attraction">'+this.maxAttraction+'</span>'
        + '  <br/>'
        + '  Attraction : <span class="attraction">'+this.getAttraction()+'</span>'
        + '</div>'
        + '<div class="players col-left" id="players-'+this.code+'">'
        +   this.players.toHTML()
        + '</div>'
        + '</div>').appendTo("#games-container");
      $('#game-'+this.code+' div.col-right button.dev')
        .button({ disabled: !this.enabled })
        .click(function() {
          $(this).button("disable");
          var game = games.list[$(this).parent().parent().attr('code')];
          game.develop();
          game.toggle();
        });
    }
    /* If there's enough resources to dev the game, let's enable the dev button ! Or, we disable it */
    if (this.getCost() > resourcePool.resources[this.resource].value && this.enabled) {
        this.toggle();
    }
    if (this.getCost() <= resourcePool.resources[this.resource].value && !this.enabled) {
      this.toggle();
    }
  };
  /* Utility function to enable or disable the dev button of the game */
  this.toggle = function() {
    this.enabled = !this.enabled;
    $('#game-'+this.code+' div button.dev').button("option", "disabled", !this.enabled);
  };
  /* Utility function to get the price of the game */
  this.getCost = function() {
    return Math.round(this.cost * Math.pow(this.ratio, this.upgrades) * 1000) / 1000;
  };
  /* Business ! How to develop a game */
  this.develop = function() {
    var amount = this.getCost();
    var res = resourcePool.resources[this.resource];
    var value = res.value;
    this.upgrades += 1;
    res.consume(amount);
    $("#game-"+this.code+' div span.upgrades').html('v'+this.upgrades);
    $("#game-"+this.code+' div span.cost span.value').html(Math.round(this.getCost() * 1000) / 1000);
  };

  this.getAttraction = function() {
    return this.attraction + this.upgrades + this.players.getAttractionBonus();
  }

  this.whateverHappensToMyGame = function() {
    this.maxAttraction = Math.max(this.getAttraction(), this.maxAttraction);
    if (this.upgrades > 0) {
      this.whateverHappensToMyPlayers();
    }
  }

  /* Where the game produce some clicks ! */
  this.production = function() {
    resourcePool.resources['clic'].add(this.players.getProduction());
  };
  /* Where some players might stumble upon the game, and, lo!, play it (clicks $_$) */
  this.whateverHappensToMyPlayers = function() {
    this.players.playersPlay();
  };

  this.updateUI = function() {
    $('#game-'+this.code+' span.max-attraction').html(this.maxAttraction);
    $('#game-'+this.code+' span.attraction').html(this.getAttraction());
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
    this.list['protoIncGame'] = new Game(
      'protoIncGame', 'Proto Incremental Game',
      10, 'gamelore',
      1.1, /* Ratio */
      1, /* Base attraction */
      { noob: {
          clicksPerTick: 0.001,
          attractionToUnlock: 5,
          avgTime: 50
        },
        casual: {
          clicksPerTick: 0.01,
          attractionToUnlock: 10,
          avgTime: 750
        },
        seasoned: {
          clicksPerTick: 0.1,
          attractionToUnlock: 20,
          avgTime: 1000
        },
        hardcore: {
          clicksPerTick: 1,
          attractionToUnlock: 30,
          avgTime: 5000
        },
        nolife: {
          clicksPerTick: 2,
          attractionToUnlock: 40,
          avgTime: 15000
        }
      })
  },
  /* Where we ask all our games if they might produce something clic-related */
  production : function() {
    for (var g in this.list) {
      var game = this.list[g];
      game.production();
    }
  },
  update : function() {
    for (var g in this.list) {
      var game = this.list[g];
      game.whateverHappensToMyGame();
      game.updateUI();
    }
  }
};

