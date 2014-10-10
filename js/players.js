function Players(game, conf) {
  this.game = game;

  this.data = {
    noob: {
      number: 0,
      clicksPerTick: conf.noob.clicksPerTick,
      attractionToUnlock: conf.noob.attractionToUnlock,
      avgTime: conf.noob.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    casual : {
      number: 0,
      clicksPerTick: conf.casual.clicksPerTick,
      attractionToUnlock: conf.casual.attractionToUnlock,
      avgTime: conf.casual.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    seasoned : {
      number: 0,
      clicksPerTick: conf.seasoned.clicksPerTick,
      attractionToUnlock: conf.seasoned.attractionToUnlock,
      avgTime: conf.seasoned.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    hardcore : {
      number: 0,
      clicksPerTick: conf.hardcore.clicksPerTick,
      attractionToUnlock: conf.hardcore.attractionToUnlock,
      avgTime: conf.hardcore.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ },
    nolife : {
      number: 0,
      clicksPerTick: conf.nolife.clicksPerTick,
      attractionToUnlock: conf.nolife.attractionToUnlock,
      avgTime: conf.nolife.avgTime, /* Number of ticks */
      playedTime: 0 /* Number of ticks */ }};

  this.toHTML = function() {
    var spans = [];
    for (var type in this.data) {
      var disabled = 'style="display: none;"';
      if (this.data[type].attractionToUnlock <= this.game.attraction) {
        disabled = '';
      }
      spans.add('<span class="'+type+'" title="'+type+'s" '+disabled+'>'+this.data[type].number+'</span>');
    }
    return spans.join(' ');
  };

  this.updateUI = function() {
    for (var type in this.data) {
      var elt = $('#players-'+this.game.code+' span.'+type);
      if ($(elt).css("display") == 'none' && this.data[type].number > 0) {
        $(elt).css("display", "");
      }
      $(elt).html(this.data[type].number);
    }
  };

  this.getProduction = function() {
    var prod = 0;

    for (var type in this.data) {
      prod += this.data[type].number * this.data[type].clicksPerTick;
    }

    return prod;
  };

  this.newPlayers = function() {
    var newPlayers = 0;
    var rand = Math.random() * 10;
    if (rand < this.game.getAttraction()) {
      console.log('yeah, new players');
      newPlayers = Math.ceil(Math.log(this.game.getAttraction()));
    }
    return newPlayers;
  };

  this.playersPlay = function() {
    var newPlayers = this.newPlayers();
    for (var type in this.data) {
      //console.log('Player : '+type);
      var player = this.data[type];
      player.playedTime += player.number;
      if (type == 'noob' && player.number > 0) {
        console.log("Played time : "+player.playedTime);
      }

      /* Test wether some players are fed up */
      var gameAttraction = this.game.getAttraction();
      var leavingThreshold = this.getLeavingThreshold();
      if (false && type == 'noob' && player.number > 0) {
        console.log('Played Time / Threshold / ThresholdPlayer : '+player.playedTime+' / '+leavingThreshold+' / '+(leavingThreshold * player.number));
      }
      if (player.playedTime > leavingThreshold * player.number) {
        /* Number of leaving players */
        var rand = Math.random() * (1 - 0.8) + 0.9; /* 0.9 <= Rand <= 1.1 */
        var ratio = player.playedTime / leavingThreshold;
        console.log('Rand * ratio : '+rand+' * '+ratio+' = '+(rand * ratio));
        var leavingPlayers = Math.min(player.number, Math.floor(rand * ratio));
        console.log("Leaving players : "+leavingPlayers);
        player.number -= leavingPlayers;
        if (player.number <= 0) {
          player.number = 0;
          player.playedTime = 0;
        } else {
          player.playedTime -= leavingPlayers * leavingThreshold;
        }
      }

      var lvlups = 0;
      /* Test whether some players level up */
      if (type == 'noob' && player.number > 0) {
        console.log('Lvlup : '+player.playedTime+' | '+player.avgTime+' | '+(player.avgTime * player.number));
      }
      if (type != 'nolife' &&
          player.number > 0 &&
          player.playedTime > player.avgTime * player.number &&
          gameAttraction > player.attractionToUnlock) {
        /* Number of players leveling up */
        lvlups = Math.min(
          player.number,
          Math.floor(
            (Math.random() * (1 - 0.8) + 0.9)
            * player.playedTime / player.avgTime
        ));
        console.log('Lvl ups : '+lvlups);
        player.number -= lvlups;
        if (player.number <= 0) {
          player.number = 0;
          player.playedTime = 0;
        } else {
          player.playedTime -= lvlups * player.avgTime;
        }
      }

      /* New players ! */
      player.number += newPlayers;
      newPlayers = lvlups;
    }
    
    this.updateUI();
  };

  this.getAttractionBonus = function() {
    var bonus = 0;
    for (var type in this.data) {
      bonus += this.data[type].number;
    }
    return bonus * 0.01;
  };

  this.getLeavingThreshold = function() {
    return this.game.getAttraction() * 0.1 * 100;
  }
}
