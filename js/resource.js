function Resource(name) {
  /* Name of the resource */
  this.name = name;
  /* Initial value of the resource */
  this.value = 0;
  /* Is the resource visible ? */
  this.displayed = false;
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
  }
}

/* Cosy place to store resources */
var resourcePool = {
  /* All the resources, ALL, nicely stacked */
  resources : {},
  /* Where resources are created, a quasi mystical place */
  init : function() {
    this.resources['clic'] = new Resource('clic');
    this.resources['gamelore'] = new Resource('gamelore');
  }
};

