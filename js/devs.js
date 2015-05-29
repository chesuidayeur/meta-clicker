function Dev(dev, container) {
  this.id = dev.id;
  this.name = dev.name;
  this.flavor = dev.desc;

  this.container = container;

  this.displayed = false;
  this.enabled = false;
}
Dev.prototype = {
  build: function() {
    $('<div id="dev-'+this.id+'" class="dev"><label>'+this.name+'</label><br/>'+this.flavor+'</div>').appendTo(this.container);
  },
  render: function() {
  }
}

var devs = {
  pool: [
    { id: 'touring',  name: 'Alan Touring', desc: 'The wandering hacker, first of his order', hired: false },
    { id: 'hackerman',  name: 'Hackerman', decc: 'Spawn of the 80s, he likes to hack', hired: false },
    { id: 'jeeve',  name: 'Jeeve Stop', desc: 'Master of design, he works a lot, really, never ever stops !', hired: false },
    { id: 'john',  name: 'John Stallman', desc: 'Never shows his code, his brother is a bit more famous', hired: false },
    { id: 'knoos',  name: 'Knoos', desc: "Good with ideas, writes books, for some reason doesn't answer emails", hired: false },
    { id: 'door',  name: 'William Doors', desc: 'Good at making money with computer, bad taste for glasses though', hired: false },
    { id: 'neo',  name: 'Thomas Anderson', desc: "Rumoured to hack the very fabric of the universe, doing so with kung fu, he's a bit dangerous to have around", hired: false },
    { id: 'knot',  name: "Mark 'Knot' Nobody", desc: 'Always seen with a pickaxe, can he code with it ?', hired: false }
  ],
  getAvailableDev: function() {
    var availableDevs = devs.pool.findAll(function(e) { return !e.hired });
    var i = Math.ceil(Math.random()*availableDevs.length);
    var j = devs.pool.findIndex(function(e) { return (e.id == availableDevs[i].id) });
    devs.pool[j].hired = true;
    return devs.pool[j];
  },
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
    var dev = new Dev(devs.getAvailableDev(), "#devs-container");
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
