function Resource(name) {
  this.name = name;
  this.value = 0;
  this.displayed = false;
  this.toString = function() {
    return this.name + " : " + this.value;
  };
  this.render = function() {
    if (!this.displayed && this.value > 0) {
      this.displayed = true;
      $('<div id="'+this.name+'">'+this.name+' : <span class="value"></span><div>').appendTo("#resources");
    }
    $("#"+this.name+" span.value").html(Math.round(this.value * 1000) / 1000);
  }
}

var resourcePool = {
  resources : {},
  init : function() {
    this.resources['clic'] = new Resource('clic');
    this.resources['gamelore'] = new Resource('gamelore');
  }
};

