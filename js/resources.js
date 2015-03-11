function Resource(name, flavor, container) {
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
  /* Where to display the resource */
  this.container = container;
  /* Storage area for a clicker */
  this.clicker = null;
  /* Nice function, really */
  this.toString = function() {
    return this.name + " : " + this.getValue();
  };
  /* Where we ask the resource to render itself */
  this.render = function() {
    /* If the resource is not displayed and some has been collected, well, we'd better display it */
    if (!this.displayed && this.value > 0) {
      this.display();
    }
    /* Update of the value of the resource */
    $("#"+this.name+" span.value").html(this.getValue());
  };
  this.display = function() {
    this.displayed = true;
    $('<div id="'+this.name+'">'+this.name+' : <span class="value">' + this.getValue() + '</span><div>').appendTo(this.container);
  }
  this.getRawValue = function() {
    return this.value;
  };
  this.getValue = function() {
    return Math.round(this.value * 1000) / 1000;
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
  /* Add a clicker to generate units of the resource */
  this.addClicker = function(text, container) {
    this.clicker = new Clicker(this.name, text, this.flavor, container);
    this.clicker.display();
  }
}

/* Cosy place to store resources */
var resourcePool = {
  /* All the resources, ALL, nicely stacked */
  resources : {},
  /* Where resources are created, a quasi mystical place */
  init : function() {
    this.resources['code'] = new Resource('code', 'Coding time !', "#resources");
    this.resources['clic'] = new Resource('clic', 'Click it !!', "#resources");
    this.resources['money'] = new Resource('money',  'Sell your clics to mouse facturing companies !', "#resources");
    this.resources['dev'] = new Resource('dev', 'Code generating organism, may be sentient', "#resources");
    
    UI.registerRenderer(this.render.bind(this));

    var code = this.resources['code'];
    code.addClicker('Write code', "#clickers");
  },
  render : function() {
    for (var res in this.resources) {
      this.resources[res].render();
    };
  }
};

