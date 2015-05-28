function MetaButton(id, text, flavor, resource, amountToDisplay, container, clickCallback, isEnabledCallback) {
  this.id = id;
  this.text = text;
  this.flavor = flavor;

  this.resource = resource;
  this.amountToDisplay = amountToDisplay;
  this.container = container;

  this.clickCallback = clickCallback;
  this.isEnabledCallback = isEnabledCallback;

  this.built = false;
  this.enabled = false;
}
MetaButton.prototype = {
  build: function() {
    this.built = true;
    $('<button id="'+this.id+'">'+this.text+'</button>').appendTo(this.container);
    $("#"+this.id)
      .button({ disabled: !this.enabled })
      .attr('title', this.flavor)
      .click(this.click.bind(this));
  },
  render: function() {
    var resVal = resourcePool.resources[this.resource].value;
    if (!this.built && resVal >= this.amountToDisplay) {
      this.build();
    }
    if (this.enabled && this.isEnabledCallback()) { this.toggle(); }
    if (!this.enabled && this.isEnabledCallback()) { this.toggle(); }
  },
  toggle: function() {
    this.enabled = !this.enabled;
    $("#"+this.id).button("option", "disabled", !this.enabled);
  },
  click: function() {
    this.toggle();
    this.clickCallback();
  }
}

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

