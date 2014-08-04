var metaGame = {
  pctToReveal : 0.1
};

var Timer = {
  delay : 100,
  pid : null,

  update : function () {
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
  }
}

$(document).ready(function () {

  resourcePool.init();
  games.init();
  distillers.init();
  UI.clickers.init();

  Timer.start();
});
