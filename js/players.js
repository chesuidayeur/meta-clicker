function Players(game, conf) {
  this.game = game;
  this.displayes = false;

  this.data = {
    noob: {
      list: [],
      clicksPerTick: conf.noob.clicksPerTick,
      minAttractionToLvlup: conf.noob.minAttractionToLvlup,
      avgTime: conf.noob.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    casual : {
      list: [],
      clicksPerTick: conf.casual.clicksPerTick,
      minAttractionToLvlup: conf.casual.minAttractionToLvlup,
      avgTime: conf.casual.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    seasoned : {
      list: [],
      clicksPerTick: conf.seasoned.clicksPerTick,
      minAttractionToLvlup: conf.seasoned.minAttractionToLvlup,
      avgTime: conf.seasoned.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    hardcore : {
      list: [],
      clicksPerTick: conf.hardcore.clicksPerTick,
      minAttractionToLvlup: conf.hardcore.minAttractionToLvlup,
      avgTime: conf.hardcore.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    nolife : {
      list: [],
      clicksPerTick: conf.nolife.clicksPerTick,
      minAttractionToLvlup: conf.nolife.minAttractionToLvlup,
      avgTime: conf.nolife.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ }};
};

Players.prototype = {
  toHTML: function() {
    var spans = [];
    for (var type in this.data) {
      var disabled = 'style="display: none;"';
      var sep = ' / ';
      if (this.data[type].minAttractionToLvlup <= this.game.attraction) {
        disabled = '';
      }
      if (type == 'noob') {
        sep = ''
      }
      spans.add('<span class="'+type+'" title="'+type+'s" '+disabled+'>'+sep+this.data[type].list.length+'</span>');
    }
    return 'Players : '+spans.join('');
  },
  
  display: function() {
    this.displayed = true;
    $('div#players-'+this.game.code).html(this.toHTML());
  },

  updateUI: function() {
    for (var type in this.data) {
      var sep = ' / ';
      if (type == 'noob') {
        sep = ''
      }
      var elt = $('#players-'+this.game.code+' span.'+type);
      if ($(elt).css("display") == 'none' && this.data[type].list.length > 0) {
        $(elt).css("display", "");
      }
      $(elt).html(sep+this.data[type].list.length);
    }
  },

  getProduction: function() {
    var prod = 0;

    for (var type in this.data) {
      var cpt = this.data[type].clicksPerTick;
      var playersList = this.data[type].list
      for (var k in playersList) {
        prod += cpt * (1 + playersList[k] * 0.01)
      }
    }

    return prod;
  },

  newPlayers: function() {
    var newPlayers = 0;
    var rand = Math.random();
    // 10% probability plus epsilon depending on game attraction
    if (rand < 0.1 + (this.game.getAttraction() / 100)) {
      UI.log('yeah, new players');
      newPlayers = Math.ceil(Math.log10(this.game.getAttraction()));
    }
    return newPlayers;
  },

  playersPlay: function() {
    var newPlayers = this.newPlayers();
    for (var type in this.data) {
      var player = this.data[type];
      if (player.list.length > 0) {
        player.list = player.list.map(function(n) { return n+1; });
  
        /* Test wether some players are fed up */
        var gameAttraction = this.game.getAttraction();
        var leavingThreshold = player.avgTime + this.getLeavingThresholdBonus();
        var remainingPlayers = player.list;
        for (var p in player.list) {
          var rand = Math.random();
          var proba = 1 / (1 + Math.exp(-player.list[p] + leavingThreshold));
          if (rand < proba) {
            UI.log('Leaving player');
            remainingPlayers.splice(p, 1);
          }
        }
        player.list = remainingPlayers;
  
        /* Test wether some players level up */
        var lvlups = 0;
        if (player.list.length > 0 &&
            this.game.maxAttraction > player.minAttractionToLvlup) {
          for (var p in player.list) {
            var rand = Math.random();
            var proba = 1 / (1 + Math.exp(-player.list[p] + player.avgTime));
            if (rand < proba) {
              UI.log('lvl up');
              remainingPlayers.splice(p, 1);
              lvlups++;
            }
          }
          player.list = remainingPlayers;
        }
      }
  
      /* New players ! */
      while (newPlayers > 0) {
        player.list.push(1);
        newPlayers--;
      }
      newPlayers = lvlups;
    }
    
    this.updateUI();
  },

  getAttractionBonus: function() {
    var bonus = 0;
    for (var type in this.data) {
      bonus += this.data[type].list.length;
    }
    return bonus * 0.01;
  },

  getLeavingThresholdBonus: function() {
    return this.game.getAttraction();
  },
};
