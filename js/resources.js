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
}
Resource.prototype = {
  /* Nice function, really */
  toString : function() {
    return this.name + " : " + this.getValue();
  },
  /* Where we ask the resource to render itself */
  render : function() {
    /* If the resource is not displayed and some has been collected, well, we'd better display it */
    if (!this.displayed && this.value > 0) {
      this.display();
    }
    /* Update of the value of the resource */
    $("#"+this.name+" span.value").html(this.getValue());
  },
  display : function() {
    this.displayed = true;
    $('<div id="'+this.name+'">'+this.name+' : <span class="value">' + this.getValue() + '</span><div>').appendTo(this.container);
  },
  getRawValue : function() {
    return this.value;
  },
  getValue : function() {
    return Math.round(this.value * 1000) / 1000;
  },
  /* Add some resource to the pool */
  add : function(amount) {
    this.value += amount;
    this.accValue += amount;
  },
  /* Consume some of the resource */
  consume : function(amount) {
    this.value -= amount;
  },
  /* Add a clicker to generate units of the resource */
  addClicker : function(text, container) {
    this.clicker = new Clicker(this.name, text, this.flavor, container);
    this.clicker.display();
  },
  /* Add a distiller to generate another resource */
  distillFrom : function(resource, amount, container, conf) {
    this.distiller = new Distiller(resource, amount, this.name, this.flavor, container, conf);
    UI.registerRenderer(this.distiller.render.bind(this.distiller));
  }
};

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

    var money = this.resources['money'];
    money.distillFrom('clic', 10, "#thingsToClick", metaGame);
  },
  render : function() {
    for (var res in this.resources) {
      this.resources[res].render();
    };
  }
};

