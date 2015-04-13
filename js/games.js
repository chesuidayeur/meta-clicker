function Game(code, name, cost, resource, ratio, baseAttraction, conf) {
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
  /* App conf */
  this.conf = conf;

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
  /* Players */
  this.players = null;

  /* Do you really need a comment here ? */
  this.toString = function() {
    return this.name;
  };
  this.setPlayers = function(players) {
    this.players = players;
  };
  /* Asking the game to display itself */
  this.render = function() {
    /* If the game is not displayed and enough resources : let's reveal it to the player ! */
    if (!this.displayed && this.getCost() * this.conf.pctToReveal < resourcePool.resources[this.resource].value) {
      this.display();
    }
    /* If there's enough resources to dev the game, let's enable the dev button ! Or disable it */
    if (this.getCost() > resourcePool.resources[this.resource].value && this.enabled) {
        this.toggleDev();
    }
    if (this.getCost() <= resourcePool.resources[this.resource].value && !this.enabled) {
      this.toggleDev();
    }
  };
  /* How to display a Game */
  this.display = function() {
    this.displayed = true;
    $('<div id="game-'+this.code+'" code="'+this.code+'" class="game">'
      + '<div class="col-right">'
      + '<button class="dev">dev</button>'
      + '<br/>'
      + '<span class="cost">(<span class="value">'+this.getCost()+'</span> '+this.resource+')</span>'
      + '<br/>'
      + '<br/>'
      + '<div id="clicker"></div>'
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
      + '</div>'
      + '</div>').appendTo("#games-container");
    $('#game-'+this.code+' div.col-right button.dev')
      .button({ disabled: !this.enabled })
      .click(function() {
        $(this).button("disable");
        var game = games.list[$(this).parent().parent().attr('code')];
        game.develop();
        game.toggleDev();
      });
    if (this.players != null) {
      this.players.display();
    }
  };
  /* Utility function to enable or disable the dev button of the game */
  this.toggleDev = function() {
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
    $('#game-'+this.code+' div button.clicker').button("option", "disabled", !this.enabled);
    if (this.clicker == null) {
      this.clicker = new Clicker('clic', 'Play', 'Take a break ! Play some casual game ^_^', '#game-'+this.code+' div div#clicker');
      this.clicker.display();
    };
  };

  this.getAttraction = function() {
    var attraction = this.attraction + this.upgrades;
    if (this.players != null) {
      attraction += this.players.getAttractionBonus();
    }
    return attraction;
  }

  /* Callback function controlling what happens in the game */
  this.whateverHappensToMyGame = function() {
    /* Update of max attraction reached by the game */
    this.maxAttraction = Math.max(this.getAttraction(), this.maxAttraction);
    /* If the game has been developped, something happen to the players ^_^ */
    if (this.upgrades > 0) {
      this.whateverHappensToMyPlayers();
    }
  }

  /* Where the game produce some clicks ! */
  this.production = function() {
    if (this.players != null) {
      resourcePool.resources['clic'].add(this.players.getProduction());
    }
  };
  /* Where some players might stumble upon the game, and, lo!, play it (clicks $_$) */
  this.whateverHappensToMyPlayers = function() {
    if (this.players != null) {
      this.players.playersPlay();
    }
  };

  /* Where the game updates how it is displayed */
  this.updateUI = function() {
    $('#game-'+this.code+' span.max-attraction').html(this.maxAttraction);
    $('#game-'+this.code+' span.attraction').html(this.getAttraction());
  }

  /* What happens when metaCliker player plays one of his games */
  this.click = function() {
    //resourcePool.resources['clic'].add(this.players.data.seasoned.clicksPerTick);
    resourcePool.resources['clic'].add(1);
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
    var protoIncGame = new Game(
      'protoIncGame', 'Proto Incremental Game',
      20, 'code',
      1.25, /* Ratio */
      1, /* Base attraction */
      metaGame
    );
    protoIncGame.setPlayers(
      new Players(
        protoIncGame,
        { noob: {
            clicksPerTick: 0.001,
            minAttractionToLvlup: 5,
            avgTime: 30
          },
          casual: {
            clicksPerTick: 0.005,
            minAttractionToLvlup: 15,
            avgTime: 120
          },
          seasoned: {
            clicksPerTick: 0.02,
            minAttractionToLvlup: 30,
            avgTime: 1000
          },
          hardcore: {
            clicksPerTick: 0.1,
            minAttractionToLvlup: 50,
            avgTime: 5000
          },
          nolife: {
            clicksPerTick: 0.5,
            minAttractionToLvlup: 1000000,
            avgTime: 15000
    }}));
    this.list['protoIncGame'] = protoIncGame;

    var doughnutClicker = new Game(
      'doughnutClicker', 'Doughnut Clicker : get em all doughnuts',
      1000, 'code',
      1.2, /* Ratio */
      1, /* Base attraction */
      metaGame
    );
    doughnutClicker.setPlayers(
      new Players(
        doughnutClicker,
        { noob: {
            clicksPerTick: 0.001,
            minAttractionToLvlup: 5,
            avgTime: 50
          },
          casual: {
            clicksPerTick: 0.01,
            minAttractionToLvlup: 10,
            avgTime: 750
          },
          seasoned: {
            clicksPerTick: 0.1,
            minAttractionToLvlup: 20,
            avgTime: 1000
          },
          hardcore: {
            clicksPerTick: 1,
            minAttractionToLvlup: 30,
            avgTime: 5000
          },
          nolife: {
            clicksPerTick: 2,
            minAttractionToLvlup: 1000000,
            avgTime: 15000
    }}));
    this.list['doughnutClicker'] = doughnutClicker;

    UI.registerRenderer(this.render.bind(this));
  },
  render : function() {
    for (var g in this.list) {
      this.list[g].render();
    };
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

