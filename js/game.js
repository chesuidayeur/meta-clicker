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

var UI = {
  renderers : [],
  registerRenderer : function(callback) {
    this.renderers.add(callback);
  },
  render : function () {
    this.renderers.each(function(r) { r(); })
  },
  update : function () {
  },
  log: function(message) {
    $('div#log').html('Day '+Timer.day+' : '+message+'<br/>'+$('div#log').html());
  },
  unglitchButton : function (btn) {
    // Hack from bwhit from http://stackoverflow.com/questions/3861307
    $(btn).button()
      .bind('mouseup', function() {
          $(this).blur();     // prevent jquery ui button from remaining in the active state
    });
  }
}

$(document).ready(function () {
  resourcePool.init();
  games.init();
  distillers.init();

  Timer.start();
});
