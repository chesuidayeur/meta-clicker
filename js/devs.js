function Dev(name, flavor, container) {
  this.id = devs.getId();
  this.name = name;
  this.flavor = flavor;

  this.container = container;

  this.displayed = false;
  this.enabled = false;
}
Dev.prototype = {
  build: function() {
    $('<div id="dev-'+this.id+'" class="dev"><label>'+this.name+'</label></div>').appendTo(this.container);
  },
  render: function() {
  }
}

var devs = {
  list: {},
  sequence: 0,
  getId: function() {
    var id = devs.sequence;
    devs.sequence++;
    return id;
  },
  hireDev: function() {
    var money = resourcePool.resources['money'];
    money.add(-1);
    var dev = new Dev('Dummy', 'Not a real dev', "#devs-container");
    dev.build();
    devs.list[dev.id] = dev;
  },
  isHireDevBtnEnabled: function() {
    var money = resourcePool.resources['money'].value;
    return (money >= 1);
  },

  init: function() {
    //UI.registerRenderer(devs.renderHireDevBtn);
    devs.hireDevBtn = new MetaButton(
        'hire-button',
        'Hire Dev',
        "Why work yourself when someone else can do it for you ?",
        'money',
        1,
        '#thingsToClick',
        devs.hireDev,
        devs.isHireDevBtnEnabled);

    UI.registerRenderer(devs.hireDevBtn.render.bind(devs.hireDevBtn));
  }
};
