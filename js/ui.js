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
  error: function(message) {
    game.saveErrors(message);
    $('div#log').html('Day '+Timr.day+' : '+message+'<br/>'+$('div#log').html());
  },
  unglitchButton : function (btn) {
    // Hack from bwhit from http://stackoverflow.com/questions/3861307
    $(btn).button()
      .bind('mouseup', function() {
          $(this).blur();     // prevent jquery ui button from remaining in the active state
    });
  }
}

