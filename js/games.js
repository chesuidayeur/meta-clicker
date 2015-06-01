function Game(code, name, cost, resource, ratio, baseAttraction, conf) {
  /* Code name of the game (not displayed to the player */
  this.code = code;
  /* Name of the game (displayed to the player) */
  this.name = name;
  /* Base cost of the game */
  this.majorReleaseCost = { resource: 'code', amount: cost, ratio: ratio };
  this.minorReleaseCost = { resource: 'code', amount: cost * 0.1, ratio: ratio };
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
  this.majorReleaseEnabled = false;
  this.minorReleaseEnabled = false;

  /* Attraction related */
  this.baseAttraction = baseAttraction;
  this.attraction = baseAttraction;
  this.maxAttraction = baseAttraction;

  /* Intrisics of the game */
  /* How many times the game has been upgraded */
  this.majorVersions = 0;
  this.minorVersions = 0;
  this.totalMinorVersions = 0;
  this.hotfixes = 0;
  this.previousMajorReleaseCost = 0;
  /* Players */
  this.players = null;
}

Game.prototype = {
  /* Do you really need a comment here ? */
  toString: function() {
    return this.name;
  },
  setPlayers: function(players) {
    this.players = players;
  },
  /* Asking the game to display itself */
  render: function() {
    /* If the game is not displayed and enough resources : let's reveal it to the player ! */
    if (!this.displayed && this.getMajorReleaseCost() * this.conf.pctToReveal < resourcePool.resources[this.resource].value) {
      this.display();
    }
    /* If there's enough resources for a new release, time to enable the appropriate button */
    if (this.getMajorReleaseCost() > resourcePool.resources[this.majorReleaseCost.resource].value && this.majorReleaseEnabled) {
        this.toggleMajorRelease();
    }
    if (this.getMajorReleaseCost() <= resourcePool.resources[this.majorReleaseCost.resource].value && !this.majorReleaseEnabled) {
      this.toggleMajorRelease();
    }
    if (this.getMinorReleaseCost() > resourcePool.resources[this.minorReleaseCost.resource].value && this.minorReleaseEnabled) {
        this.toggleMinorRelease();
    }
    if (this.getMinorReleaseCost() <= resourcePool.resources[this.minorReleaseCost.resource].value && !this.minorReleaseEnabled) {
      this.toggleMinorRelease();
    }
  },
  /* How to display a Game */
  display: function() {
    this.displayed = true;
    $('<div id="game-'+this.code+'" code="'+this.code+'" class="game">'
      + '<div class="col-right">'
      + '<button class="major-release">Major Release</button>'
      + '<br/>'
      + '<span class="major-cost">(<span class="value">'+this.getMajorReleaseCost()+'</span> '+this.resource+')</span>'
      + '<br/>'
      + '<button class="minor-release">Minor Release</button>'
      + '<br/>'
      + '<span class="minor-cost">(<span class="value">'+this.getMinorReleaseCost()+'</span> '+this.resource+')</span>'
      + '<br/>'
      + '<br/>'
      + '<div id="clicker"></div>'
      + '</div>'
      + '<div class="col-left">'
      + '<span class="name">'+this.name+'</span> '
      + ' - <span class="upgrades">v'+this.majorVersions+'.'+this.minorVersions+'.'+this.hotfixes+'</span>'
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
    $('#game-'+this.code+' div.col-right button.major-release')
      .button({ disabled: !this.majorReleaseEnabled })
      .click(this.majorRelease);
    $('#game-'+this.code+' div.col-right button.minor-release')
      .button({ disabled: !this.minorReleaseEnabled })
      .click(this.minorRelease);
    if (this.players != null) {
      this.players.display();
    }
  },
  majorRelease: function() {
    $(this).button("disable");
    var game = games.list[$(this).parent().parent().attr('code')];
    game.developMajorRelease();
    game.toggleMajorRelease();
  },
  minorRelease: function() {
    $(this).button("disable");
    var game = games.list[$(this).parent().parent().attr('code')];
    game.developMinorRelease();
    game.toggleMinorRelease();
  },
  /* Utility function to enable or disable the dev button of the game */
  toggleMajorRelease: function() {
    this.majorReleaseEnabled = !this.majorReleaseEnabled;
    $('#game-'+this.code+' div button.major-release').button("option", "disabled", !this.majorReleaseEnabled);
  },
  /* Utility function to enable or disable the dev button of the game */
  toggleMinorRelease: function() {
    this.minorReleaseEnabled = !this.minorReleaseEnabled;
    $('#game-'+this.code+' div button.minor-release').button("option", "disabled", !this.minorReleaseEnabled);
  },
  /* Utility function to get the price of the game */
  getMajorReleaseCost: function() {
    return Math.round(
        (this.majorReleaseCost.amount + (this.totalMinorVersions - this.minorVersions))
        * Math.pow(this.ratio, this.majorVersions + this.minorVersions * 0.1) * 1000
    ) / 1000;
  },
  getMinorReleaseCost: function() {
    return Math.round(
        (this.previousMajorReleaseCost * 0.33 +
         (this.minorReleaseCost.amount
         * Math.pow(this.ratio, this.minorVersions))) * 1000
    ) / 1000;
  },
  /* Business ! How to develop a game */
  developMajorRelease: function() {
    var amount = this.getMajorReleaseCost();
    this.previousMajorReleaseCost = amount;
    var res = resourcePool.resources[this.resource];
    var value = res.value;
    this.majorVersions += 1;
    this.minorVersions = 0;
    res.consume(amount);
    $("#game-"+this.code+' div span.upgrades').html('v'+this.majorVersions+'.'+this.minorVersions+'.'+this.hotfixes);
    $("#game-"+this.code+' div span.major-cost span.value').html(Math.round(this.getMajorReleaseCost() * 1000) / 1000);
    $("#game-"+this.code+' div span.minor-cost span.value').html(Math.round(this.getMinorReleaseCost() * 1000) / 1000);
    $('#game-'+this.code+' div button.clicker').button("option", "disabled", !this.majorReleaseEnabled);
    if (this.clicker == null) {
      this.clicker = new Clicker('clic', 'Play', 'Take a break ! Play some casual game ^_^', '#game-'+this.code+' div div#clicker');
      this.clicker.display();
    };
  },
  developMinorRelease: function() {
    var amount = this.getMinorReleaseCost();
    var res = resourcePool.resources[this.resource];
    var value = res.value;
    this.minorVersions += 1;
    this.totalMinorVersions += 1;
    res.consume(amount);
    $("#game-"+this.code+' div span.upgrades').html('v'+this.majorVersions+'.'+this.minorVersions+'.'+this.hotfixes);
    $("#game-"+this.code+' div span.major-cost span.value').html(Math.round(this.getMajorReleaseCost() * 1000) / 1000);
    $("#game-"+this.code+' div span.minor-cost span.value').html(Math.round(this.getMinorReleaseCost() * 1000) / 1000);
    $('#game-'+this.code+' div button.clicker').button("option", "disabled", !this.minorReleaseEnabled);
    if (this.clicker == null) {
      this.clicker = new Clicker('clic', 'Play', 'Take a break ! Play some casual game ^_^', '#game-'+this.code+' div div#clicker');
      this.clicker.display();
    };
  },

  getAttraction: function() {
    var attraction = this.attraction + this.majorVersions * 10 + this.minorVersions;
    if (this.players != null) {
      attraction += this.players.getAttractionBonus();
    }
    return attraction;
  },
  /* Callback function controlling what happens in the game */
  whateverHappensToMyGame: function() {
    /* Update of max attraction reached by the game */
    this.maxAttraction = Math.max(this.getAttraction(), this.maxAttraction);
    /* If the game has been developped, something happen to the players ^_^ */
    if (this.majorVersions > 0 || this.minorVersions > 0) {
      this.whateverHappensToMyPlayers();
    }
  },
  /* Where the game produce some clicks ! */
  production: function() {
    if (this.players != null) {
      resourcePool.resources['clic'].add(this.players.getProduction());
    }
  },
  /* Where some players might stumble upon the game, and, lo!, play it (clicks $_$) */
  whateverHappensToMyPlayers: function() {
    if (this.players != null) {
      this.players.playersPlay();
    }
  },
  /* Where the game updates how it is displayed */
  updateUI: function() {
    $('#game-'+this.code+' span.max-attraction').html(this.maxAttraction);
    $('#game-'+this.code+' span.attraction').html(this.getAttraction());
  },
  /* What happens when metaCliker player plays one of his games */
  click: function() {
    //resourcePool.resources['clic'].add(this.players.data.seasoned.clicksPerTick);
    resourcePool.resources['clic'].add(1);
  },
};

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
      200, 'code',
      2, /* Ratio */
      1, /* Base attraction */
      metaGame
    );
    protoIncGame.setPlayers(
      new Players(
        protoIncGame,
        { noob: {
            clicksPerTick: 0.001,
            minAttractionToLvlup: 15,
            avgTime: 20
          },
          casual: {
            clicksPerTick: 0.005,
            minAttractionToLvlup: 30,
            avgTime: 30
          },
          seasoned: {
            clicksPerTick: 0.02,
            minAttractionToLvlup: 60,
            avgTime: 45
          },
          hardcore: {
            clicksPerTick: 0.1,
            minAttractionToLvlup: 120,
            avgTime: 60
          },
          nolife: {
            clicksPerTick: 0.5,
            minAttractionToLvlup: 1000000,
            avgTime: 100
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

