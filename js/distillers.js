/* General class for a button */
function Clicker(resource, text, flavor, container) {
  /* Resource produced buy a click */
  this.resource = resource;
  /* DOM element where to put the clicker */
  this.container = container;
  /* Description of the clicker */
  this.text = text;
  /* Tip */
  this.flavor = flavor;
};
Clicker.prototype = {
  /* What happens when you click. Mainly adding some resource to the pool */
  click: function() {
    resourcePool.resources[this.resource].add(1);
  },
  display: function() {
    $('<button id="'+this.resource+'Button" class="clicker" resource="'+this.resource+'" title="'+this.flavor+'">'+this.text+'</button>').appendTo(this.container);
    $('button#'+this.resource+'Button').button().click(this.click.bind(this));
    UI.unglitchButton('button#'+this.resource+'Button');
  }
};

/* General class to transform a resource into another */
function Distiller(resource, amount, resultResource, flavor, container, conf) {
  /* Source resource */
  this.resource = resource;
  /* Result resource */
  this.resultResource = resultResource;
  /* Amount of the source resource to get 1 result resource */
  this.amount = amount;
  /* Flavor your game */
  this.flavor = flavor;
  /* DOW elt where to put the distiller */
  this.container = container;
  /* App configuration */
  this.conf = conf;

  /* Wether the distiller is displayed (visible in the UI) or not */
  this.displayed = false;
  /* Wether the distiller is enabled (clickable) or not */
  this.enabled = false;
};
Distiller.prototype = {
  /* Mysteries of the distillation */
  distill: function() {
    var res = resourcePool.resources[this.resource];
    if (res.value < this.amount) {
      UI.error('A meta bug occured : you shouldnt be able to distill '+this.resource+' with only '+res.value+' units ('+this.amount+' needed)');
    } else {
      res.add(-this.amount);
      resourcePool.resources[this.resultResource].add(1);
    }
  },
  /* Utility function to enable or disable the distiller */
  toggle: function() {
    this.enabled = !this.enabled;
    $("#distill-"+this.resource).button("option", "disabled", !this.enabled);
  },
  /* Where we ask the distiller to display itself */
  render: function() {
    /* If the distiller is not displayed and enough source resource has been collected, let's reveal it to the world */
    if (!this.displayed && this.amount * this.conf.pctToReveal < resourcePool.resources[this.resource].value) {
      this.display();
    }
    /* Some code to enable and disable the distiller according to source resource availability */
    if (this.enabled && this.amount > resourcePool.resources[this.resource].value) {
      this.toggle();
    }
    if (!this.enabled && this.amount <= resourcePool.resources[this.resource].value) {
      this.toggle();
    }
  },
  /* Displays the distiller */
  display: function() {
    this.displayed = true;
    $('<button id="distill-'+this.resource+'" resource="'+this.resource+'">Distill '+this.resource+'</button>').appendTo(this.container);
    $("#distill-"+this.resource)
      .button({ disabled : !this.enabled })
      .attr('title', this.flavor)
      .click(this.click.bind(this));
  },
  /* What happens when you click the distiller */
  click: function() {
    this.toggle();
    this.distill();
  },
};

