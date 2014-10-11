function Resource(name, flavor) {
  /* Name of the resource */
  this.name = name;
  /* Initial value of the resource */
  this.value = 0;
  /* Total accumulated value */
  this.accValue = 0;
  /* Is the resource visible ? */
  this.displayed = false;
  /* Add some depth to your game */
  this.flavor = flavor;
  /* Nice function, really */
  this.toString = function() {
    return this.name + " : " + this.value;
  };
  /* Where we ask the resource to render itself */
  this.render = function() {
    /* If the resource is not displayed and some has been collected, well, we'd better display it */
    if (!this.displayed && this.value > 0) {
      this.displayed = true;
      $('<div id="'+this.name+'">'+this.name+' : <span class="value"></span><div>').appendTo("#resources");
    }
    /* Update of the value of the resource */
    $("#"+this.name+" span.value").html(Math.round(this.value * 1000) / 1000);
  };
  /* Add some resource to the pool */
  this.add = function(amount) {
    this.value += amount;
    this.accValue += amount;
  }
  /* Consume some of the resource */
  this.consume = function(amount) {
    this.value -= amount;
  }
}

/* Cosy place to store resources */
var resourcePool = {
  /* All the resources, ALL, nicely stacked */
  resources : {},
  /* Where resources are created, a quasi mystical place */
  init : function() {
    this.resources['clic'] = new Resource('clic', 'Click it !!');
    this.resources['money'] = new Resource('money',  'Sell your clics to mouse facturing companies !');
  }
};

