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

$(document).ready(function () {
  resourcePool.init();
  games.init();
  distillers.init();

  Timer.start();
});
