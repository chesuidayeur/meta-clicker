function Clicker(resource) {
  this.resource = resource;
  this.click = function() {
    resourcePool.resources[this.resource].add(1);
  };
  // initialisation du bouton
  $(this.elt).button().click(function() {
    var res = $(this).attr('resource');

    resourcePool.resources[res].add(1);
  });
};

function Distiller(resource, amount, resultResource) {
  this.resource = resource;
  this.amount = amount;
  this.resultResource = resultResource;
  this.displayed = false;
  this.enabled = false;
  this.distill = function() {
    var res = resourcePool.resources[this.resource];
    var resAmount = res.value;
    res.value = Math.round((res.value - this.amount) * 1000) / 1000;
    
    var resultRes = resourcePool.resources[this.resultResource];
    var resultResAmount = resultRes.value;
    resultRes.value = Math.round((resultResAmount + 1) * 1000) / 1000;
  }
  this.toggle = function() {
    this.enabled = !this.enabled;
    $("#distill-"+this.resource).button("option", "disabled", !this.enabled);
  }

  this.render = function() {
    if (!this.displayed && this.amount * metaGame.pctToReveal < resourcePool.resources[this.resource].value) {
      this.displayed = true;
      $('<button id="distill-'+this.resource+'" resource="'+this.resource+'">Distill '+this.resource+'</button>').appendTo($('#thingsToClick'));
      $("#distill-"+this.resource)
        .button({ disabled : !this.enabled })
        .click(function() {
          $(this).button("disable");
          var distiller = distillers.list[$(this).attr('resource')];
          distiller.distill();
          distiller.toggle();
        });
    }
    if (this.enabled && this.amount > resourcePool.resources[this.resource].value) {
      this.toggle();
    }
    if (!this.enabled && this.amount <= resourcePool.resources[this.resource].value) {
      this.toggle();
    }
  }
}

