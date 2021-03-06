/* General class for a button */
function Clicker(resource) {
  /* Resource produced buy a click */
  this.resource = resource;
  /* What happens when you click. Mainly adding some resource to the pool */
  this.click = function() {
    resourcePool.resources[this.resource].add(1);
  };
};

/* General class to transform a resource into another */
function Distiller(resource, amount, resultResource) {
  /* Source resource */
  this.resource = resource;
  /* Result resource */
  this.resultResource = resultResource;
  /* Amount of the source resource to get 1 result resource */
  this.amount = amount;

  /* Wether the distiller is displayed (visible in the UI) or not */
  this.displayed = false;
  /* Wether the distiller is enabled (clickable) or not */
  this.enabled = false;

  /* Mysteries of the distillation */
  this.distill = function() {
    var res = resourcePool.resources[this.resource];
    var resAmount = res.value;
    res.value = Math.round((res.value - this.amount) * 1000) / 1000;
    
    var resultRes = resourcePool.resources[this.resultResource];
    var resultResAmount = resultRes.value;
    resultRes.value = Math.round((resultResAmount + 1) * 1000) / 1000;
  }
  /* Utility function to enable or disable the distiller */
  this.toggle = function() {
    this.enabled = !this.enabled;
    $("#distill-"+this.resource).button("option", "disabled", !this.enabled);
  }

  /* Where we ask the distiller to display itself */
  this.render = function() {
    /* If the distiller is not displayed and enough source resource has been collected, let's reveal it to the world */
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
    /* Some code to enable and disable the distiller according to source resource availability */
    if (this.enabled && this.amount > resourcePool.resources[this.resource].value) {
      this.toggle();
    }
    if (!this.enabled && this.amount <= resourcePool.resources[this.resource].value) {
      this.toggle();
    }
  }
}

