function Players(game, conf) {
  this.game = game;

  this.data = {
    noob: {
      list: [],
      clicksPerTick: conf.noob.clicksPerTick,
      attractionToUnlock: conf.noob.attractionToUnlock,
      avgTime: conf.noob.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    casual : {
      list: [],
      clicksPerTick: conf.casual.clicksPerTick,
      attractionToUnlock: conf.casual.attractionToUnlock,
      avgTime: conf.casual.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    seasoned : {
      list: [],
      clicksPerTick: conf.seasoned.clicksPerTick,
      attractionToUnlock: conf.seasoned.attractionToUnlock,
      avgTime: conf.seasoned.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    hardcore : {
      list: [],
      clicksPerTick: conf.hardcore.clicksPerTick,
      attractionToUnlock: conf.hardcore.attractionToUnlock,
      avgTime: conf.hardcore.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    nolife : {
      list: [],
      clicksPerTick: conf.nolife.clicksPerTick,
      attractionToUnlock: conf.nolife.attractionToUnlock,
      avgTime: conf.nolife.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ }};

  this.toHTML = function() {
    var spans = [];
    for (var type in this.data) {
      var disabled = 'style="display: none;"';
      var sep = '';
      if (this.data[type].attractionToUnlock <= this.game.attraction) {
        disabled = '';
      }
      if (type != 'noob') {
        sep = ' / '
      }
      spans.add('<span class="'+type+'" title="'+type+'s" '+disabled+'>'+sep+this.data[type].list.length+'</span>');
    }
    return 'Players : '+spans.join('');
  };

  this.updateUI = function() {
    for (var type in this.data) {
      var sep = '';
      if (type != 'noob') {
        sep = ' / '
      }
      var elt = $('#players-'+this.game.code+' span.'+type);
      if ($(elt).css("display") == 'none' && this.data[type].list.length > 0) {
        $(elt).css("display", "");
      }
      $(elt).html(sep+this.data[type].list.length);
    }
  };

  this.getProduction = function() {
    var prod = 0;

    for (var type in this.data) {
      prod += this.data[type].list.length * this.data[type].clicksPerTick;
    }

    return prod;
  };

  this.newPlayers = function() {
    var newPlayers = 0;
    var rand = Math.random() * 10;
    if (rand < this.game.getAttraction()) {
      UI.log('yeah, new players');
      newPlayers = Math.ceil(Math.log(this.game.getAttraction()));
    }
    return newPlayers;
  };

  this.playersPlay = function() {
    var newPlayers = this.newPlayers();
    for (var type in this.data) {
      //UI.log('Player : '+type);
      var player = this.data[type];
      player.list = player.list.map(function(n) { return n+1; });

      /* Test wether some players are fed up */
      var gameAttraction = this.game.getAttraction();
      var leavingThreshold = this.getLeavingThreshold();
      var remainingPlayers = player.list
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
          this.game.maxAttraction > player.attractionToUnlock) {
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

      /* New players ! */
      while (newPlayers > 0) {
        player.list.push(1);
        newPlayers--;
      }
      newPlayers = lvlups;
    }
    
    this.updateUI();
  };

  this.getAttractionBonus = function() {
    var bonus = 0;
    for (var type in this.data) {
      bonus += this.data[type].list.length;
    }
    return bonus * 0.01;
  };

  this.getLeavingThreshold = function() {
    return this.game.getAttraction() * 0.1 * 100;
  }
}
