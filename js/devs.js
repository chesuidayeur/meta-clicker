function Dev(id, name, desc) {
  this.id = id;
  this.name = name;
  this.flavor = desc;

  this.container = null;

  this.displayed = false;
  this.enabled = false;

  this.hired = false;
  this.salary = 0.1;
  this.productivity = 0.01;
}
Dev.prototype = {
  hire: function(container) {
    this.container = container;
    this.hired = true;
    resourcePool.resources['dev'].add(1);
    $('<div id="dev-'+this.id+'" class="dev"><label>'+this.name+'</label><br/>'+this.flavor+'</div>').appendTo(container);
  },
  leave: function() {
    this.hired = false;
    $('#dev-'+this.id).remove();
    UI.log(this.name + " left your team. Beware, devs won't work for free !");
  },
  render: function() {
  },
  production: function() {
    var money = resourcePool.resources['money'].value;
    if (money >= this.salary) {
      resourcePool.resources['money'].add(-this.salary);
      resourcePool.resources['code'].add(this.productivity);
    } else {
      this.leave();
    }
  },
  lifeOfDev: function() {
    this.production();
  }
}

var devs = {
  price: { resource: 'money', amount: 10, ratio: 5 },
  list: [],
  getAvailableDev: function() {
    var availableDevs = devs.list.findAll(function(e) { return !e.hired });
    console.log(availableDevs);
    var i = Math.ceil(Math.random()*availableDevs.length);
    console.log(i);
    var j = devs.list.findIndex(function(e) { return (e.id == availableDevs[i].id) });
    console.log(j);
    return devs.list[j];
  },
  getCost: function() {
    return Math.round(devs.price.amount * Math.pow(devs.price.ratio, resourcePool.resources['dev'].value) * 1000) / 1000;
  },
  hireDev: function() {
    var money = resourcePool.resources['money'];
    var cost = devs.getCost();
    money.add(-cost);
    var dev = devs.getAvailableDev();
    dev.hire("#devs-container");
  },
  isHireDevBtnEnabled: function() {
    var money = resourcePool.resources['money'].value;
    return (money >= devs.getCost());
  },
  production: function() {
    for (d in devs.list) { if (devs.list[d].hired) { devs.list[d].production(); } }
  },

  init: function() {
    devs.hireDevBtn = new MetaButton(
        'hire-button',
        'Hire Dev',
        "Why work yourself when someone else can do it for you ?",
        devs.price.resource,
        Math.round(devs.price.amount * 0.1),
        '#thingsToClick',
        devs.hireDev,
        devs.isHireDevBtnEnabled);

    UI.registerRenderer(devs.hireDevBtn.render.bind(devs.hireDevBtn));

    devs.list.add(new Dev('touring', 'Alan Touring', 'The wandering hacker, first of his order'));
    devs.list.add(new Dev('hackerman', 'Hackerman', 'Spawn of the 80s, can he really hack time ?'));
    devs.list.add(new Dev('jeeve', 'Jeeve Stop', 'Master of design, he works a lot, really, never ever stops !'));
    devs.list.add(new Dev('john', 'John Stallman', 'Never shows his code, his brother is a bit more famous'));
    devs.list.add(new Dev('knoos', 'Knoos', "Good with ideas, writes books, for some reason doesn't answer emails"));
    devs.list.add(new Dev('door', 'William Doors', 'Good at making money with computer, bad taste for glasses though'));
    devs.list.add(new Dev('neo', 'Thomas Anderson', "Rumoured to hack the very fabric of the universe; doing so with kung fu, he's a bit dangerous to have around"));
    devs.list.add(new Dev('knot', "Mark 'Knot' Nobody", 'Always seen with a pickaxe, can he code with this ?'));
  }
};
