QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "QUnit works, great!" );
});

/* Resource testing */
QUnit.test("Resource testing", function(assert) {
  var res = new Resource('cookies', 'Best developer fuel ever', '.resources');

  assert.equal(res.toString(), 'cookies : 0', 'toString() test');

  assert.equal(res.getRawValue(), 0, 'Initial raw value');
  assert.equal(res.getValue(), 0, 'Initial diplayed value');

  res.add(3);

  assert.equal(res.getRawValue(), 3, 'Raw value after adding some');
  assert.equal(res.getValue(), 3, 'Diplayed value after adding some');

  res.add(3.1415926);

  assert.equal(res.getRawValue(), 6.1415926, 'Raw value after float value added');
  assert.equal(res.getValue(), 6.142, 'Diplayed value after float value added');

  res.consume(2);

  assert.equal(res.getRawValue(), 4.1415926, 'Raw value after some used');
  assert.equal(res.getValue(), 4.142, 'Displayed value after some used');

  res.display();
  assert.equal($("#qunit-fixture div.resources div#cookies").length, 1, 'Adding to the DOM');
  assert.equal($("#qunit-fixture div.resources div#cookies span.value").html(), "4.142", 'Value displayed to the user');

  res.displayed = false;
  $("#qunit-fixture div.resources div#cookies").remove();
  res.render();
  assert.equal($("#qunit-fixture div.resources div#cookies").length, 1, 'Rendering');
  assert.equal($("#qunit-fixture div.resources div#cookies span.value").html(), "4.142", 'Displayed value after rendering');

  res.add(1);
  res.render();
  assert.equal($("#qunit-fixture div.resources div#cookies span.value").html(), "5.142", 'Render updates the displayed value');
});

/* Clicker testing */
QUnit.test("Clicker testing", function(assert) {
  UI = {
    unglitchButton: function() { console.log('unglitchButton called'); }
  };
  /* We need a resource for a clicker, let's create a mock one */
  resourcePool.resources['cookies'] = {
    name: 'cookies',
    value: 0,
    flavor: 'yummy',
    add: function() { this.value += 1; }
  };

  var c = new Clicker('cookies', 'Bake cookies !!', 'yummy', '.clickers');

  assert.equal(resourcePool.resources['cookies'].value, 0, 'Initial value');
  c.click();
  assert.equal(resourcePool.resources['cookies'].value, 1, 'Value after click');

  c.display();
  assert.equal($("#qunit-fixture div.clickers button#cookiesButton").length, 1, 'Adding to the DOM');
});

QUnit.test("Distiller testing", function(assert) {
  metaGame = {
    pctToReveal : 0.1
  };
  /* We override UI namespace */
  UI = {
    unglitchButton: function() { console.log('unglitchButton called'); },
    log: function(m) { console.log(m); },
    error: function(m) { UI.errors += 1; },
    errors: 0
  };
  /* We need two resources for a distiller : mocks ! */
  resourcePool.resources['cookies'] = {
    name: 'cookies',
    value: 0,
    flavor: 'yummy',
    add: function(v) { this.value += v; }
  };
  resourcePool.resources['karma'] = {
    name: 'karma',
    value: 0,
    flavor: 'good for your soul',
    add: function(v) { this.value += v; }
  };

  var d = new Distiller('cookies', 10, 'karma', 'good for your soul', '.clickers', metaGame);

  d.distill();

  assert.equal(resourcePool.resources['cookies'].value, 0, 'Initial cookie value unchanged');
  assert.equal(resourcePool.resources['karma'].value, 0, 'Initial karma value unchanged');
  assert.equal(UI.errors, 1, '1 error occured');

  resourcePool.resources['cookies'].add(10);
  d.distill();
  
  assert.equal(UI.errors, 1, 'No new errors');
  assert.equal(resourcePool.resources['cookies'].value, 0, '10 Cookies transformed !!');
  assert.equal(resourcePool.resources['karma'].value, 1, '1 karma produced');

  d.display();
  assert.equal($('div#qunit-fixture div.clickers button#distill-cookies').length, 1, 'Adding to the DOM');

  /* Adding enough resources for the distiller to be enabled */
  resourcePool.resources['cookies'].add(10);
  /* Distiller reset */
  d.displayed = false;
  $("#qunit-fixture div.clickers button#distill-cookies").remove();
  /* Rendering */
  d.render();

  assert.equal(d.enabled, true, 'Button enabled')
  assert.equal($('div#qunit-fixture div.clickers button#distill-cookies span').html(), 'Distill cookies', 'Rendering');

  d.toggle();

  assert.equal(d.enabled, false, 'Toggle');

  /* Consuming all the resources */
  d.distill();
  /* Distiller reset */
  d.displayed = false;
  $("#qunit-fixture div.clickers button#distill-cookies").remove();

  d.render();

  assert.equal(d.displayed, false, 'Not enough resources to reveal');

  /* Adding enough resources to reveal */
  resourcePool.resources['cookies'].add(2);
  d.render();

  assert.equal(d.displayed, true, 'Enough resources to reveal');
});
