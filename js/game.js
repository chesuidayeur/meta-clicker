var metaGame = {
  pctToReveal : 0.1,
  maxPlayerRatio: 1.3,
};

var Timer = {
  delay : 250, /* Tick duration in ms */
  pid : null,
  dayLength : 10, /* Number of ticks */
  day: 0,

  dayCounter : 0,

  update : function () {
    Timer.dayCounter += 1
    if (Timer.dayCounter == Timer.dayLength) {
      Timer.day++;
      $("span#days").html(Timer.day);
      games.update();
      Timer.dayCounter = 0;
    }
    games.production();
    UI.update();
    UI.render();
  },

  start : function () {
    this.pid = setInterval(this.update, this.delay);
  },
  stop : function() {
    clearInterval(this.pid);
  }
};

var distillers = {
  list : {},
  init : function() {
    this.list['clic'] = new Distiller('clic', 1, 'gamelore');
  }
};

var UI = {
  clickers : {
    elts : {},
    init : function () {
      $('.clicker').each(function() {
        var res = $(this).attr('resource');
        UI.clickers.elts[res] = new Clicker(res);
        $(this).button().click(function() {
          var res = $(this).attr('resource');
          UI.clickers.elts[res].click();
        });
      });
    }
  },
  render : function () {
    for (var res in resourcePool.resources) {
      resourcePool.resources[res].render();
    };
    for (var g in games.list) {
      games.list[g].render();
    };
    for (var d in distillers.list) {
      distillers.list[d].render();
    }
  },
  update : function () {
  },
  log: function(message) {
    $('div#log').html('Day '+Timer.day+' : '+message+'<br/>'+$('div#log').html());
  }
}

$(document).ready(function () {

  // Hack from bwhit from http://stackoverflow.com/questions/3861307
  $("button, input[type='button'], input[type='submit']").button()
    .bind('mouseup', function() {
        $(this).blur();     // prevent jquery ui button from remaining in the active state
  });

  resourcePool.init();
  games.init();
  distillers.init();
  UI.clickers.init();

  Timer.start();
});
