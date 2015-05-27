function Dev(name, flavor) {
  this.name = name;
  this.flavor = flavor;

  this.displayed = false;
  this.enabled = false;
}
Dev.prototype = {
  display: function() {
  },
  render: function() {
  }
}

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

var devs = {
  hireDev: function() {
    var money = resourcePool.resources['money'];
    money.add(-1);
    UI.log("Hahaha ! Ben, non ! Mais bientôt !");
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
